
import { useState, useEffect } from 'react';
import { T } from '../../lib/theme';

export default function PostCard({ post, delay, platform }) {
  const [visible, setVisible] = useState(false);
  const [typed,   setTyped]   = useState('');
  const [done,    setDone]    = useState(false);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    let interval;
    const timer = setTimeout(() => {
      setVisible(true);
      let i = 0;
      const content = post.content ?? '';
      interval = setInterval(() => {
        i = Math.min(i + 5, content.length);
        setTyped(content.slice(0, i));
        if (i >= content.length) { clearInterval(interval); setDone(true); }
      }, 14);
    }, delay);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [post.content, delay]);

  function copy() {
    const full = (post.content ?? '') + '\n\n' + (post.hashtags ?? []).map(h => '#' + h).join(' ');
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="pcard" style={{
      background:  T.surface,
      border:      `0.5px solid ${T.border}`,
      borderRadius:'12px',
      padding:     '18px 20px',
      opacity:     visible ? 1 : 0,
      transform:   visible ? 'translateY(0)' : 'translateY(10px)',
      transition:  'opacity 0.4s ease, transform 0.4s ease',
    }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
        <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
          <span style={{ fontSize:'11px', fontWeight:'500', background:T.surface2, color:T.sec, padding:'2px 8px', borderRadius:'4px', border:`0.5px solid ${T.border}` }}>
            Post {(post.index ?? 0) + 1}
          </span>
          {post.angle && <span style={{ fontSize:'12px', color:T.muted, fontStyle:'italic' }}>{post.angle}</span>}
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {post.best_time && (
            <span style={{ fontSize:'12px', color:T.muted }}>
              <i className="ti ti-clock" style={{ fontSize:'12px', verticalAlign:'-1px', marginRight:'3px' }} aria-hidden="true" />
              {post.best_time}
            </span>
          )}
          <button className="cpb" onClick={copy} style={{ background:'transparent', border:`0.5px solid ${T.border}`, borderRadius:'6px', padding:'4px 10px', fontSize:'12px', color:copied?T.accent:T.sec, cursor:'pointer', display:'flex', alignItems:'center', gap:'4px' }}>
            <i className={`ti ${copied ? 'ti-check' : 'ti-copy'}`} style={{ fontSize:'12px' }} aria-hidden="true" />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Typed content */}
      <p style={{ fontSize:'14px', lineHeight:'1.75', color:T.text, marginBottom:'14px', minHeight:'52px' }}>
        {typed}
        {!done && visible && (
          <span style={{ display:'inline-block', width:'2px', height:'13px', background:T.accent, marginLeft:'1px', verticalAlign:'text-bottom', animation:'blink 0.65s ease infinite' }} />
        )}
      </p>

      {/* Hashtags + char count */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'5px' }}>
        <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
          {(post.hashtags ?? []).map((tag, j) => (
            <span key={j} style={{ fontSize:'12px', background:T.accentBg, color:T.accent, padding:'2px 8px', borderRadius:'4px', border:`0.5px solid ${T.accentBdr}`, fontWeight:'500' }}>
              #{tag}
            </span>
          ))}
        </div>
        {platform === 'twitter' && (
          <span style={{ fontSize:'11px', color:(post.content?.length ?? 0) > 280 ? T.red : T.muted }}>
            {post.content?.length ?? 0}/280
          </span>
        )}
      </div>
    </div>
  );
}