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
  star5:     { label: 'Star 5pt',   path: '<polygon points="50,5 62,34 95,36 70,57 77,88 50,71 23,88 30,57 5,36 38,34"/>' },
  star6:     { label: 'Star 6pt',   path: '<g fill-rule="evenodd"><polygon points="50,6 92,72 8,72"/><polygon points="50,94 8,28 92,28"/></g>' },
  star8:     { label: 'Star 8pt',   path: '<polygon points="50,5 57,32 82,18 68,43 95,50 68,57 82,82 57,68 50,95 43,68 18,82 32,57 5,50 32,43 18,18 43,32"/>' },
  diamond:   { label: 'Diamond',    path: '<polygon points="50,4 96,50 50,96 4,50"/>' },
  circle:    { label: 'Circle',     path: '<circle cx="50" cy="50" r="46"/>' },
  moon:      { label: 'Crescent',   path: '<path fill-rule="evenodd" d="M50,8 A42,42 0 1,0 50,92 A42,42 0 1,0 50,8 M60,16 A34,34 0 1,1 60,84 A34,34 0 1,1 60,16"/>' },
  triangle:  { label: 'Triangle',   path: '<polygon points="50,5 95,90 5,90"/>' },
  tridown:   { label: 'Tri Down',   path: '<polygon points="50,95 5,10 95,10"/>' },
  square:    { label: 'Square',     path: '<rect x="6" y="6" width="88" height="88"/>' },
  cross:     { label: 'Cross',      path: '<path d="M42,5 L58,5 58,42 95,42 95,58 58,58 58,95 42,95 42,58 5,58 5,42 42,42 Z"/>' },
  crossbold: { label: 'Bold Cross', path: '<path d="M32,5 L68,5 68,32 95,32 95,68 68,68 68,95 32,95 32,68 5,68 5,32 32,32 Z"/>' },
  chevron:   { label: 'Chevron',    path: '<path d="M20,5 L65,50 20,95 35,95 80,50 35,5 Z"/>' },
  pentagon:  { label: 'Pentagon',   path: '<polygon points="50,5 95,38 77,92 23,92 5,38"/>' },
  hexagon:   { label: 'Hexagon',    path: '<polygon points="50,5 91,27 91,73 50,95 9,73 9,27"/>' },
  ring:      { label: 'Ring',       path: '<path fill-rule="evenodd" d="M50,6 A44,44 0 1,0 50,94 A44,44 0 1,0 50,6 M50,24 A26,26 0 1,1 50,76 A26,26 0 1,1 50,24"/>' },
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
      const angle1 = Math.atan2(CANVAS_H, CANVAS_W) * 180 / Math.PI;
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
};

// ---- Main render function ----
// Writes into an existing <svg> element.
// emblems: array of Emblem objects (rendered by emblem layer separately)

function renderFlag(svgEl, design, selectedEmblemId = null) {
  // Determine active flag shape
  const shapeId = design.flagShape || 'rect32';
  const shape = FLAG_SHAPES[shapeId] || FLAG_SHAPES.rect32;
  CANVAS_W = shape.w;
  CANVAS_H = shape.h;

  // Update SVG element dimensions
  svgEl.setAttribute('viewBox', `0 0 ${shape.w} ${shape.h}`);
  svgEl.setAttribute('width',  shape.dispW);
  svgEl.setAttribute('height', shape.dispH);

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
  }

  // Create clipped group for all content
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.classList.add('render-group');
  if (shape.clip) group.setAttribute('clip-path', 'url(#flag-shape-clip)');

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
    renderEmblemEl(group, emblem, emblem.id === selectedEmblemId);
  });

  svgEl.appendChild(group);
}

function renderLayer(layer) {
  if (layer.type === 'hstripes') return renderStripes(layer, false);
  if (layer.type === 'vstripes') return renderStripes(layer, true);
  if (layer.type === 'overlay')  return renderOverlay(layer);
  return '';
}

function renderStripes(layer, vertical) {
  const bands = layer.bands || [];
  if (!bands.length) return '';
  const total = bands.reduce((s, b) => s + (b.weight || 1), 0);
  let out = '';
  let pos = 0;
  bands.forEach(band => {
    const size = (band.weight || 1) / total;
    if (vertical) {
      const x = pos * CANVAS_W;
      const w = size * CANVAS_W;
      out += `<rect x="${x}" y="0" width="${w}" height="${CANVAS_H}" fill="${band.color}"/>`;
    } else {
      const y = pos * CANVAS_H;
      const h = size * CANVAS_H;
      out += `<rect x="0" y="${y}" width="${CANVAS_W}" height="${h}" fill="${band.color}"/>`;
    }
    pos += size;
  });
  return out;
}

function renderOverlay(layer) {
  const shape = SHAPES[layer.shape];
  if (!shape) return '';
  return shape.render(
    { color: layer.color || '#ffffff', color2: layer.color2 || '#000000', opacity: layer.opacity ?? 100 },
    layer.params || {}
  );
}

// ---- Emblem rendering ----
// emblem.x/y are % of canvas; emblem.size is % of canvas width

