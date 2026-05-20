// src/components/views/PredictView.jsx
// AI scores a post before you schedule it.
// Scores: overall, hook strength, timing, hashtag quality, readability.
// Returns a verdict + actionable improvement tips.

import { useState, useEffect } from 'react';
import { T, PLATFORMS } from '../../lib/theme';
import { predictPost }   from '../../lib/api';
import Heading           from '../Ui/Heading';

const TIME_SLOTS = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM',  '2:00 PM',  '3:00 PM',  '4:00 PM',  '5:00 PM',
  '6:00 PM', '7:00 PM',  '8:00 PM',  '9:00 PM',  '10:00 PM',
];

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

// Animated score ring
function ScoreRing({ score, size = 88, delay = 0 }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const radius      = (size / 2) - 7;
  const circumference = 2 * Math.PI * radius;
  const displayScore  = animated ? score : 0;
  const offset        = circumference - (displayScore / 100) * circumference;

  const color = score >= 75 ? T.green : score >= 50 ? T.accent : T.red;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={T.surface2} strokeWidth="5" />
        {/* Progress */}
        <circle
          cx={size/2} cy={size/2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          style={{ transition: `stroke-dashoffset 0.9s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{
          fontSize: '20px', fontWeight: '500', color,
          fontFamily: 'Georgia, serif',
          opacity: animated ? 1 : 0,
          transition: `opacity 0.4s ease ${delay + 200}ms`,
        }}>{score}</span>
        <span style={{ fontSize: '10px', color: T.muted }}>/ 100</span>
      </div>
    </div>
  );
}

// Individual dimension row
function DimensionRow({ label, score, icon, delay }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const color = score >= 75 ? T.green : score >= 50 ? T.accent : T.red;
  const pct   = `${score}%`;

  return (
    <div style={{ marginBottom: '12px', animation: `fadeUp 0.3s ease ${delay}ms both` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className={`ti ${icon}`} style={{ fontSize: '13px', color: T.sec }} aria-hidden="true" />
          <span style={{ fontSize: '13px', color: T.sec }}>{label}</span>
        </div>
        <span style={{ fontSize: '13px', fontWeight: '500', color }}>{score}</span>
      </div>
      <div style={{ height: '4px', background: T.surface2, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: animated ? pct : '0%',
          background: color,
          borderRadius: '2px',
          transition: `width 0.7s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`,
        }} />
      </div>
    </div>
  );
}

// Tip card
function TipCard({ tip, index }) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 12px', background: T.surface2, borderRadius: '8px', animation: `fadeUp 0.3s ease ${index * 60 + 400}ms both` }}>
      <i className="ti ti-bulb" style={{ fontSize: '14px', color: T.accent, flexShrink: 0, marginTop: '1px' }} aria-hidden="true" />
      <span style={{ fontSize: '13px', color: T.sec, lineHeight: '1.6' }}>{tip}</span>
    </div>
  );
}

export default function PredictView() {
  const [platform,  setPlatform]  = useState('instagram');
  const [content,   setContent]   = useState('');
  const [day,       setDay]       = useState('Monday');
  const [time,      setTime]      = useState('9:00 AM');
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState('');

  async function handlePredict() {
    if (!content.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const { score } = await predictPost({
        content,
        platform,
        scheduledTime: `${day} ${time}`,
      });
      setResult(score);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const verdictColor = result
    ? result.overall >= 75 ? T.green
    : result.overall >= 50 ? T.accent
    : T.red
    : T.sec;

  const verdictLabel = result
    ? result.overall >= 75 ? 'Strong post'
    : result.overall >= 50 ? 'Average post'
    : 'Needs work'
    : '';

  return (
    <div style={{ padding: '28px 24px', animation: 'fadeIn 0.25s ease' }}>
      <Heading
        title="Performance predictor"
        sub="Score your post before you schedule it"
      />

      {/* Input card */}
      <div style={{ background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '12px' }}>

        {/* Platform */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', color: T.sec, display: 'block', marginBottom: '8px' }}>Platform</label>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {PLATFORMS.map(p => (
              <button key={p.id} className="ptab" onClick={() => setPlatform(p.id)} style={{
                border:       `0.5px solid ${platform === p.id ? T.accentBdr : T.border}`,
                borderRadius: '8px', padding: '6px 12px',
                background:   platform === p.id ? T.accentBg : 'transparent',
                color:        platform === p.id ? T.accent : T.sec,
                cursor:       'pointer', fontSize: '13px',
                fontWeight:   platform === p.id ? '500' : '400',
                display:      'flex', alignItems: 'center', gap: '5px',
              }}>
                <i className={`ti ${p.icon}`} style={{ fontSize: '14px' }} aria-hidden="true" />{p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Post content */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: T.sec, display: 'block', marginBottom: '8px' }}>Post content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePredict(); }}
            placeholder="Paste or type the post you want to score..."
            rows={4}
            style={{ width: '100%', background: T.surface2, border: `0.5px solid ${T.border}`, borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: T.text, resize: 'vertical', lineHeight: '1.65' }}
          />
        </div>

        {/* Scheduled time */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: T.sec }}>Schedule for</span>
          <select value={day} onChange={e => setDay(e.target.value)} style={{ background: T.surface2, border: `0.5px solid ${T.border}`, borderRadius: '7px', padding: '6px 10px', fontSize: '13px', color: T.text, cursor: 'pointer' }}>
            {DAYS.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={time} onChange={e => setTime(e.target.value)} style={{ background: T.surface2, border: `0.5px solid ${T.border}`, borderRadius: '7px', padding: '6px 10px', fontSize: '13px', color: T.text, cursor: 'pointer' }}>
            {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <button
          className="gb"
          onClick={handlePredict}
          disabled={loading || !content.trim()}
          style={{ background: T.accent, color: T.bg, border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <i className={`ti ${loading ? 'ti-loader-2' : 'ti-chart-arrows-vertical'}`} style={{ fontSize: '16px', animation: loading ? 'spin 0.8s linear infinite' : 'none' }} aria-hidden="true" />
          {loading ? 'Analysing...' : 'Predict performance'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(255,69,69,0.08)', color: T.red, border: '0.5px solid rgba(255,69,69,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '12px' }}>
          {error}
        </div>
      )}

      {/* Results */}
      {!loading && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeIn 0.3s ease' }}>

          {/* Overall score + verdict */}
          <div style={{ background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <ScoreRing score={result.overall} delay={0} />
            <div>
              <p style={{ fontSize: '18px', fontWeight: '500', color: verdictColor, fontFamily: 'Georgia, serif', marginBottom: '4px' }}>
                {verdictLabel}
              </p>
              <p style={{ fontSize: '13px', color: T.sec, lineHeight: '1.6', maxWidth: '380px' }}>
                {result.verdict}
              </p>
            </div>
          </div>

          {/* Dimension breakdown */}
          <div style={{ background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: '12px', padding: '18px 20px' }}>
            <p style={{ fontSize: '13px', fontWeight: '500', color: T.text, marginBottom: '16px' }}>Score breakdown</p>
            <DimensionRow label="Hook strength"    score={result.hook}        icon="ti-fish-hook"        delay={60}  />
            <DimensionRow label="Posting timing"   score={result.timing}      icon="ti-clock"            delay={120} />
            <DimensionRow label="Hashtag quality"  score={result.hashtags}    icon="ti-hash"             delay={180} />
            <DimensionRow label="Readability"      score={result.readability} icon="ti-align-left"       delay={240} />
          </div>

          {/* Improvement tips */}
          {(result.tips ?? []).length > 0 && (
            <div style={{ background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: '12px', padding: '18px 20px' }}>
              <p style={{ fontSize: '13px', fontWeight: '500', color: T.text, marginBottom: '12px' }}>
                How to improve it
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {result.tips.map((tip, i) => <TipCard key={i} tip={tip} index={i} />)}
              </div>
            </div>
          )}

          {/* Re-predict */}
          <button
            className="ab"
            onClick={handlePredict}
            style={{ background: 'transparent', border: `0.5px solid ${T.border}`, borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: T.sec, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', alignSelf: 'flex-start' }}
          >
            <i className="ti ti-refresh" style={{ fontSize: '14px' }} aria-hidden="true" />
            Re-analyse
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !result && !error && (
        <div style={{ border: `0.5px dashed ${T.border}`, borderRadius: '12px', padding: '48px 24px', textAlign: 'center' }}>
          <i className="ti ti-chart-arrows-vertical" style={{ fontSize: '26px', color: T.muted, display: 'block', marginBottom: '10px' }} aria-hidden="true" />
          <p style={{ fontSize: '13px', color: T.muted }}>Paste a post above and get your score before it goes live</p>
        </div>
      )}
    </div>
  );
}