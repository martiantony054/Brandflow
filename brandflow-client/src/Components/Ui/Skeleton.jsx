import React from 'react'
import { T } from '../../lib/theme';
 
const shimmer = {
  background:     `linear-gradient(90deg, ${T.surface} 0%, #1E1E20 50%, ${T.surface} 100%)`,
  backgroundSize: '440px 100%',
  animation:      'shimmer 1.5s ease infinite',
  borderRadius:   '5px',
};
const Skeleton = ({ delay = 0 }) => {
  return (
     <div style={{ background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: '12px', padding: '18px 20px', animation: `fadeUp 0.3s ease ${delay}ms both` }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', alignItems: 'center' }}>
        <div style={{ ...shimmer, width: '46px',  height: '17px' }} />
        <div style={{ ...shimmer, width: '108px', height: '13px', marginTop: '2px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
        <div style={{ ...shimmer, width: '100%', height: '13px' }} />
        <div style={{ ...shimmer, width: '88%',  height: '13px' }} />
        <div style={{ ...shimmer, width: '70%',  height: '13px' }} />
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        {[62, 62, 72].map((w, i) => (
          <div key={i} style={{ ...shimmer, width: w, height: '19px', borderRadius: '4px' }} />
        ))}
      </div>
    </div>
  )
}

export default Skeleton