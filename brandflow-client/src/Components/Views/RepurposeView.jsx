
import { useState, useEffect } from 'react';
import { T, PLATFORMS, TONES } from '../../lib/theme';
import { repurposeContent }     from '../../lib/api';
import Heading from '../Ui/Heading';
import Skeleton from '../Ui/Skeleton';

function TypedText({ text, delay = 0 }) {
  const [typed,   setTyped]   = useState('');
  const [done,    setDone]    = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let iv;
    const t = setTimeout(() => {
      setStarted(true);
      let i = 0;
      iv = setInterval(() => {
        i = Math.min(i + 6, text.length);
        setTyped(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, 12);
    }, delay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, delay]);

  return (
    <span style={{ fontSize: '13px', lineHeight: '1.75', color: T.text }}>
      {typed}
      {!done && started && (
        <span style={{ display: 'inline-block', width: '2px', height: '12px', background: T.accent, marginLeft: '1px', verticalAlign: 'text-bottom', animation: 'blink .65s ease infinite' }} />
      )}
    </span>
  );
}

function RepurposedCard({ item, index }) {
  const [visible, setVisible] = useState(false);
  const [copied,  setCopied]  = useState(false);
  const pf = PLATFORMS.find(p => p.id === item.platform);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 280);
    return () => clearTimeout(t);
  }, [index]);

  function copy() {
    const full = item.content + '\n\n' + (item.hashtags ?? []).map(h => '#' + h).join(' ');
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ background: T.surface, border: '0.5px solid ' + T.border, borderRadius: '12px', padding: '16px 18px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity .4s ease, transform .4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <i className={'ti ' + (pf?.icon ?? 'ti-world')} style={{ fontSize: '16px', color: T.accent }} />
          <span style={{ fontSize: '13px', fontWeight: '500', color: T.text }}>{pf?.label ?? item.platform}</span>
          {item.changes && <span style={{ fontSize: '11px', color: T.muted, fontStyle: 'italic' }}>· {item.changes}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {item.platform === 'twitter' && (
            <span style={{ fontSize: '11px', color: (item.content?.length ?? 0) > 280 ? T.red : T.muted }}>
              {item.content?.length ?? 0}/280
            </span>
          )}
          <button className="cpb" onClick={copy} style={{ background: 'transparent', border: '0.5px solid ' + T.border, borderRadius: '6px', padding: '3px 9px', fontSize: '12px', color: copied ? T.accent : T.sec, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className={'ti ' + (copied ? 'ti-check' : 'ti-copy')} style={{ fontSize: '12px' }} />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div style={{ marginBottom: '10px', minHeight: '44px' }}>
        {visible && <TypedText text={item.content ?? ''} delay={100} />}
      </div>
      {(item.hashtags ?? []).length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {item.hashtags.map((tag, j) => (
            <span key={j} style={{ fontSize: '11px', background: T.accentBg, color: T.accent, padding: '2px 7px', borderRadius: '4px', border: '0.5px solid ' + T.accentBdr, fontWeight: '500' }}>#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RepurposeView() {
  const [source,  setSource]  = useState('linkedin');
  const [content, setContent] = useState('');
  const [tone,    setTone]    = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error,   setError]   = useState('');

  const outputPlatforms = PLATFORMS.filter(p => p.id !== source);

  async function handle() {
    if (!content.trim()) return;
    setLoading(true); setError(''); setResults([]);
    try {
      const { repurposed } = await repurposeContent({ content, sourcePlatform: source, tone });
      setResults(repurposed ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '28px 24px', animation: 'fadeIn .25s ease' }}>
      <Heading title="Content repurposer" sub="Paste one post — AI rewrites it for every other platform" />

      <div style={{ background: T.surface, border: '0.5px solid ' + T.border, borderRadius: '12px', padding: '18px 20px', marginBottom: '12px' }}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', color: T.sec, display: 'block', marginBottom: '8px' }}>Original platform</label>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {PLATFORMS.map(p => (
              <button key={p.id} className="ptab" onClick={() => setSource(p.id)} style={{ border: '0.5px solid ' + (source === p.id ? T.accentBdr : T.border), borderRadius: '8px', padding: '6px 12px', background: source === p.id ? T.accentBg : 'transparent', color: source === p.id ? T.accent : T.sec, cursor: 'pointer', fontSize: '13px', fontWeight: source === p.id ? '500' : '400', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className={'ti ' + p.icon} style={{ fontSize: '14px' }} />{p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', color: T.sec }}>Paste your original post</label>
            <span style={{ fontSize: '11px', color: content.length > 0 ? T.sec : T.muted }}>{content.length} chars</span>
          </div>
          <textarea value={content} onChange={e => setContent(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handle(); }} placeholder={'Paste your ' + (PLATFORMS.find(p => p.id === source)?.label) + ' post here...'} rows={5} style={{ width: '100%', background: T.surface2, border: '0.5px solid ' + T.border, borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: T.text, resize: 'vertical', lineHeight: '1.65' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ fontSize: '13px', color: T.sec }}>Tone</span>
            <select value={tone} onChange={e => setTone(e.target.value)} style={{ background: T.surface2, border: '0.5px solid ' + T.border, borderRadius: '7px', padding: '6px 10px', fontSize: '13px', color: T.text, cursor: 'pointer' }}>
              {TONES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '12px', color: T.muted }}>Generates for:</span>
            {outputPlatforms.map(p => <i key={p.id} className={'ti ' + p.icon} title={p.label} style={{ fontSize: '15px', color: T.sec }} />)}
          </div>
          <button className="gb" onClick={handle} disabled={loading || !content.trim()} style={{ background: T.accent, color: T.bg, border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <i className={'ti ' + (loading ? 'ti-loader-2' : 'ti-transform')} style={{ fontSize: '16px', animation: loading ? 'spin .8s linear infinite' : 'none' }} />
            {loading ? 'Repurposing...' : 'Repurpose for ' + outputPlatforms.length + ' platforms'}
          </button>
        </div>
      </div>

      {error && <div style={{ background: 'rgba(255,69,69,0.08)', color: T.red, border: '0.5px solid rgba(255,69,69,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

      {loading && <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{outputPlatforms.map((_, i) => <Skeleton key={i} delay={i * 80} />)}</div>}

      {!loading && results.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <p style={{ fontSize: '13px', color: T.sec }}>{results.length} versions from your {PLATFORMS.find(p => p.id === source)?.label} post</p>
            <button className="ab" onClick={handle} style={{ background: 'transparent', border: '0.5px solid ' + T.border, borderRadius: '7px', padding: '5px 11px', fontSize: '12px', color: T.sec, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="ti ti-refresh" style={{ fontSize: '13px' }} />Regenerate
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {results.map((item, i) => <RepurposedCard key={i} item={item} index={i} />)}
          </div>
        </div>
      )}

      {!loading && results.length === 0 && !error && (
        <div style={{ border: '0.5px dashed ' + T.border, borderRadius: '12px', padding: '48px 24px', textAlign: 'center' }}>
          <i className="ti ti-transform" style={{ fontSize: '26px', color: T.muted, display: 'block', marginBottom: '10px' }} />
          <p style={{ fontSize: '13px', color: T.muted }}>Paste your best post and repurpose it everywhere</p>
        </div>
      )}
    </div>
  );
}