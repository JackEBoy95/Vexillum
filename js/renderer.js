// ============================================================
// VEXILLUM — SVG Renderer
// All flag layers are rendered as SVG elements
// ============================================================

const CANVAS_W = 480;
const CANVAS_H = 320;

// ---- Overlay shape renderers ----
// Each returns an SVG path/shape string that fills the flag canvas.
// All shapes accept: color, color2, opacity, params

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
};

// ---- Main render function ----
// Writes into an existing <svg> element.
// emblems: array of Emblem objects (rendered by emblem layer separately)

function renderFlag(svgEl, design, selectedEmblemId = null) {
  // Clear existing rendered content (not defs)
  const existing = svgEl.querySelectorAll('.render-layer, .render-emblem');
  existing.forEach(el => el.remove());

  // Render layers bottom to top
  design.layers.forEach(layer => {
    if (!layer.visible) return;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('render-layer');
    g.dataset.layerId = layer.id;
    g.innerHTML = renderLayer(layer);
    svgEl.appendChild(g);
  });

  // Render emblems
  design.emblems.forEach(emblem => {
    renderEmblemEl(svgEl, emblem, emblem.id === selectedEmblemId);
  });
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

function makeThumbnail(design) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${CANVAS_W} ${CANVAS_H}`);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  design.layers.forEach(layer => {
    if (!layer.visible) return;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = renderLayer(layer);
    svg.appendChild(g);
  });
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
