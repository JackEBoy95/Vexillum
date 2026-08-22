// ============================================================
// VEXILLUM — SVG Renderer
// All flag layers are rendered as SVG elements
// ============================================================

let CANVAS_W = 480;
let CANVAS_H = 320;

// ---- Overlay shape renderers ----
// Each returns an SVG path/shape string that fills the flag canvas.
// All shapes accept: color, color2, opacity, params

// ---- Basic draggable shapes (used by shape-type emblems) ----
// All paths use viewBox 0 0 100 100.  fill is inherited from the parent <svg>.
const BASIC_SHAPES = {
  star5:      { label: 'Star 5pt',    path: '<polygon points="50,5 62,34 95,36 70,57 77,88 50,71 23,88 30,57 5,36 38,34"/>' },
  star6:      { label: 'Star 6pt',    path: '<g fill-rule="evenodd"><polygon points="50,6 92,72 8,72"/><polygon points="50,94 8,28 92,28"/></g>' },
  star8:      { label: 'Star 8pt',    path: '<polygon points="50,5 57,32 82,18 68,43 95,50 68,57 82,82 57,68 50,95 43,68 18,82 32,57 5,50 32,43 18,18 43,32"/>' },
  diamond:    { label: 'Diamond',     path: '<polygon points="50,4 96,50 50,96 4,50"/>' },
  circle:     { label: 'Circle',      path: '<circle cx="50" cy="50" r="46"/>' },
  moon:       { label: 'Crescent',    path: '<path fill-rule="evenodd" d="M50,8 A42,42 0 1,0 50,92 A42,42 0 1,0 50,8 M60,16 A34,34 0 1,1 60,84 A34,34 0 1,1 60,16"/>' },
  triangle:   { label: 'Triangle ▲',  path: '<polygon points="50,5 95,90 5,90"/>' },
  tridown:    { label: 'Triangle ▼',  path: '<polygon points="50,95 5,10 95,10"/>' },
  trileft:    { label: 'Triangle ◀',  path: '<polygon points="5,50 90,5 90,95"/>' },
  triright:   { label: 'Triangle ▶',  path: '<polygon points="95,50 10,5 10,95"/>' },
  square:     { label: 'Square',      path: '<rect x="6" y="6" width="88" height="88"/>' },
  cross:      { label: 'Cross',       path: '<path d="M42,5 L58,5 58,42 95,42 95,58 58,58 58,95 42,95 42,58 5,58 5,42 42,42 Z"/>' },
  crossbold:  { label: 'Bold Cross',  path: '<path d="M32,5 L68,5 68,32 95,32 95,68 68,68 68,95 32,95 32,68 5,68 5,32 32,32 Z"/>' },
  saltire:    { label: 'Saltire ✕',   path: '<path d="M0,0 L20,0 L50,30 L80,0 L100,0 L100,20 L70,50 L100,80 L100,100 L80,100 L50,70 L20,100 L0,100 L0,80 L30,50 L0,20 Z"/>' },
  chevron:    { label: 'Chevron',     path: '<path d="M20,5 L65,50 20,95 35,95 80,50 35,5 Z"/>' },
  arrowr:     { label: 'Arrow →',     path: '<path d="M5,37 L65,37 L65,18 L95,50 L65,82 L65,63 L5,63 Z"/>' },
  arrowl:     { label: 'Arrow ←',     path: '<path d="M95,37 L35,37 L35,18 L5,50 L35,82 L35,63 L95,63 Z"/>' },
  pentagon:   { label: 'Pentagon',    path: '<polygon points="50,5 95,38 77,92 23,92 5,38"/>' },
  hexagon:    { label: 'Hexagon',     path: '<polygon points="50,5 91,27 91,73 50,95 9,73 9,27"/>' },
  octagon:    { label: 'Octagon',     path: '<polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30"/>' },
  ring:       { label: 'Ring',        path: '<path fill-rule="evenodd" d="M50,6 A44,44 0 1,0 50,94 A44,44 0 1,0 50,6 M50,24 A26,26 0 1,1 50,76 A26,26 0 1,1 50,24"/>' },
  semicircle: { label: 'Semicircle',  path: '<path d="M5,52 A45,45 0 0,1 95,52 Z"/>' },
  heart:      { label: 'Heart',        path: '<path d="M50,80 C30,70 5,55 5,38 C5,18 20,8 35,8 C45,8 50,15 50,22 C50,15 55,8 65,8 C80,8 95,18 95,38 C95,55 70,70 50,80 Z"/>' },
  oval:       { label: 'Oval',         path: '<ellipse cx="50" cy="50" rx="46" ry="30"/>' },
  wideoval:   { label: 'Wide Oval',    path: '<ellipse cx="50" cy="50" rx="46" ry="20"/>' },
  cloud:      { label: 'Cloud',        path: '<path d="M18,72 Q5,72 5,58 Q5,46 16,44 Q14,28 26,22 Q37,15 46,25 Q50,12 60,12 Q74,10 78,24 Q87,20 92,30 Q98,30 98,42 Q98,56 84,56 Q88,66 80,70 Q72,76 62,70 Q56,80 42,78 Q26,78 18,72 Z"/>' },
  starburst4: { label: '4pt Star',     path: '<polygon points="50,2 57,43 98,50 57,57 50,98 43,57 2,50 43,43"/>' },
  crown:      { label: 'Crown',        path: '<path d="M5,80 L5,62 L25,30 L40,52 L50,15 L60,52 L75,30 L95,62 L95,80 Z"/>' },
  teardrop:   { label: 'Teardrop',     path: '<path d="M50,5 C72,5 88,25 88,45 C88,68 65,88 50,95 C35,88 12,68 12,45 C12,25 28,5 50,5 Z"/>' },
  lightning:  { label: 'Lightning ⚡',  path: '<polygon points="60,4 28,52 50,52 40,96 74,44 50,44"/>' },
  arrowup:    { label: 'Arrow ↑',      path: '<path d="M37,95 L37,38 L18,38 L50,5 L82,38 L63,38 L63,95 Z"/>' },
  arrowdown:  { label: 'Arrow ↓',      path: '<path d="M37,5 L37,62 L18,62 L50,95 L82,62 L63,62 L63,5 Z"/>' },
  shieldemb:  { label: 'Shield',       path: '<path d="M10,8 L90,8 L90,58 C90,82 70,94 50,97 C30,94 10,82 10,58 Z"/>' },
  diamondthin:{ label: 'Tall Diamond', path: '<polygon points="50,3 72,50 50,97 28,50"/>' },
  wavyband:   { label: 'Wavy Band',    path: '<path d="M0,50 Q6.25,20 12.5,50 Q18.75,80 25,50 Q31.25,20 37.5,50 Q43.75,80 50,50 Q56.25,20 62.5,50 Q68.75,80 75,50 Q81.25,20 87.5,50 Q93.75,80 100,50 L100,65 Q93.75,95 87.5,65 Q81.25,35 75,65 Q68.75,95 62.5,65 Q56.25,35 50,65 Q43.75,95 37.5,65 Q31.25,35 25,65 Q18.75,95 12.5,65 Q6.25,35 0,65 Z"/>', defaultScaleX: 5, defaultScaleY: 0.6 },
  zigzagband: { label: 'Zigzag Band',  path: '<polygon points="0,42 10,22 20,42 30,22 40,42 50,22 60,42 70,22 80,42 90,22 100,42 100,58 90,78 80,58 70,78 60,58 50,78 40,58 30,78 20,58 10,78 0,58"/>', defaultScaleX: 5, defaultScaleY: 0.6 },
};

