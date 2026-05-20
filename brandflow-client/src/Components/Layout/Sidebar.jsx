
import { T, NAV } from '../../lib/theme';

export default function Sidebar({ view, onNavigate }) {
  return (
    <aside style={{ width:'52px', flexShrink:0, borderRight:`0.5px solid ${T.border}`, display:'flex', flexDirection:'column', alignItems:'center', padding:'14px 0', gap:'2px', background:T.surface, position:'relative', zIndex:10 }}>
      {/* Logo */}
      <div style={{ width:'28px', height:'28px', background:T.accent, borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px', fontSize:'11px', fontWeight:'700', color:T.bg, letterSpacing:'-0.5px', flexShrink:0 }}>
        BF
      </div>

      {NAV.map(item => (
        <button
          key={item.id}
          className="ni"
          onClick={() => onNavigate(item.id)}
          title={item.label}
          aria-label={item.label}
          style={{ width:'36px', height:'36px', border:'none', borderRadius:'8px', background:view===item.id ? T.surface2 : 'transparent', color:view===item.id ? T.accent : T.muted, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          <i className={`ti ${item.icon}`} style={{ fontSize:'18px' }} aria-hidden="true" />
        </button>
      ))}
    </aside>
  );
}