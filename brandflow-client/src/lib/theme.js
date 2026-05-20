
export const T = {
  bg:        '#0A0A0B',
  surface:   '#131315',
  surface2:  '#1A1A1C',
  border:    'rgba(255,255,255,0.07)',
  text:      '#EEEEEE',
  sec:       '#767676',
  muted:     '#3A3A3A',
  accent:    '#BDFF44',
  accentBg:  'rgba(189,255,68,0.09)',
  accentBdr: 'rgba(189,255,68,0.22)',
  red:       '#FF4545',
  green:     '#44FFAA',
  blue:      '#5B9EFF',
};

export const GLOBAL_CSS = `
@keyframes fadeUp  { from{opacity:0;transform:translateY(13px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn  { from{opacity:0} to{opacity:1} }
@keyframes spin    { to{transform:rotate(360deg)} }
@keyframes shimmer { 0%{background-position:-440px 0} 100%{background-position:440px 0} }
@keyframes orbA    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(55px,-45px)} }
@keyframes orbB    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-45px,35px)} }
@keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }

*{box-sizing:border-box;margin:0;padding:0;}
body{background:#0A0A0B;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px;}
textarea:focus,input:focus,select:focus{
  outline:none!important;
  border-color:rgba(189,255,68,0.42)!important;
  box-shadow:0 0 0 3px rgba(189,255,68,0.07)!important;
}
textarea,input,select{transition:border-color .2s,box-shadow .2s;}
button{font-family:inherit;}
.ni  {transition:background .15s;} .ni:hover  {background:rgba(255,255,255,0.05)!important;}
.ptab{transition:all .15s;}        .ptab:hover{border-color:rgba(255,255,255,0.18)!important;}
.pcard{transition:border-color .2s,transform .2s,box-shadow .2s;}
.pcard:hover{border-color:rgba(255,255,255,0.14)!important;transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.55);}
.cpb{transition:all .15s;} .cpb:hover{color:#BDFF44!important;border-color:rgba(189,255,68,.32)!important;}
.ab {transition:background .15s;} .ab:hover{background:rgba(255,255,255,.055)!important;}
.gb {transition:all .15s;}
.gb:not(:disabled):hover {background:#d2ff5a!important;transform:translateY(-1px);box-shadow:0 5px 20px rgba(189,255,68,.28);}
.gb:not(:disabled):active{transform:translateY(0);}
.gb:disabled{opacity:.38;cursor:not-allowed;}
`;

export const PLATFORMS = [
  { id: 'instagram', label: 'Instagram',   icon: 'ti-brand-instagram', chars: 2200  },
  { id: 'twitter',   label: 'X / Twitter', icon: 'ti-brand-x',          chars: 280   },
  { id: 'linkedin',  label: 'LinkedIn',    icon: 'ti-brand-linkedin',   chars: 3000  },
  { id: 'facebook',  label: 'Facebook',    icon: 'ti-brand-facebook',   chars: 63206 },
];

export const TONES = [
  'Professional', 'Casual', 'Witty', 'Bold', 'Educational', 'Inspirational',
];

export const NAV = [
  { id: 'generate',  icon: 'ti-sparkles',             label: 'Generate'  },
  { id: 'repurpose', icon: 'ti-transform',            label: 'Repurpose' },
  { id: 'predict',   icon: 'ti-chart-arrows-vertical', label: 'Predict'  },
];