// ---- Flag shape definitions ----
// Each shape defines coordinate space (w × h), an optional SVG clip polygon,
// and display dimensions (kept to max ~480px wide / ~380px tall).
const FLAG_SHAPES = {
  rect32: {
    label: 'Rectangle\n3:2', w: 480, h: 320, dispW: 480, dispH: 320,
    clip: null,
    icon: `<rect x="1" y="5" width="38" height="26" rx="1"/>`,
  },
  rect21: {
    label: 'Wide\n2:1', w: 480, h: 240, dispW: 480, dispH: 240,
    clip: null,
    icon: `<rect x="1" y="8" width="38" height="18" rx="1"/>`,
  },
  square: {
    label: 'Square\n1:1', w: 360, h: 360, dispW: 360, dispH: 360,
    clip: null,
    icon: `<rect x="5" y="5" width="30" height="30" rx="1"/>`,
  },
  pennant: {
    label: 'Pennant', w: 480, h: 300, dispW: 480, dispH: 300,
    clip: '0,0 480,150 0,300',
    icon: `<polygon points="0,5 40,20 0,35"/>`,
  },
  swallowtail: {
    label: 'Swallowtail', w: 480, h: 320, dispW: 480, dispH: 320,
    clip: '0,0 480,0 340,160 480,320 0,320',
    icon: `<polygon points="0,5 40,5 28,20 40,35 0,35"/>`,
  },
  shield: {
    label: 'Shield', w: 480, h: 380, dispW: 444, dispH: 352,
    clip: '0,0 480,0 480,240 240,380 0,240',
    icon: `<polygon points="2,5 38,5 38,25 20,38 2,25"/>`,
  },
  nepal: {
    label: 'Nepal\n(approx)', w: 300, h: 380, dispW: 300, dispH: 380,
    clip: '0,0 190,95 0,190 270,380 0,380',
    icon: `<polygon points="0,0 20,10 0,20 28,38 0,38"/>`,
  },
  battle: {
    label: 'Battle\nStandard', w: 360, h: 360, dispW: 360, dispH: 360,
    clip: null,
    icon: `<rect x="5" y="5" width="30" height="30" rx="1"/>`,
  },
  birdsmouth: {
    label: "Bird's\nMouth", w: 480, h: 320, dispW: 480, dispH: 320,
    clip: '0,0 480,0 480,320 0,320 60,160',
    icon: `<polygon points="0,5 40,5 40,35 0,35 5,20"/>`,
  },
  dovetail: {
    label: 'Dovetail', w: 480, h: 320, dispW: 480, dispH: 320,
    clip: '0,0 480,0 400,160 480,320 0,320',
    icon: `<polygon points="0,5 40,5 33,20 40,35 0,35"/>`,
  },
  oriflamme: {
    label: 'Oriflamme', w: 480, h: 320, dispW: 480, dispH: 320,
    clip: '0,0 440,0 480,80 440,160 480,240 440,320 0,320',
    icon: `<polygon points="0,5 36,5 40,12 36,20 40,28 36,35 0,35"/>`,
  },
  banner: {
    label: 'Banner\n(Tall)', w: 300, h: 480, dispW: 300, dispH: 480,
    clip: null,
    icon: `<rect x="8" y="2" width="24" height="36" rx="1"/>`,
  },
  lozenge: {
    label: 'Lozenge', w: 480, h: 480, dispW: 360, dispH: 360,
    clip: '240,0 480,240 240,480 0,240',
    icon: `<polygon points="20,5 35,20 20,35 5,20"/>`,
  },
  longpennant: {
    label: 'Long\nPennant', w: 600, h: 180, dispW: 480, dispH: 144,
    clip: '0,0 600,90 0,180',
    icon: `<polygon points="0,5 40,20 0,35"/>`,
  },
  curvedshield: {
    label: 'Curved\nShield', w: 480, h: 440, dispW: 444, dispH: 408,
    clipD: 'M 0,0 L 480,0 L 480,260 Q 480,420 240,440 Q 0,420 0,260 Z',
    icon: `<path d="M2,5 L38,5 L38,22 Q38,38 20,40 Q2,38 2,22 Z"/>`,
  },
  heater: {
    label: 'Heater\nShield', w: 480, h: 460, dispW: 430, dispH: 414,
    clipD: 'M 0,0 L 480,0 L 480,220 C 480,360 310,430 240,460 C 170,430 0,360 0,220 Z',
    icon: `<path d="M2,5 L38,5 L38,18 C38,30 25,37 20,39 C15,37 2,30 2,18 Z"/>`,
  },
};