function renderEmblemEl(svgEl, emblem, selected) {
  if (emblem.hidden) return;
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.classList.add('render-emblem');
  g.dataset.emblemId = emblem.id;

  const px = emblem.x / 100 * CANVAS_W;
  const py = emblem.y / 100 * CANVAS_H;
  const sz = emblem.size / 100 * CANVAS_W;
  const half = sz / 2;

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
      icon.setAttribute('x', -half);
      icon.setAttribute('y', -half);
      icon.setAttribute('width', sz);
      icon.setAttribute('height', sz);
      icon.setAttribute('viewBox', '0 0 100 100');
      icon.setAttribute('fill', emblem.fg || '#ffffff');
      icon.innerHTML = shapeDef.path;
      g.appendChild(icon);
    }
    // Hitbox
    const hitbox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hitbox.setAttribute('x', -half); hitbox.setAttribute('y', -half);
    hitbox.setAttribute('width', sz); hitbox.setAttribute('height', sz);
    hitbox.setAttribute('fill', 'transparent');
    hitbox.setAttribute('stroke', selected ? '#d4a832' : 'transparent');
    hitbox.setAttribute('stroke-width', '2');
    hitbox.setAttribute('stroke-dasharray', selected ? '4 2' : 'none');
    hitbox.classList.add('emblem-hitbox');
    g.appendChild(hitbox);
    svgEl.appendChild(g);
    return;
  }

  // Text emblem — render as SVG text
  if (emblem.type === 'text') {
    _renderTextContent(g, emblem, sz);
    // Hitbox (rough estimate)
    const estW = Math.max(sz, (emblem.text || '').length * sz * 0.55);
    const hitbox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hitbox.setAttribute('x', -estW/2); hitbox.setAttribute('y', -sz/2);
    hitbox.setAttribute('width', estW); hitbox.setAttribute('height', sz);
    hitbox.setAttribute('fill', 'transparent');
    hitbox.setAttribute('stroke', selected ? '#d4a832' : 'transparent');
    hitbox.setAttribute('stroke-width', '2');
    hitbox.setAttribute('stroke-dasharray', selected ? '4 2' : 'none');
    hitbox.classList.add('emblem-hitbox');
    g.appendChild(hitbox);
    svgEl.appendChild(g);
    return;
  }

  // Background rect
  if (emblem.bg && emblem.bg !== 'transparent') {
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', -half); bg.setAttribute('y', -half);
    bg.setAttribute('width', sz); bg.setAttribute('height', sz);
    bg.setAttribute('fill', emblem.bg);
    g.appendChild(bg);
  }

  // Icon content (inline SVG)
  if (emblem._svgContent) {
    // For heraldic emblems, apply colour remap before injecting
    let svgSrc = emblem._svgContent;
    if (emblem.heraldic && emblem.heraldColours && Object.keys(emblem.heraldColours).length > 0) {
      svgSrc = _applyHeraldicColourMap(svgSrc, emblem.heraldColours);
    } else if (emblem.heraldic && emblem.fillOverride) {
      // Override all fills for icons with no extractable tinctures
      svgSrc = svgSrc.replace(/fill\s*:\s*#[0-9a-fA-F]{3,8}/gi, `fill:${emblem.fillOverride}`);
      svgSrc = svgSrc.replace(/fill="[^"]*"/g, `fill="${emblem.fillOverride}"`);
    }

    const div = document.createElement('div');
    div.innerHTML = svgSrc;
    const inner = div.querySelector('svg');
    if (inner) {
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('x', -half); icon.setAttribute('y', -half);
      icon.setAttribute('width', sz); icon.setAttribute('height', sz);
      // Use the source viewBox; fall back sensibly for DrawShield (400×420) and game-icons (512×512)
      const vb = inner.getAttribute('viewBox') ||
        `0 0 ${inner.getAttribute('width') || 512} ${inner.getAttribute('height') || 512}`;
      icon.setAttribute('viewBox', vb);
      icon.innerHTML = inner.innerHTML;
      // Only set fill for non-heraldic icons (game icons are monochrome silhouettes)
      if (!emblem.heraldic) icon.setAttribute('fill', emblem.fg || '#ffffff');
      g.appendChild(icon);
    }
  }

  // Hitbox for interaction
  const hitbox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  hitbox.setAttribute('x', -half); hitbox.setAttribute('y', -half);
  hitbox.setAttribute('width', sz); hitbox.setAttribute('height', sz);
  hitbox.setAttribute('fill', 'transparent');
  hitbox.setAttribute('stroke', selected ? '#d4a832' : 'transparent');
  hitbox.setAttribute('stroke-width', '2');
  hitbox.setAttribute('stroke-dasharray', selected ? '4 2' : 'none');
  hitbox.classList.add('emblem-hitbox');
  g.appendChild(hitbox);

  svgEl.appendChild(g);
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
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${shape.w} ${shape.h}`);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  if (shape.clip) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `<clipPath id="thumb-clip"><polygon points="${shape.clip}"/></clipPath>`;
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
  return svg;
}

// ---- Text emblem rendering ----
function _renderTextContent(g, emblem, sz) {
  const fontSize = Math.max(8, sz * 0.7);
  const font     = emblem.fontFamily || 'Bebas Neue';
  const fill     = emblem.fg || '#ffffff';
  const arc      = emblem.textArc || 0;

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

    const tPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    tPath.setAttribute('href', `#${pathId}`);
    tPath.setAttribute('startOffset', '50%');
    tPath.setAttribute('text-anchor', 'middle');
    tPath.textContent = emblem.text || '';
    textEl.appendChild(tPath);
    g.appendChild(textEl);
  }
}
