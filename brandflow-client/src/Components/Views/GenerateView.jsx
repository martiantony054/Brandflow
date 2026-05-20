
import { useState } from 'react';
import { T, PLATFORMS, TONES } from '../../lib/theme';
import { generatePosts }        from '../../lib/api';
import Heading                  from '../Ui/Heading';
import Skeleton                 from '../Ui/Skeleton';
import PostCard                 from '../Ui/PostCard';

export default function GenerateView() {
  const [platform, setPlatform] = useState('instagram');
  const [topic,    setTopic]    = useState('');
  const [tone,     setTone]     = useState('Professional');
  const [loading,  setLoading]  = useState(false);
  const [posts,    setPosts]    = useState([]);
  const [error,    setError]    = useState('');

  async function handleGenerate() {
    if (!topic.trim()) return;
    setLoading(true); setError(''); setPosts([]);
    try {
      const { posts: generated } = await generatePosts({ platform, topic, tone });
      setPosts(generated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const pf = PLATFORMS.find(p => p.id === platform);

  return (
    <div style={{ padding:'28px 24px', animation:'fadeIn 0.25s ease' }}>
      <Heading title="Content generator" sub="Platform-optimized posts from a brief" />

      {/* Platform tabs */}
      <div style={{ display:'flex', gap:'5px', marginBottom:'14px', flexWrap:'wrap' }}>
        {PLATFORMS.map(p => (
          <button key={p.id} className="ptab" onClick={() => setPlatform(p.id)} style={{
            border:      platform===p.id ? `0.5px solid ${T.accentBdr}` : `0.5px solid ${T.border}`,
            borderRadius:'8px', padding:'6px 12px',
            background:  platform===p.id ? T.accentBg : 'transparent',
            color:       platform===p.id ? T.accent : T.sec,
            cursor:'pointer', fontSize:'13px', fontWeight:platform===p.id?'500':'400',
            display:'flex', alignItems:'center', gap:'5px',
          }}>
            <i className={`ti ${p.icon}`} style={{ fontSize:'14px' }} aria-hidden="true" />{p.label}
          </button>
        ))}
      </div>

      {/* Brief input */}
      <div style={{ background:T.surface, border:`0.5px solid ${T.border}`, borderRadius:'12px', padding:'18px 20px', marginBottom:'12px' }}>
        <label style={{ fontSize:'12px', color:T.sec, display:'block', marginBottom:'8px' }}>Campaign brief</label>
        <textarea
          value={topic} onChange={e => setTopic(e.target.value)}
          onKeyDown={e => { if (e.key==='Enter' && (e.metaKey||e.ctrlKey)) handleGenerate(); }}
          placeholder="Describe your product, event, or campaign..."
          rows={3} style={{ width:'100%', background:T.surface2, border:`0.5px solid ${T.border}`, borderRadius:'8px', padding:'10px 12px', fontSize:'14px', color:T.text, resize:'vertical', lineHeight:'1.6' }}
        />
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop:'12px', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
            <span style={{ fontSize:'13px', color:T.sec }}>Tone</span>
            <select value={tone} onChange={e => setTone(e.target.value)} style={{ background:T.surface2, border:`0.5px solid ${T.border}`, borderRadius:'7px', padding:'6px 10px', fontSize:'13px', color:T.text, cursor:'pointer' }}>
              {TONES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button className="gb" onClick={handleGenerate} disabled={loading || !topic.trim()} style={{ background:T.accent, color:T.bg, border:'none', borderRadius:'8px', padding:'8px 18px', fontSize:'14px', fontWeight:'500', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', marginLeft:'auto' }}>
            <i className={`ti ${loading?'ti-loader-2':'ti-sparkles'}`} style={{ fontSize:'16px', animation:loading?'spin 0.8s linear infinite':'none' }} aria-hidden="true" />
            {loading ? 'Generating...' : 'Generate posts'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background:'rgba(255,69,69,0.08)', color:T.red, border:'0.5px solid rgba(255,69,69,0.2)', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', marginBottom:'12px' }}>
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {[0,1,2].map(i => <Skeleton key={i} delay={i*80} />)}
        </div>
      )}

      {/* Posts */}
      {!loading && posts.length > 0 && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
            <p style={{ fontSize:'13px', color:T.sec }}>{posts.length} posts · {pf?.label}</p>
            <div style={{ display:'flex', gap:'5px' }}>
              {[
                { label:'Regenerate',   icon:'ti-refresh',       fn: handleGenerate },
                { label:'Schedule all', icon:'ti-calendar-plus', fn: () => {}       },
              ].map(btn => (
                <button key={btn.label} className="ab" onClick={btn.fn} style={{ background:'transparent', border:`0.5px solid ${T.border}`, borderRadius:'7px', padding:'5px 11px', fontSize:'12px', color:T.sec, cursor:'pointer', display:'flex', alignItems:'center', gap:'4px' }}>
                  <i className={`ti ${btn.icon}`} style={{ fontSize:'13px' }} aria-hidden="true" />{btn.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {posts.map((post, i) => <PostCard key={i} post={post} delay={i*300} platform={platform} />)}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && !error && (
        <div style={{ border:`0.5px dashed ${T.border}`, borderRadius:'12px', padding:'48px 24px', textAlign:'center' }}>
          <i className="ti ti-sparkles" style={{ fontSize:'26px', color:T.muted, display:'block', marginBottom:'10px' }} aria-hidden="true" />
          <p style={{ fontSize:'13px', color:T.muted }}>Enter a brief above to generate posts</p>
        </div>
      )}
    </div>
  );
}