const SHAPES = {
  cross: {
    label: 'Cross',
    params: { thickness: { label: 'Thickness', min: 5, max: 50, default: 20 } },
    render(c, p) {
      const t = p.thickness ?? 20;
      const hw = CANVAS_W / 2, hh = CANVAS_H / 2;
      return `
        <rect x="${hw - t/2}" y="0" width="${t}" height="${CANVAS_H}" fill="${c.color}" opacity="${c.opacity/100}"/>
        <rect x="0" y="${hh - t/2}" width="${CANVAS_W}" height="${t}" fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },
  nordic: {
    label: 'Nordic Cross',
    params: {
      thickness: { label: 'Thickness', min: 5, max: 80, default: 30 },
      offset:    { label: 'Offset',    min: 10, max: 70, default: 35 },
    },
    render(c, p) {
      const t = p.thickness ?? 30;
      const off = (p.offset ?? 35) / 100 * CANVAS_W;
      const hh = CANVAS_H / 2;
      return `
        <rect x="${off - t/2}" y="0" width="${t}" height="${CANVAS_H}" fill="${c.color}" opacity="${c.opacity/100}"/>
        <rect x="0" y="${hh - t/2}" width="${CANVAS_W}" height="${t}" fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },
  saltire: {
    label: 'Saltire (X)',
    params: { thickness: { label: 'Thickness', min: 5, max: 60, default: 15 } },
    render(c, p) {
      const t = p.thickness ?? 15;
      const diag = Math.sqrt(CANVAS_W * CANVAS_W + CANVAS_H * CANVAS_H);
      // angle from vertical to the flag diagonal — atan2(W,H) not atan2(H,W)
      const angle1 = Math.atan2(CANVAS_W, CANVAS_H) * 180 / Math.PI;
      return `
        <g opacity="${c.opacity/100}">
          <rect x="${CANVAS_W/2 - t/2}" y="${CANVAS_H/2 - diag/2}"
                width="${t}" height="${diag}"
                transform="rotate(${angle1} ${CANVAS_W/2} ${CANVAS_H/2})"
                fill="${c.color}"/>
          <rect x="${CANVAS_W/2 - t/2}" y="${CANVAS_H/2 - diag/2}"
                width="${t}" height="${diag}"
                transform="rotate(${-angle1} ${CANVAS_W/2} ${CANVAS_H/2})"
                fill="${c.color}"/>
        </g>`;
    }
  },
  triangle: {
    label: 'Triangle',
    params: {
      depth: { label: 'Depth', min: 10, max: 90, default: 50 },
      side:  { label: 'Side (0=L,1=R,2=T,3=B)', min: 0, max: 3, default: 0, step: 1 },
    },
    render(c, p) {
      const d = (p.depth ?? 50) / 100;
      const side = Math.round(p.side ?? 0);
      let points;
      const W = CANVAS_W, H = CANVAS_H;
      if (side === 0) points = `0,0 ${W*d},${H/2} 0,${H}`;
      else if (side === 1) points = `${W},0 ${W*(1-d)},${H/2} ${W},${H}`;
      else if (side === 2) points = `0,0 ${W},0 ${W/2},${H*d}`;
      else points = `0,${H} ${W},${H} ${W/2},${H*(1-d)}`;
      return `<polygon points="${points}" fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },
  chevron: {
    label: 'Chevron',
    params: {
      depth:     { label: 'Depth',  min: 5,  max: 80, default: 40 },
      thickness: { label: 'Width',  min: 5,  max: 80, default: 30 },
    },
    render(c, p) {
      const d = (p.depth ?? 40) / 100 * CANVAS_W;
      const t = (p.thickness ?? 30) / 100 * CANVAS_W;
      const W = CANVAS_W, H = CANVAS_H;
      return `<polygon points="0,0 ${d},${H/2} 0,${H} ${t},${H} ${d+t},${H/2} ${t},0"
                fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },
  canton: {
    label: 'Canton',
    params: {
      width:  { label: 'Width',  min: 10, max: 60, default: 33 },
      height: { label: 'Height', min: 10, max: 60, default: 50 },
    },
    render(c, p) {
      const w = (p.width ?? 33) / 100 * CANVAS_W;
      const h = (p.height ?? 50) / 100 * CANVAS_H;
      return `<rect x="0" y="0" width="${w}" height="${h}" fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },
  diagonal: {
    label: 'Diagonal',
    params: {
      side: { label: 'Side (0=BL,1=BR,2=TL,3=TR)', min: 0, max: 3, default: 0, step: 1 },
    },
    render(c, p) {
      const side = Math.round(p.side ?? 0);
      const W = CANVAS_W, H = CANVAS_H;
      let points;
      if (side === 0)      points = `0,0 ${W},${H} 0,${H}`;
      else if (side === 1) points = `0,${H} ${W},0 ${W},${H}`;
      else if (side === 2) points = `0,0 ${W},0 0,${H}`;
      else                 points = `0,0 ${W},0 ${W},${H}`;
      return `<polygon points="${points}" fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },
  quarter: {
    label: 'Quarter',
    params: {
      position: { label: 'Quadrant (0-3)', min: 0, max: 3, default: 0, step: 1 },
    },
    render(c, p) {
      const pos = Math.round(p.position ?? 0);
      const W = CANVAS_W, H = CANVAS_H;
      const hw = W / 2, hh = H / 2;
      let x = 0, y = 0;
      if (pos === 1) x = hw;
      if (pos === 2) y = hh;
      if (pos === 3) { x = hw; y = hh; }
      return `<rect x="${x}" y="${y}" width="${hw}" height="${hh}" fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },

  // Horizontal band — a single full-width stripe at a set vertical position.
  // Great for adding one stripe on top of a vertical design (e.g. Botswana, Zimbabwe).
  hband: {
    label: 'H Band',
    params: {
      position:  { label: 'Position %',  min: 0,  max: 90, default: 40 },
      thickness: { label: 'Thickness %', min: 2,  max: 80, default: 20 },
    },
    render(c, p) {
      const y = (p.position ?? 40) / 100 * CANVAS_H;
      const h = (p.thickness ?? 20) / 100 * CANVAS_H;
      return `<rect x="0" y="${y}" width="${CANVAS_W}" height="${h}" fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },

  // Vertical band — a single full-height stripe at a set horizontal position.
  // Great for adding one stripe on top of a horizontal design.
  vband: {
    label: 'V Band',
    params: {
      position:  { label: 'Position %',  min: 0,  max: 90, default: 40 },
      thickness: { label: 'Thickness %', min: 2,  max: 80, default: 20 },
    },
    render(c, p) {
      const x = (p.position ?? 40) / 100 * CANVAS_W;
      const w = (p.thickness ?? 20) / 100 * CANVAS_W;
      return `<rect x="${x}" y="0" width="${w}" height="${CANVAS_H}" fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },

  // Border — a rectangular frame around the edge of the flag.
  border: {
    label: 'Border',
    params: {
      thickness: { label: 'Thickness %', min: 1, max: 25, default: 6 },
    },
    render(c, p) {
      const t = Math.round((p.thickness ?? 6) / 100 * Math.min(CANVAS_W, CANVAS_H));
      const op = c.opacity / 100;
      // Four rects forming a hollow frame
      return `
        <rect x="0" y="0" width="${CANVAS_W}" height="${t}" fill="${c.color}" opacity="${op}"/>
        <rect x="0" y="${CANVAS_H - t}" width="${CANVAS_W}" height="${t}" fill="${c.color}" opacity="${op}"/>
        <rect x="0" y="${t}" width="${t}" height="${CANVAS_H - t * 2}" fill="${c.color}" opacity="${op}"/>
        <rect x="${CANVAS_W - t}" y="${t}" width="${t}" height="${CANVAS_H - t * 2}" fill="${c.color}" opacity="${op}"/>`;
    }
  },

  // Wavy horizontal band
  wavyh: {
    label: 'Wavy Band',
    params: {
      position:  { label: 'Position %',  min: 0,  max: 85, default: 40 },
      thickness: { label: 'Thickness %', min: 3,  max: 40, default: 15 },
      waves:     { label: 'Waves',       min: 2,  max: 12, default: 5, step: 1 },
    },
    render(c, p) {
      const cy  = (p.position  ?? 40) / 100 * CANVAS_H;
      const t   = (p.thickness ?? 15) / 100 * CANVAS_H;
      const n   = Math.max(2, Math.round(p.waves ?? 5));
      const step = CANVAS_W / (n * 2); // each half-wave is one segment
      const amp  = t * 0.55;
      // True sine-wave: alternate control points above/below the centre line
      let top = `M 0,${cy}`;
      for (let i = 0; i < n * 2; i++) {
        const dir = i % 2 === 0 ? -1 : 1; // alternate up/down
        const xm = (i + 0.5) * step;
        const xe = (i + 1)   * step;
        top += ` Q ${xm},${cy + dir * amp} ${xe},${cy}`;
      }
      let bot = `L ${CANVAS_W},${cy + t}`;
      for (let i = n * 2 - 1; i >= 0; i--) {
        const dir = i % 2 === 0 ? -1 : 1;
        const xm = (i + 0.5) * step;
        const xs = i * step;
        bot += ` Q ${xm},${cy + t + dir * amp} ${xs},${cy + t}`;
      }
      return `<path d="${top} ${bot} Z" fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },

  // Zigzag horizontal band
  zigzagh: {
    label: 'Zigzag Band',
    params: {
      position:  { label: 'Position %',  min: 0,  max: 85, default: 40 },
      thickness: { label: 'Thickness %', min: 3,  max: 40, default: 15 },
      teeth:     { label: 'Teeth',       min: 2,  max: 16, default: 6, step: 1 },
    },
    render(c, p) {
      const cy  = (p.position  ?? 40) / 100 * CANVAS_H;
      const t   = (p.thickness ?? 15) / 100 * CANVAS_H;
      const n   = Math.max(2, Math.round(p.teeth ?? 6));
      const step = CANVAS_W / n;
      const amp  = t * 0.45;
      let pts = `0,${cy}`;
      for (let i = 0; i < n; i++) {
        pts += ` ${(i + 0.5) * step},${cy - amp} ${(i + 1) * step},${cy}`;
      }
      pts += ` ${CANVAS_W},${cy + t}`;
      for (let i = n - 1; i >= 0; i--) {
        pts += ` ${(i + 0.5) * step},${cy + t + amp} ${i * step},${cy + t}`;
      }
      return `<polygon points="${pts}" fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },

  rhombus: {
    label: 'Rhombus',
    params: {
      width:   { label: 'Width %',    min: 20, max: 95, default: 60 },
      height:  { label: 'Height %',   min: 20, max: 95, default: 80 },
      offsetX: { label: 'Shift X',    min: -40, max: 40, default: 0 },
      offsetY: { label: 'Shift Y',    min: -40, max: 40, default: 0 },
    },
    render(c, p) {
      const W = CANVAS_W, H = CANVAS_H;
      const w  = (p.width   ?? 60) / 100 * W;
      const h  = (p.height  ?? 80) / 100 * H;
      const cx = W / 2 + (p.offsetX ?? 0) / 100 * W;
      const cy = H / 2 + (p.offsetY ?? 0) / 100 * H;
      const pts = `${cx},${cy - h/2} ${cx + w/2},${cy} ${cx},${cy + h/2} ${cx - w/2},${cy}`;
      return `<polygon points="${pts}" fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },

  crescent: {
    label: 'Crescent',
    params: {
      size:    { label: 'Size %',      min: 10, max: 55, default: 28 },
      gap:     { label: 'Gap',         min: 5,  max: 95, default: 60 },
      rotate:  { label: 'Rotation °',  min: 0,  max: 359, default: 0 },
      offsetX: { label: 'Position X',  min: -40, max: 40, default: 0 },
      offsetY: { label: 'Position Y',  min: -40, max: 40, default: 0 },
    },
    render(c, p) {
      const W = CANVAS_W, H = CANVAS_H;
      const R      = (p.size ?? 28) / 100 * Math.min(W, H) / 2;
      const gap    = (p.gap  ?? 60) / 100;
      const rot    = (p.rotate ?? 0) * Math.PI / 180;
      const cx     = W / 2 + (p.offsetX ?? 0) / 100 * W;
      const cy     = H / 2 + (p.offsetY ?? 0) / 100 * H;
      const innerR = R * 0.92;
      const d      = R * gap * 1.05;
      const ix     = cx + d * Math.cos(rot);
      const iy     = cy + d * Math.sin(rot);
      const mid    = `cm-${c.id || 'x'}`;
      return `<defs><mask id="${mid}"><circle cx="${cx}" cy="${cy}" r="${R}" fill="white"/><circle cx="${ix.toFixed(2)}" cy="${iy.toFixed(2)}" r="${innerR.toFixed(2)}" fill="black"/></mask></defs><circle cx="${cx}" cy="${cy}" r="${R.toFixed(2)}" fill="${c.color}" opacity="${c.opacity/100}" mask="url(#${mid})"/>`;
    }
  },

  star: {
    label: 'Star',
    params: {
      points:  { label: 'Points',        min: 4,  max: 12, default: 5, step: 1 },
      size:    { label: 'Size %',        min: 5,  max: 70, default: 25 },
      inner:   { label: 'Inner radius %', min: 15, max: 75, default: 40 },
      offsetX: { label: 'Position X',    min: -40, max: 40, default: 0 },
      offsetY: { label: 'Position Y',    min: -40, max: 40, default: 0 },
    },
    render(c, p) {
      const W = CANVAS_W, H = CANVAS_H;
      const n      = Math.max(4, Math.round(p.points ?? 5));
      const outerR = (p.size  ?? 25) / 100 * Math.min(W, H) / 2;
      const innerR = outerR * (p.inner ?? 40) / 100;
      const cx     = W / 2 + (p.offsetX ?? 0) / 100 * W;
      const cy     = H / 2 + (p.offsetY ?? 0) / 100 * H;
      let pts = '';
      for (let i = 0; i < n * 2; i++) {
        const r     = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI / n) - Math.PI / 2;
        pts += `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)} `;
      }
      return `<polygon points="${pts.trim()}" fill="${c.color}" opacity="${c.opacity/100}"/>`;
    }
  },
};

// ---- Main render function ----
// Writes into an existing <svg> element.
// emblems: array of Emblem objects (rendered by emblem layer separately)

function renderFlag(svgEl, design, selectedEmblemId = null, multiSelectIds = null) {
  // Determine active flag shape
  const shapeId = design.flagShape || 'rect32';
  const shape = FLAG_SHAPES[shapeId] || FLAG_SHAPES.rect32;
  CANVAS_W = shape.w;
  CANVAS_H = shape.h;

  // Update SVG element dimensions (inline style overrides CSS fixed dimensions)
  svgEl.setAttribute('viewBox', `0 0 ${shape.w} ${shape.h}`);
  svgEl.setAttribute('width',  shape.dispW);
  svgEl.setAttribute('height', shape.dispH);
  svgEl.style.width  = shape.dispW + 'px';
  svgEl.style.height = shape.dispH + 'px';
  // Resize the canvas-center wrapper to match flag width
  const ccEl = document.getElementById('canvas-center');
  if (ccEl) ccEl.style.width = shape.dispW + 'px';

  // Clear previous rendered content (layers, emblems, clip group)
  const existing = svgEl.querySelectorAll('.render-layer, .render-emblem, .render-group, .render-defs');
  existing.forEach(el => el.remove());

  // Manage defs for clip path
  let defs = svgEl.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svgEl.insertBefore(defs, svgEl.firstChild);
  }
  // Remove old shape clip
  const oldClip = defs.querySelector('#flag-shape-clip');
  if (oldClip) oldClip.remove();

  if (shape.clip) {
    const clipEl = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipEl.setAttribute('id', 'flag-shape-clip');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', shape.clip);
    clipEl.appendChild(poly);
    defs.appendChild(clipEl);
  } else if (shape.clipD) {
    const clipEl = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipEl.setAttribute('id', 'flag-shape-clip');
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', shape.clipD);
    clipEl.appendChild(pathEl);
    defs.appendChild(clipEl);
  }

  // Create clipped group for all content
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.classList.add('render-group');
  if (shape.clip || shape.clipD) group.setAttribute('clip-path', 'url(#flag-shape-clip)');

  // White base rect
  const base = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  base.setAttribute('width', shape.w); base.setAttribute('height', shape.h);
  base.setAttribute('fill', 'white');
  group.appendChild(base);

  // Render layers
  design.layers.forEach(layer => {
    if (!layer.visible) return;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('render-layer');
    g.dataset.layerId = layer.id;
    g.innerHTML = renderLayer(layer);
    group.appendChild(g);
  });

  // Render emblems into the clipped group
  design.emblems.forEach(emblem => {
    const isSel      = emblem.id === selectedEmblemId;
    const isMultiSel = multiSelectIds ? multiSelectIds.has(emblem.id) : false;
    renderEmblemEl(group, emblem, isSel, isMultiSel);
  });

  svgEl.appendChild(group);
}

function renderLayer(layer) {
  if (layer.type === 'hstripes') return renderStripes(layer, false);
  if (layer.type === 'vstripes') return renderStripes(layer, true);
  if (layer.type === 'overlay')  return renderOverlay(layer);
  return '';
}

function _patternDef(id, type, color, bg) {
  // Returns an SVG <pattern> definition string for hatch/dots/checker fills
  const c = color, b = bg || 'transparent';
  if (type === 'hatch45') return `<pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(0)"><rect width="8" height="8" fill="${b}"/><line x1="0" y1="0" x2="8" y2="8" stroke="${c}" stroke-width="2"/></pattern>`;
  if (type === 'hatch-h') return `<pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${b}"/><line x1="0" y1="4" x2="8" y2="4" stroke="${c}" stroke-width="2"/></pattern>`;
  if (type === 'hatch-v') return `<pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${b}"/><line x1="4" y1="0" x2="4" y2="8" stroke="${c}" stroke-width="2"/></pattern>`;
  if (type === 'crosshatch') return `<pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${b}"/><line x1="0" y1="0" x2="8" y2="8" stroke="${c}" stroke-width="1.5"/><line x1="8" y1="0" x2="0" y2="8" stroke="${c}" stroke-width="1.5"/></pattern>`;
  if (type === 'dots')  return `<pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="${b}"/><circle cx="5" cy="5" r="2.5" fill="${c}"/></pattern>`;
  if (type === 'checker') return `<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="${b}"/><rect x="0" y="0" width="8" height="8" fill="${c}"/><rect x="8" y="8" width="8" height="8" fill="${c}"/></pattern>`;
  return null;
}

function renderStripes(layer, vertical) {
  const bands = layer.bands || [];
  if (!bands.length) return '';
  const total = bands.reduce((s, b) => s + (b.weight || 1), 0);
  let defs = '';
  let out = '';
  let pos = 0;
  bands.forEach((band, i) => {
    const size = (band.weight || 1) / total;
    let fill = band.color;
    if (band.gradient && band.gradientEnd) {
      const gradId = `stripe-grad-${layer.id}-${i}`;
      const [x1,y1,x2,y2] = vertical ? ['0%','0%','0%','100%'] : ['0%','0%','100%','0%'];
      defs += `<linearGradient id="${gradId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
        <stop offset="0%" stop-color="${band.color}"/>
        <stop offset="100%" stop-color="${band.gradientEnd}"/>
      </linearGradient>`;
      fill = `url(#${gradId})`;
    } else if (band.pattern && band.pattern !== 'solid') {
      const patId = `stripe-pat-${layer.id}-${i}`;
      const patDef = _patternDef(patId, band.pattern, band.color, band.patternBg || 'transparent');
      if (patDef) { defs += patDef; fill = `url(#${patId})`; }
    }
    if (vertical) {
      const x = pos * CANVAS_W;
      const w = size * CANVAS_W;
      out += `<rect x="${x}" y="0" width="${w}" height="${CANVAS_H}" fill="${fill}"/>`;
    } else {
      const y = pos * CANVAS_H;
      const h = size * CANVAS_H;
      out += `<rect x="0" y="${y}" width="${CANVAS_W}" height="${h}" fill="${fill}"/>`;
    }
    pos += size;
  });
  return defs ? `<defs>${defs}</defs>${out}` : out;
}

function renderOverlay(layer) {
  const shape = SHAPES[layer.shape];
  if (!shape) return '';
  const content = shape.render(
    { color: layer.color || '#ffffff', color2: layer.color2 || '#000000', opacity: layer.opacity ?? 100, id: layer.id },
    layer.params || {}
  );
  const region = layer.clipRegion;
  if (!region || region === 'full') return content;
  const clipId  = `cr-${layer.id}`;
  const clipDef = _clipRegionPath(region, CANVAS_W, CANVAS_H);
  if (!clipDef) return content;
  return `<defs><clipPath id="${clipId}"><path d="${clipDef}"/></clipPath></defs><g clip-path="url(#${clipId})">${content}</g>`;
}

function _clipRegionPath(region, W, H) {
  const hw = W / 2, hh = H / 2;
  switch (region) {
    case 'top':    return `M0,0 L${W},0 L${W},${hh} L0,${hh} Z`;
    case 'bottom': return `M0,${hh} L${W},${hh} L${W},${H} L0,${H} Z`;
    case 'left':   return `M0,0 L${hw},0 L${hw},${H} L0,${H} Z`;
    case 'right':  return `M${hw},0 L${W},0 L${W},${H} L${hw},${H} Z`;
    case 'tl':     return `M0,0 L${hw},0 L${hw},${hh} L0,${hh} Z`;
    case 'tr':     return `M${hw},0 L${W},0 L${W},${hh} L${hw},${hh} Z`;
    case 'bl':     return `M0,${hh} L${hw},${hh} L${hw},${H} L0,${H} Z`;
    case 'br':     return `M${hw},${hh} L${W},${hh} L${W},${H} L${hw},${H} Z`;
    default:       return null;
  }
}

// ---- Emblem rendering ----
// emblem.x/y are % of canvas; emblem.size is % of canvas width

function renderEmblemEl(svgEl, emblem, selected, multiSelected) {
  if (emblem.hidden) return;
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.classList.add('render-emblem');
  g.dataset.emblemId = emblem.id;
  if (emblem.opacity != null && emblem.opacity < 100) {
    g.setAttribute('opacity', emblem.opacity / 100);
  }

  const px    = emblem.x / 100 * CANVAS_W;
  const py    = emblem.y / 100 * CANVAS_H;
  const sz    = emblem.size / 100 * CANVAS_W;
  const sxm   = emblem.scaleX || 1;   // width multiplier
  const sym   = emblem.scaleY || 1;   // height multiplier
  const w     = sz * sxm;             // actual display width
  const h     = sz * sym;             // actual display height
  const half  = sz / 2;               // kept for backward compat (uniform handles)
  const halfW = w / 2;
  const halfH = h / 2;

  // ---- Group emblem — render children as a unit ----
  if (emblem.type === 'group' && Array.isArray(emblem.children)) {
    emblem.children.forEach(child => _renderGroupChild(g, child));

    // Bounding box for hitbox + selection
    const bounds = emblem.children.filter(c => !c.hidden).map(c => {
      const cx = c.x / 100 * CANVAS_W;
      const cy = c.y / 100 * CANVAS_H;
      const h  = (c.size / 100 * CANVAS_W) / 2;
      return { x1: cx - h, y1: cy - h, x2: cx + h, y2: cy + h };
    });
    if (bounds.length > 0) {
      const bx1 = Math.min(...bounds.map(b => b.x1));
      const by1 = Math.min(...bounds.map(b => b.y1));
      const bx2 = Math.max(...bounds.map(b => b.x2));
      const by2 = Math.max(...bounds.map(b => b.y2));
      const hitbox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      hitbox.setAttribute('x', bx1); hitbox.setAttribute('y', by1);
      hitbox.setAttribute('width', bx2 - bx1); hitbox.setAttribute('height', by2 - by1);
      hitbox.setAttribute('fill', 'transparent');
      hitbox.classList.add('emblem-hitbox');
      g.appendChild(hitbox);
      if (selected || multiSelected) {
        const selR = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        selR.setAttribute('x', bx1 - 2); selR.setAttribute('y', by1 - 2);
        selR.setAttribute('width', bx2 - bx1 + 4); selR.setAttribute('height', by2 - by1 + 4);
        selR.setAttribute('fill', 'none');
        selR.setAttribute('stroke', selected ? '#2563EB' : '#06B6D4');
        selR.setAttribute('stroke-width', '1.5');
        selR.setAttribute('stroke-dasharray', '5 3');
        selR.style.pointerEvents = 'none';
        g.appendChild(selR);
      }
    }
    svgEl.appendChild(g);
    return;
  }

  // Build transform: translate to position, rotate, then flip
  const sx = emblem.flipX ? -1 : 1;
  const sy = emblem.flipY ? -1 : 1;
  g.setAttribute('transform',
    `translate(${px},${py}) rotate(${emblem.rotate || 0}) scale(${sx},${sy})`);

  // Shape emblem — render a basic geometric shape
  if (emblem.type === 'shape') {
    const shapeDef = BASIC_SHAPES[emblem.shapeKey];
    if (shapeDef) {
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('x', -halfW);
      icon.setAttribute('y', -halfH);
      icon.setAttribute('width', w);
      icon.setAttribute('height', h);
      icon.setAttribute('viewBox', '0 0 100 100');
      icon.setAttribute('preserveAspectRatio', 'none');
      icon.setAttribute('overflow', 'visible');
      icon.setAttribute('fill', emblem.fg || '#ffffff');
      if (emblem.strokeColor && emblem.strokeWidth > 0) {
        // Scale stroke width to viewBox units so it looks consistent at any size
        const sw = (emblem.strokeWidth / Math.min(w, h)) * 100;
        icon.setAttribute('stroke', emblem.strokeColor);
        icon.setAttribute('stroke-width', sw);
        icon.setAttribute('paint-order', 'stroke fill');
      }
      icon.innerHTML = shapeDef.path;
      g.appendChild(icon);
    }
    const hitbox = _makeHitbox(halfW, halfH);
    g.appendChild(hitbox);
    if (multiSelected && !selected) {
      const msRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      msRect.setAttribute('x', -halfW); msRect.setAttribute('y', -halfH);
      msRect.setAttribute('width', w); msRect.setAttribute('height', h);
      msRect.setAttribute('fill', 'none'); msRect.setAttribute('stroke', '#06B6D4');
      msRect.setAttribute('stroke-width', '1.5'); msRect.setAttribute('stroke-dasharray', '4 3');
      msRect.style.pointerEvents = 'none';
      g.appendChild(msRect);
    }
    if (selected) _appendEmblemHandles(g, halfW, halfH);
    svgEl.appendChild(g);
    return;
  }

  // Text emblem — render as SVG text
  if (emblem.type === 'text') {
    _renderTextContent(g, emblem, sz);
    const estW = Math.max(w, (emblem.text || '').length * sz * 0.55);
    const estH = h;
    const hitbox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hitbox.setAttribute('x', -estW/2); hitbox.setAttribute('y', -estH/2);
    hitbox.setAttribute('width', estW); hitbox.setAttribute('height', estH);
    hitbox.setAttribute('fill', 'transparent');
    hitbox.classList.add('emblem-hitbox');
    g.appendChild(hitbox);
    if (selected) _appendEmblemHandles(g, estW/2, estH/2);
    svgEl.appendChild(g);
    return;
  }

  // Background rect
  if (emblem.bg && emblem.bg !== 'transparent') {
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', -halfW); bg.setAttribute('y', -halfH);
    bg.setAttribute('width', w); bg.setAttribute('height', h);
    bg.setAttribute('fill', emblem.bg);
    g.appendChild(bg);
  }

  // Icon content (inline SVG)
  if (emblem._svgContent) {
    let svgSrc = emblem._svgContent;
    // Legacy per-colour remap (still honoured for old saved designs)
    if (emblem.heraldic && emblem.heraldColours && Object.keys(emblem.heraldColours).length > 0 && !emblem.tintColor) {
      svgSrc = _applyHeraldicColourMap(svgSrc, emblem.heraldColours);
    }
    const div = document.createElement('div');
    div.innerHTML = svgSrc;
    const inner = div.querySelector('svg');
    if (inner) {
      // Strip Inkscape/RDF metadata — it contains undeclared namespace prefixes
      // (rdf:RDF, dc:, cc:) that break XMLSerializer → DOMParser round-trips
      inner.querySelectorAll('metadata, sodipodi\\:namedview').forEach(el => el.remove());
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('x', -halfW); icon.setAttribute('y', -halfH);
      icon.setAttribute('width', w); icon.setAttribute('height', h);
      const vb = inner.getAttribute('viewBox') ||
        `0 0 ${inner.getAttribute('width') || 512} ${inner.getAttribute('height') || 512}`;
      icon.setAttribute('viewBox', vb);
      // Heraldic: preserve aspect ratio so proportions aren't distorted
      icon.setAttribute('preserveAspectRatio', emblem.heraldic ? 'xMidYMid meet' : 'none');
      icon.setAttribute('overflow', 'visible');
      icon.innerHTML = inner.innerHTML;
      if (emblem.heraldic && emblem.tintColor) {
        // Grayscale → tint filter: preserves luminance shading, applies chosen hue
        const tc = emblem.tintColor.length === 7 ? emblem.tintColor : '#ffffff';
        const r = parseInt(tc.slice(1,3),16)/255, g2 = parseInt(tc.slice(3,5),16)/255, b = parseInt(tc.slice(5,7),16)/255;
        const m = `${.299*r} ${.587*r} ${.114*r} 0 0 ${.299*g2} ${.587*g2} ${.114*g2} 0 0 ${.299*b} ${.587*b} ${.114*b} 0 0 0 0 0 1 0`;
        const fid = `ht${emblem.id.replace(/-/g,'')}`;
        const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
        defs.innerHTML = `<filter id="${fid}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${m}"/></filter>`;
        icon.insertBefore(defs, icon.firstChild);
        icon.setAttribute('filter', `url(#${fid})`);
      } else if (!emblem.heraldic) {
        icon.setAttribute('fill', emblem.fg || '#ffffff');
      }
      if (emblem.strokeColor && emblem.strokeWidth > 0) {
        icon.setAttribute('stroke', emblem.strokeColor);
        icon.setAttribute('stroke-width', emblem.strokeWidth);
        icon.setAttribute('paint-order', 'stroke fill');
      }
      g.appendChild(icon);
    }
  }

  const hitbox = _makeHitbox(halfW, halfH);
  g.appendChild(hitbox);
  if (multiSelected && !selected) {
    const msRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    msRect.setAttribute('x', -halfW); msRect.setAttribute('y', -halfH);
    msRect.setAttribute('width', w); msRect.setAttribute('height', h);
    msRect.setAttribute('fill', 'none');
    msRect.setAttribute('stroke', '#06B6D4');
    msRect.setAttribute('stroke-width', '1.5');
    msRect.setAttribute('stroke-dasharray', '4 3');
    msRect.style.pointerEvents = 'none';
    g.appendChild(msRect);
  }
  if (selected) _appendEmblemHandles(g, halfW, halfH);
  svgEl.appendChild(g);
}

// ---- Transparent hitbox for mouse events ----
function _makeHitbox(halfW, halfH) {
  if (halfH === undefined) halfH = halfW;
  const h = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  h.setAttribute('x', -halfW); h.setAttribute('y', -halfH);
  h.setAttribute('width', halfW * 2); h.setAttribute('height', halfH * 2);
  h.setAttribute('fill', 'transparent');
  h.classList.add('emblem-hitbox');
  return h;
}

// ---- Render a single emblem as a group child (no data-emblem-id, no handles) ----
function _renderGroupChild(parentG, child) {
  if (child.hidden) return;
  const px   = child.x    / 100 * CANVAS_W;
  const py   = child.y    / 100 * CANVAS_H;
  const sz   = child.size / 100 * CANVAS_W;
  const half = sz / 2;
  const sx   = child.flipX ? -1 : 1;
  const sy   = child.flipY ? -1 : 1;

  const cg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  cg.classList.add('group-child');
  cg.setAttribute('transform', `translate(${px},${py}) rotate(${child.rotate||0}) scale(${sx},${sy})`);

  if (child.type === 'shape') {
    const shapeDef = BASIC_SHAPES[child.shapeKey];
    if (shapeDef) {
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('x', -half); icon.setAttribute('y', -half);
      icon.setAttribute('width', sz); icon.setAttribute('height', sz);
      icon.setAttribute('viewBox', '0 0 100 100');
      icon.setAttribute('fill', child.fg || '#ffffff');
      icon.innerHTML = shapeDef.path;
      cg.appendChild(icon);
    }
  } else if (child.type === 'text') {
    _renderTextContent(cg, child, sz);
  } else {
    if (child.bg && child.bg !== 'transparent') {
      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bg.setAttribute('x', -half); bg.setAttribute('y', -half);
      bg.setAttribute('width', sz); bg.setAttribute('height', sz);
      bg.setAttribute('fill', child.bg);
      cg.appendChild(bg);
    }
    if (child._svgContent) {
      let svgSrc = child._svgContent;
      if (child.heraldic && child.heraldColours && Object.keys(child.heraldColours).length > 0 && !child.tintColor) {
        svgSrc = _applyHeraldicColourMap(svgSrc, child.heraldColours);
      }
      const div = document.createElement('div');
      div.innerHTML = svgSrc;
      const inner = div.querySelector('svg');
      if (inner) {
        inner.querySelectorAll('metadata, sodipodi\\:namedview').forEach(el => el.remove());
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('x', -half); icon.setAttribute('y', -half);
        icon.setAttribute('width', sz); icon.setAttribute('height', sz);
        const vb = inner.getAttribute('viewBox') ||
          `0 0 ${inner.getAttribute('width')||512} ${inner.getAttribute('height')||512}`;
        icon.setAttribute('viewBox', vb);
        icon.setAttribute('preserveAspectRatio', child.heraldic ? 'xMidYMid meet' : 'none');
        icon.innerHTML = inner.innerHTML;
        if (child.heraldic && child.tintColor) {
          const tc = child.tintColor.length === 7 ? child.tintColor : '#ffffff';
          const r = parseInt(tc.slice(1,3),16)/255, g2 = parseInt(tc.slice(3,5),16)/255, b = parseInt(tc.slice(5,7),16)/255;
          const m = `${.299*r} ${.587*r} ${.114*r} 0 0 ${.299*g2} ${.587*g2} ${.114*g2} 0 0 ${.299*b} ${.587*b} ${.114*b} 0 0 0 0 0 1 0`;
          const fid = `ht${child.id.replace(/-/g,'')}`;
          const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
          defs.innerHTML = `<filter id="${fid}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${m}"/></filter>`;
          icon.insertBefore(defs, icon.firstChild);
          icon.setAttribute('filter', `url(#${fid})`);
        } else if (!child.heraldic) {
          icon.setAttribute('fill', child.fg || '#ffffff');
        }
        cg.appendChild(icon);
      }
    }
  }
  parentG.appendChild(cg);
}

// ---- MS Word-style selection handles ----
// Renders: dashed outline + 4 corner resize handles + 1 rotation handle
// halfW / halfH define the rectangle (halfH defaults to halfW for squares)
function _appendEmblemHandles(g, halfW, halfH) {
  if (halfH === undefined) halfH = halfW;
  const minH = Math.min(halfW, halfH);
  const HS = Math.max(4, Math.min(7, minH * 0.12)); // handle half-size (4–7px)
  const RC = Math.max(4, Math.min(6, minH * 0.1));  // rotation circle radius
  const RO = Math.max(16, halfH * 0.25 + 10);       // rotation handle offset above emblem

  // Dashed blue selection outline (rectangular)
  const sel = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  sel.setAttribute('x', -halfW); sel.setAttribute('y', -halfH);
  sel.setAttribute('width', halfW * 2); sel.setAttribute('height', halfH * 2);
  sel.setAttribute('fill', 'none');
  sel.setAttribute('stroke', '#2563EB');
  sel.setAttribute('stroke-width', '1.5');
  sel.setAttribute('stroke-dasharray', '5 3');
  sel.style.pointerEvents = 'none';
  g.appendChild(sel);

  // Rotation connector line (from top center)
  const rotLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  rotLine.setAttribute('x1', 0); rotLine.setAttribute('y1', -halfH);
  rotLine.setAttribute('x2', 0); rotLine.setAttribute('y2', -(halfH + RO));
  rotLine.setAttribute('stroke', '#2563EB'); rotLine.setAttribute('stroke-width', '1.5');
  rotLine.style.pointerEvents = 'none';
  g.appendChild(rotLine);

  // Rotation handle circle
  const rotH = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  rotH.setAttribute('cx', 0); rotH.setAttribute('cy', -(halfH + RO));
  rotH.setAttribute('r', RC);
  rotH.setAttribute('fill', 'white'); rotH.setAttribute('stroke', '#2563EB');
  rotH.setAttribute('stroke-width', '1.5');
  rotH.dataset.handle = 'rotate';
  rotH.classList.add('emblem-handle');
  rotH.style.cursor = 'grab';
  g.appendChild(rotH);

  // 4 corner resize handles (placed at actual rectangle corners)
  const corners = [
    { key: 'resize-tl', cx: -halfW, cy: -halfH, cur: 'nwse-resize' },
    { key: 'resize-tr', cx:  halfW, cy: -halfH, cur: 'nesw-resize' },
    { key: 'resize-bl', cx: -halfW, cy:  halfH, cur: 'nesw-resize' },
    { key: 'resize-br', cx:  halfW, cy:  halfH, cur: 'nwse-resize' },
  ];
  corners.forEach(({ key, cx, cy, cur }) => {
    const h = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    h.setAttribute('x', cx - HS); h.setAttribute('y', cy - HS);
    h.setAttribute('width', HS * 2); h.setAttribute('height', HS * 2);
    h.setAttribute('fill', 'white'); h.setAttribute('stroke', '#2563EB');
    h.setAttribute('stroke-width', '1.5'); h.setAttribute('rx', '1.5');
    h.dataset.handle = key;
    h.classList.add('emblem-handle');
    h.style.cursor = cur;
    g.appendChild(h);
  });
}

// Internal colour map application (mirrors applyHeraldicColourMap in app.js)
function _applyHeraldicColourMap(svgStr, colourMap) {
  let result = svgStr;
  for (const [from, to] of Object.entries(colourMap)) {
    result = result.replaceAll(`fill:${from}`, `fill:${to}`);
    result = result.replaceAll(`fill:${from.toUpperCase()}`, `fill:${to}`);
    result = result.replaceAll(`fill="${from}"`, `fill="${to}"`);
  }
  return result;
}

// ---- Thumbnail ----
// Returns an SVG element (60x40) for use in layer cards / saved designs

function makeThumbnail(des) {
  const shapeId = des.flagShape || 'rect32';
  const shape = FLAG_SHAPES[shapeId] || FLAG_SHAPES.rect32;
  // renderLayer() uses global CANVAS_W/H — save and override so overlays
  // render correctly for this design's flag shape, then restore.
  const savedW = CANVAS_W, savedH = CANVAS_H;
  CANVAS_W = shape.w; CANVAS_H = shape.h;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${shape.w} ${shape.h}`);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  if (shape.clip || shape.clipD) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    if (shape.clip) {
      defs.innerHTML = `<clipPath id="thumb-clip"><polygon points="${shape.clip}"/></clipPath>`;
    } else {
      defs.innerHTML = `<clipPath id="thumb-clip"><path d="${shape.clipD}"/></clipPath>`;
    }
    svg.appendChild(defs);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('clip-path', 'url(#thumb-clip)');
    des.layers.forEach(layer => {
      if (!layer.visible) return;
      const lg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      lg.innerHTML = renderLayer(layer);
      g.appendChild(lg);
    });
    svg.appendChild(g);
  } else {
    des.layers.forEach(layer => {
      if (!layer.visible) return;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.innerHTML = renderLayer(layer);
      svg.appendChild(g);
    });
  }

  CANVAS_W = savedW; CANVAS_H = savedH;
  return svg;
}

// ---- Text emblem rendering ----
function _renderTextContent(g, emblem, sz) {
  const fontSize = Math.max(8, sz * 0.7);
  const font     = emblem.fontFamily || 'Bebas Neue';
  const fill     = emblem.fg || '#ffffff';
  const arc      = emblem.textArc || 0;

  const applyTextStroke = el => {
    if (emblem.strokeColor && emblem.strokeWidth > 0) {
      el.setAttribute('stroke', emblem.strokeColor);
      el.setAttribute('stroke-width', emblem.strokeWidth);
      el.setAttribute('paint-order', 'stroke fill');
    }
  };

  if (arc === 0) {
    // Straight text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('font-family', font);
    text.setAttribute('font-size', fontSize);
    text.setAttribute('fill', fill);
    text.setAttribute('font-weight', '700');
    text.textContent = emblem.text || '';
    applyTextStroke(text);
    g.appendChild(text);
  } else {
    // Curved text using textPath
    const r = Math.max(20, Math.abs(400 / arc));
    const pathId = `tp_${emblem.id.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // Ensure defs exist on the SVG
    const svgEl = g.ownerSVGElement;
    let defs = svgEl?.querySelector('defs');
    if (!defs && svgEl) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svgEl.insertBefore(defs, svgEl.firstChild);
    }
    if (defs) {
      defs.querySelector(`#${pathId}`)?.remove();
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('id', pathId);
      // arc > 0 = text curves up (smiling arc), arc < 0 = text curves down
      const sweep = arc > 0 ? 1 : 0;
      pathEl.setAttribute('d', `M ${-r},0 A ${r},${r} 0 0 ${sweep} ${r},0`);
      defs.appendChild(pathEl);
    }

    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('fill', fill);
    textEl.setAttribute('font-family', font);
    textEl.setAttribute('font-size', fontSize);
    textEl.setAttribute('font-weight', '700');
    applyTextStroke(textEl);

    const tPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    tPath.setAttribute('href', `#${pathId}`);
    tPath.setAttribute('startOffset', '50%');
    tPath.setAttribute('text-anchor', 'middle');
    tPath.textContent = emblem.text || '';
    textEl.appendChild(tPath);
    g.appendChild(textEl);
  }
}
