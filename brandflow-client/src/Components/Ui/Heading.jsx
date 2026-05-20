
import { T } from '../../lib/theme';

export default function Heading({ title, sub }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '500', color: T.text, marginBottom: '5px', fontFamily: 'Georgia, serif', letterSpacing: '-0.3px' }}>
        {title}
      </h1>
      <p style={{ fontSize: '13px', color: T.sec }}>{sub}</p>
    </div>
  );
}