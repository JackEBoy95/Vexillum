// ============================================================
// VEXILLUM — Main Application
// ============================================================

// ---- State ----
let design = newDesign();
let selectedEmblemId = null;
let draggingEmblemId = null;
let dragOffsetX = 0, dragOffsetY = 0;
let dragLayerId = null;
let dragLayerOriginY = 0;

// ---- Global colour picker state ----
let _activePopover = null;
function _closeAllPopovers() {
  if (_activePopover) { _activePopover.classList.add('hidden'); _activePopover = null; }
}
document.addEventListener('click', _closeAllPopovers);

// ---- Colour utilities for Wix-style shade picker ----
function _hexToHsl(hex) {
  let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max+min)/2;
  if (max===min) { h=s=0; } else {
    const d = max-min;
    s = l>0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){ case r: h=((g-b)/d+(g<b?6:0))/6; break; case g: h=((b-r)/d+2)/6; break; case b: h=((r-g)/d+4)/6; break; }
  }
  return [h*360, s*100, l*100];
}
function _hslToHex(h,s,l) {
  s/=100; l/=100;
  const a = s*Math.min(l,1-l);
  function f(n){ const k=(n+h/30)%12; return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1)))).toString(16).padStart(2,'0'); }
  return `#${f(0)}${f(8)}${f(4)}`;
}
function _generateShades(hex) {
  // Ensure hex is 6-digit
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return [hex,hex,hex,hex,hex];
  const [h,s,l] = _hexToHsl(hex);
  return [
    _hslToHex(h, Math.max(s*0.25, 4), Math.min(l+45, 95)),
    _hslToHex(h, Math.max(s*0.55, 8), Math.min(l+25, 88)),
    hex,
    _hslToHex(h, Math.min(s*1.1, 100), Math.max(l-22, 8)),
    _hslToHex(h, Math.min(s*1.2, 100), Math.max(l-42, 4)),
  ];
}
const _NEUTRALS = ['#FFFFFF','#C8C8C8','#888888','#3C3C3C','#000000'];

function newDesign() {
  return {
    id: uuid(),
    name: 'Untitled Flag',
    canvasRatio: '3:2',
    layers: [
      {
        id: uuid(),
        type: 'hstripes',
        visible: true,
        expanded: false,
        bands: [
          { color: '#c0392b', weight: 1 },
          { color: '#ffffff', weight: 1 },
          { color: '#2c3e50', weight: 1 },
        ]
      }
    ],
    emblems: [],
  };
}

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---- DOM refs ----
const flagSvg        = document.getElementById('flag-svg');
const layerList      = document.getElementById('layer-list');
const designNameEl   = document.getElementById('design-name');
const emblemControls = document.getElementById('emblem-controls');
const iconGrid       = document.getElementById('icon-grid');
const iconSearch     = document.getElementById('icon-search');
const toast          = document.getElementById('toast');
const saveModal      = document.getElementById('save-modal');

// ---- Boot ----
document.addEventListener('DOMContentLoaded', () => {
  designNameEl.value = design.name;

  // Restore auto-saved design if available
  try {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.layers) {
        design = { ...parsed, emblems: parsed.emblems || [] };
        if (parsed.flagShape) design.flagShape = parsed.flagShape;
        designNameEl.value = design.name;
        // Re-fetch heraldic SVGs
        design.emblems.forEach(em => {
          if (em.heraldic && em.heraldCat && em.heraldSlug) {
            fetchHeraldicSvg(em.heraldCat, em.heraldSlug).then(svg => {
              em._svgContent = svg;
              if (svg && !em.heraldColours) {
                const colours = extractHeraldicColours(svg);
                em.heraldColours = {};
                colours.forEach(c => { em.heraldColours[c] = c; });
              }
              renderAll();
            });
          } else {
            em._svgContent = getIconSvg(em.slug);
          }
        });
      }
    }
  } catch(e) {}

  bindHeaderButtons();
  bindIconPanel();
  bindCanvasEvents();
  bindKeyboard();
  renderAll();
  loadShapesGrid(); // default panel view
});

// ---- Full render cycle ----
function renderAll() {
  renderFlag(flagSvg, design, selectedEmblemId);
  renderLayerList();
  updateEmblemControls();
}

// ============================================================
// LAYER LIST
// ============================================================

function renderLayerList() {
  layerList.innerHTML = '';

  // ---- Emblem section ----
  if (design.emblems.length > 0) {
    const sec = document.createElement('div');
    sec.className = 'layer-section';
    const secTitle = document.createElement('div');
    secTitle.className = 'layer-section-title';
    secTitle.textContent = 'Icons';
    sec.appendChild(secTitle);
    // Reverse so last placed = top of list
    [...design.emblems].reverse().forEach(emblem => {
      const row = buildEmblemRow(emblem);
      sec.appendChild(row);
    });
    layerList.appendChild(sec);
  }

  // ---- Layer section ----
  const layers = [...design.layers].reverse();
  layers.forEach(layer => {
    const card = buildLayerCard(layer);
    layerList.appendChild(card);
  });
}

function buildEmblemRow(emblem) {
  const row = document.createElement('div');
  row.className = 'emblem-row' + (emblem.id === selectedEmblemId ? ' selected' : '');
  row.dataset.emblemId = emblem.id;

  // Mini preview
  const preview = document.createElement('div');
  preview.className = 'emblem-row-preview';
  if (emblem.type === 'shape' && BASIC_SHAPES[emblem.shapeKey]) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('fill', emblem.fg || '#1C1C1C');
    svg.style.cssText = 'width:100%;height:100%;display:block;';
    svg.innerHTML = BASIC_SHAPES[emblem.shapeKey].path;
    preview.appendChild(svg);
  } else if (emblem._svgContent) {
    const div = document.createElement('div');
    div.innerHTML = emblem._svgContent;
    const svg = div.querySelector('svg');
    if (svg) {
      const w = svg.getAttribute('width') || '400';
      const h = svg.getAttribute('height') || '420';
      if (!svg.getAttribute('viewBox')) svg.setAttribute('viewBox', `0 0 ${parseFloat(w)} ${parseFloat(h)}`);
      svg.removeAttribute('width'); svg.removeAttribute('height');
      svg.style.cssText = 'width:100%;height:100%;display:block;';
      preview.appendChild(svg);
    }
  }

  // Label
  const lbl = document.createElement('span');
  lbl.className = 'emblem-row-label';
  lbl.textContent = emblem.label || 'Icon';

  // Visibility toggle
  const visBtn = document.createElement('button');
  visBtn.className = 'icon-btn';
  visBtn.title = emblem.hidden ? 'Show' : 'Hide';
  visBtn.innerHTML = emblem.hidden
    ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  visBtn.addEventListener('click', e => {
    e.stopPropagation();
    emblem.hidden = !emblem.hidden;
    renderAll();
  });

  // Delete
  const delBtn = document.createElement('button');
  delBtn.className = 'icon-btn';
  delBtn.title = 'Remove icon';
  delBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>`;
  delBtn.addEventListener('click', e => {
    e.stopPropagation();
    design.emblems = design.emblems.filter(em => em.id !== emblem.id);
    if (selectedEmblemId === emblem.id) selectEmblem(null);
    else renderAll();
  });

  // Drag handle (insert at beginning)
  const dragHandle = document.createElement('span');
  dragHandle.className = 'layer-drag';
  dragHandle.title = 'Drag to reorder';
  dragHandle.innerHTML = `<svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor"><circle cx="3" cy="2" r="1.5"/><circle cx="7" cy="2" r="1.5"/><circle cx="3" cy="7" r="1.5"/><circle cx="7" cy="7" r="1.5"/><circle cx="3" cy="12" r="1.5"/><circle cx="7" cy="12" r="1.5"/></svg>`;
  dragHandle.addEventListener('mousedown', e => startEmblemRowDrag(e, emblem.id));

  row.appendChild(dragHandle);
  row.appendChild(preview);
  row.appendChild(lbl);
  row.appendChild(visBtn);
  row.appendChild(delBtn);
  row.addEventListener('click', () => selectEmblem(emblem.id));
  return row;
}

function buildLayerCard(layer) {
  const card = document.createElement('div');
  card.className = 'layer-card' + (layer.expanded ? ' expanded' : '') + (!layer.visible ? ' hidden' : '');
  card.dataset.layerId = layer.id;

  const header = document.createElement('div');
  header.className = 'layer-header';

  // Drag handle
  const drag = document.createElement('span');
  drag.className = 'layer-drag';
  drag.title = 'Drag to reorder';
  drag.innerHTML = `<svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
    <circle cx="3" cy="3" r="1.5"/><circle cx="7" cy="3" r="1.5"/>
    <circle cx="3" cy="8" r="1.5"/><circle cx="7" cy="8" r="1.5"/>
    <circle cx="3" cy="13" r="1.5"/><circle cx="7" cy="13" r="1.5"/>
  </svg>`;
  drag.addEventListener('mousedown', e => startLayerDrag(e, layer.id));

  // Thumbnail
  const thumb = document.createElement('div');
  thumb.className = 'layer-thumb';
  const thumbSvg = makeThumbnail({ layers: [layer], emblems: [] });
  thumb.appendChild(thumbSvg);

  // Label
  const label = document.createElement('span');
  label.className = 'layer-label';
  label.textContent = layerLabel(layer);

  // Visibility
  const vis = document.createElement('button');
  vis.className = 'icon-btn layer-vis';
  vis.title = layer.visible ? 'Hide layer' : 'Show layer';
  vis.innerHTML = layer.visible
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  vis.addEventListener('click', e => { e.stopPropagation(); toggleLayerVisible(layer.id); });

  header.appendChild(drag);
  header.appendChild(thumb);
  header.appendChild(label);
  header.appendChild(vis);
  header.addEventListener('click', () => toggleLayerExpanded(layer.id));

  // Body
  const body = document.createElement('div');
  body.className = 'layer-body';
  body.appendChild(buildLayerBody(layer));

  // Delete
  const delBtn = document.createElement('button');
  delBtn.className = 'layer-delete';
  delBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg> Remove layer`;
  delBtn.addEventListener('click', () => deleteLayer(layer.id));
  body.appendChild(delBtn);

  card.appendChild(header);
  card.appendChild(body);
  return card;
}

function layerLabel(layer) {
  if (layer.type === 'hstripes') return `Horizontal Stripes (${layer.bands.length})`;
  if (layer.type === 'vstripes') return `Vertical Stripes (${layer.bands.length})`;
  if (layer.type === 'overlay')  {
    const name = SHAPES[layer.shape]?.label || 'Overlay';
    return name;
  }
  return 'Layer';
}

function buildLayerBody(layer) {
  const frag = document.createDocumentFragment();
  if (layer.type === 'hstripes' || layer.type === 'vstripes') {
    frag.appendChild(buildStripesBody(layer));
  } else if (layer.type === 'overlay') {
    frag.appendChild(buildOverlayBody(layer));
  }
  return frag;
}

// ---- Colour picker component ----
// Returns a swatch button that opens a Wix-style shade picker popover.
function buildColorPicker(initialValue, onChangeCallback) {
  const wrap = document.createElement('div');
  wrap.className = 'cp-wrap';

  const swatch = document.createElement('button');
  swatch.className = 'cp-swatch';
  swatch.style.background = initialValue;
  swatch.type = 'button';
  swatch.title = 'Choose colour';

  const popover = document.createElement('div');
  popover.className = 'cp-popover hidden';

  let _currentHex = initialValue;

  function _pick(hex) {
    _currentHex = hex;
    swatch.style.background = hex;
    nativeSwatch.style.background = hex;
    native.value = hex;
    // Update selected state on all chips
    popover.querySelectorAll('[data-hex]').forEach(c => {
      c.classList.toggle('selected', c.dataset.hex.toLowerCase() === hex.toLowerCase());
    });
    onChangeCallback(hex);
  }

  // Build shade grid — rebuilt on open in case palette changed
  const shadeGrid = document.createElement('div');
  shadeGrid.className = 'cp-shade-grid';

  function buildShadeGrid() {
    shadeGrid.innerHTML = '';
    const palette = getActivePalette();
    // Get 5 base colours from palette.bases or first 5 colours
    const bases = palette.bases || palette.colors.slice(0,5).map(c=>c.hex);
    bases.slice(0,5).forEach(baseHex => {
      const col = document.createElement('div');
      col.className = 'cp-shade-col';
      _generateShades(baseHex).forEach(shade => {
        const chip = document.createElement('button');
        chip.className = 'cp-shade-chip' + (shade.toLowerCase() === _currentHex.toLowerCase() ? ' selected' : '');
        chip.dataset.hex = shade;
        chip.style.background = shade;
        chip.type = 'button';
        chip.title = shade;
        chip.addEventListener('click', e => { e.stopPropagation(); _pick(shade); _closeAllPopovers(); });
        col.appendChild(chip);
      });
      shadeGrid.appendChild(col);
    });
  }
  buildShadeGrid();

  // Neutrals row
  const neutralRow = document.createElement('div');
  neutralRow.className = 'cp-neutral-row';
  _NEUTRALS.forEach(hex => {
    const chip = document.createElement('button');
    chip.className = 'cp-neutral-chip' + (hex.toLowerCase() === _currentHex.toLowerCase() ? ' selected' : '');
    chip.dataset.hex = hex;
    chip.style.background = hex;
    chip.type = 'button';
    chip.title = hex;
    chip.addEventListener('click', e => { e.stopPropagation(); _pick(hex); _closeAllPopovers(); });
    neutralRow.appendChild(chip);
  });

  // Custom colour row
  const customRow = document.createElement('div');
  customRow.className = 'cp-custom-row';
  const customLabel = document.createElement('span');
  customLabel.className = 'cp-custom-label';
  customLabel.textContent = 'Custom';
  const nativeWrap = document.createElement('div');
  nativeWrap.className = 'cp-native-wrap';
  const nativeSwatch = document.createElement('div');
  nativeSwatch.className = 'cp-native-swatch';
  nativeSwatch.style.background = initialValue;
  const native = document.createElement('input');
  native.type = 'color';
  native.className = 'cp-native';
  native.value = initialValue;
  native.addEventListener('input', e => { _pick(e.target.value); });
  native.addEventListener('click', e => e.stopPropagation());
  nativeWrap.appendChild(nativeSwatch);
  nativeWrap.appendChild(native);
  customRow.appendChild(customLabel);
  customRow.appendChild(nativeWrap);

  popover.appendChild(shadeGrid);
  popover.appendChild(neutralRow);
  popover.appendChild(customRow);
  document.body.appendChild(popover);

  swatch.addEventListener('click', e => {
    e.stopPropagation();
    if (_activePopover === popover) { _closeAllPopovers(); return; }
    _closeAllPopovers();
    buildShadeGrid(); // refresh in case palette changed
    const r = swatch.getBoundingClientRect();
    let left = r.left, top = r.bottom + 6;
    if (left + 220 > window.innerWidth) left = window.innerWidth - 228;
    if (top + 260 > window.innerHeight) top = r.top - 266;
    popover.style.left = left + 'px';
    popover.style.top  = top  + 'px';
    popover.classList.remove('hidden');
    _activePopover = popover;
  });

  wrap.appendChild(swatch);
  return wrap;
}

// ---- Stripes body ----
function buildStripesBody(layer) {
  const wrap = document.createElement('div');
  const bandsList = document.createElement('div');
  bandsList.className = 'bands-list';

  function rebuildBandRows() {
    bandsList.innerHTML = '';
    layer.bands.forEach((band, i) => {
      const row = document.createElement('div');
      row.className = 'band-row';

      const colorWrap = buildColorPicker(band.color, val => { band.color = val; onChange(); });

      const weightInput = document.createElement('input');
      weightInput.type = 'range';
      weightInput.min = 1; weightInput.max = 20; weightInput.step = 1;
      weightInput.value = band.weight;
      weightInput.title = 'Band width';
      weightInput.addEventListener('input', e => { band.weight = +e.target.value; onChange(); });

      const removeBtn = document.createElement('button');
      removeBtn.className = 'band-remove';
      removeBtn.title = 'Remove band';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        if (layer.bands.length <= 1) return;
        layer.bands.splice(i, 1);
        rebuildBandRows();
        onChange();
      });

      row.appendChild(colorWrap);
      row.appendChild(weightInput);
      row.appendChild(removeBtn);
      bandsList.appendChild(row);
    });
  }
  rebuildBandRows();

  const addBtn = document.createElement('button');
  addBtn.className = 'add-band-btn';
  addBtn.innerHTML = `+ Add band`;
  addBtn.addEventListener('click', () => {
    if (layer.bands.length >= 12) return;
    layer.bands.push({ color: '#ffffff', weight: 1 });
    rebuildBandRows();
    onChange();
  });

  wrap.appendChild(bandsList);
  wrap.appendChild(addBtn);
  return wrap;
}

// ---- Overlay body ----
function buildOverlayBody(layer) {
  const wrap = document.createElement('div');

  // Shape picker grid
  const grid = document.createElement('div');
  grid.className = 'shape-grid';
  Object.entries(SHAPES).forEach(([key, shape]) => {
    const btn = document.createElement('button');
    btn.className = 'shape-btn' + (layer.shape === key ? ' active' : '');
    btn.title = shape.label;
    btn.innerHTML = `${shapeIcon(key)}<span>${shape.label}</span>`;
    btn.addEventListener('click', () => {
      layer.shape = key;
      layer.params = {};
      onChange();
      renderLayerList(); // rebuild controls
    });
    grid.appendChild(btn);
  });
  wrap.appendChild(grid);

  // Colour controls
  const colorRow = document.createElement('div');
  colorRow.className = 'control-row';
  colorRow.innerHTML = `<span class="control-label">Colour</span>`;
  const colorWrap = buildColorPicker(layer.color || '#ffffff', val => { layer.color = val; onChange(); });
  colorRow.appendChild(colorWrap);
  wrap.appendChild(colorRow);

  // Opacity
  const opRow = document.createElement('div');
  opRow.className = 'control-row';
  const opVal = document.createElement('span');
  opVal.className = 'control-value';
  opVal.textContent = `${layer.opacity ?? 100}%`;
  opRow.innerHTML = `<span class="control-label">Opacity</span>`;
  const opInput = document.createElement('input');
  opInput.type = 'range'; opInput.min = 5; opInput.max = 100; opInput.step = 5;
  opInput.value = layer.opacity ?? 100;
  opInput.addEventListener('input', e => {
    layer.opacity = +e.target.value;
    opVal.textContent = `${layer.opacity}%`;
    onChange();
  });
  opRow.appendChild(opInput);
  opRow.appendChild(opVal);
  wrap.appendChild(opRow);

  // Shape-specific params
  if (layer.shape && SHAPES[layer.shape]) {
    const shapeDef = SHAPES[layer.shape];
    Object.entries(shapeDef.params || {}).forEach(([key, def]) => {
      const row = document.createElement('div');
      row.className = 'control-row';
      const val = document.createElement('span');
      val.className = 'control-value';
      val.textContent = layer.params?.[key] ?? def.default;
      row.innerHTML = `<span class="control-label">${def.label}</span>`;
      const input = document.createElement('input');
      input.type = 'range';
      input.min = def.min; input.max = def.max;
      input.step = def.step || 1;
      input.value = layer.params?.[key] ?? def.default;
      input.addEventListener('input', e => {
        if (!layer.params) layer.params = {};
        layer.params[key] = +e.target.value;
        val.textContent = layer.params[key];
        onChange();
      });
      row.appendChild(input);
      row.appendChild(val);
      wrap.appendChild(row);
    });
  }

  return wrap;
}

function shapeIcon(key) {
  const icons = {
    cross:    `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="10" y="2" width="4" height="20"/><rect x="2" y="10" width="20" height="4"/></svg>`,
    nordic:   `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="2" width="4" height="20"/><rect x="2" y="10" width="20" height="4"/></svg>`,
    saltire:  `<svg viewBox="0 0 24 24" fill="currentColor"><line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="4"/><line x1="22" y1="2" x2="2" y2="22" stroke="currentColor" stroke-width="4"/></svg>`,
    triangle: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="2,2 14,12 2,22"/></svg>`,
    chevron:  `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="2,2 12,12 2,22 8,22 18,12 8,2"/></svg>`,
    canton:   `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="10" height="10"/></svg>`,
    diagonal: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="2,2 22,22 2,22"/></svg>`,
    quarter:  `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="10" height="10"/><rect x="12" y="12" width="10" height="10"/></svg>`,
    hband:    `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="9" width="20" height="6"/></svg>`,
    vband:    `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="9" y="2" width="6" height="20"/></svg>`,
  };
  return icons[key] || `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="2"/></svg>`;
}

// ---- Layer mutations ----
function toggleLayerVisible(id) {
  const layer = design.layers.find(l => l.id === id);
  if (layer) { layer.visible = !layer.visible; renderAll(); }
}
function toggleLayerExpanded(id) {
  const layer = design.layers.find(l => l.id === id);
  if (layer) { layer.expanded = !layer.expanded; renderLayerList(); }
}
function deleteLayer(id) {
  design.layers = design.layers.filter(l => l.id !== id);
  renderAll();
}

function addLayer(type) {
  const layer = {
    id: uuid(), type, visible: true, expanded: true,
  };
  if (type === 'hstripes' || type === 'vstripes') {
    layer.bands = [{ color: '#d4a832', weight: 1 }, { color: '#2c3e50', weight: 1 }];
  } else {
    layer.shape = 'cross';
    layer.color = '#ffffff';
    layer.opacity = 100;
    layer.params = {};
  }
  design.layers.push(layer);
  renderAll();
}

// ---- Layer drag to reorder ----
function startLayerDrag(e, layerId) {
  dragLayerId = layerId;
  dragLayerOriginY = e.clientY;
  document.addEventListener('mousemove', onLayerDragMove);
  document.addEventListener('mouseup', onLayerDragEnd);
  e.preventDefault();
}
function onLayerDragMove(e) {
  if (!dragLayerId) return;
  const cards = [...layerList.querySelectorAll('.layer-card')];
  const idx = cards.findIndex(c => c.dataset.layerId === dragLayerId);
  if (idx === -1) return;
  const dy = e.clientY - dragLayerOriginY;
  if (Math.abs(dy) < 20) return;
  const dir = dy > 0 ? 1 : -1;
  dragLayerOriginY = e.clientY;
  // Layers list is reversed (top of list = top of visual stack = end of array)
  const arrIdx = design.layers.findIndex(l => l.id === dragLayerId);
  const newIdx = arrIdx - dir; // reversed in UI
  if (newIdx < 0 || newIdx >= design.layers.length) return;
  const [removed] = design.layers.splice(arrIdx, 1);
  design.layers.splice(newIdx, 0, removed);
  renderAll();
}
function onLayerDragEnd() {
  dragLayerId = null;
  document.removeEventListener('mousemove', onLayerDragMove);
  document.removeEventListener('mouseup', onLayerDragEnd);
}

// ---- Emblem row drag-to-reorder ----
let _dragEmblemId = null;
let _dragEmblemY  = 0;
let _copiedEmblem = null;

function startEmblemRowDrag(e, emblemId) {
  _dragEmblemId = emblemId;
  _dragEmblemY  = e.clientY;
  document.addEventListener('mousemove', _onEmblemRowMove);
  document.addEventListener('mouseup',   _onEmblemRowEnd);
  e.preventDefault();
  e.stopPropagation();
}
function _onEmblemRowMove(e) {
  if (!_dragEmblemId) return;
  const dy = e.clientY - _dragEmblemY;
  if (Math.abs(dy) < 18) return;
  const dir = dy > 0 ? 1 : -1;
  _dragEmblemY = e.clientY;
  const arrIdx = design.emblems.findIndex(em => em.id === _dragEmblemId);
  if (arrIdx === -1) return;
  // UI shows in REVERSE: drag down (dir=+1) = move toward lower z = earlier in array
  const newIdx = arrIdx - dir;
  if (newIdx < 0 || newIdx >= design.emblems.length) return;
  const [removed] = design.emblems.splice(arrIdx, 1);
  design.emblems.splice(newIdx, 0, removed);
  renderAll();
}
function _onEmblemRowEnd() {
  _dragEmblemId = null;
  document.removeEventListener('mousemove', _onEmblemRowMove);
  document.removeEventListener('mouseup',   _onEmblemRowEnd);
}

// ============================================================
// ICON PANEL
// ============================================================

let currentCategory = 'All';
let iconSearchQuery = '';
let activeHeraldCat = null; // currently selected heraldic category id

function bindIconPanel() {
  activeHeraldCat = '__shapes__'; // default to shapes on load
  buildHeraldCats();

  iconSearch.addEventListener('input', e => {
    iconSearchQuery = e.target.value.trim().toLowerCase();
    loadHeraldGrid(activeHeraldCat);
  });

  // Text add button
  const textAddBtn = document.getElementById('text-add-btn');
  const textInput  = document.getElementById('text-content');
  if (textAddBtn && textInput) {
    const doAddText = () => {
      const font = document.getElementById('text-font')?.value || 'Bebas Neue';
      placeTextEmblem(textInput.value, font, 50, 50);
      textInput.value = '';
    };
    textAddBtn.addEventListener('click', doAddText);
    textInput.addEventListener('keydown', e => { if (e.key === 'Enter') doAddText(); });
  }

  // SVG import
  const importBtn   = document.getElementById('svg-import-btn');
  const importInput = document.getElementById('svg-import-input');
  if (importBtn && importInput) {
    importBtn.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => addCustomIcon(file.name, ev.target.result);
      reader.readAsText(file);
      e.target.value = '';
    });
  }

  // Load any previously imported custom icons
  renderCustomIconSection();
}

function buildHeraldCats() {
  const catWrap = document.querySelector('.icon-categories');
  catWrap.innerHTML = '';

  // Shapes — always first
  const shapesBtn = document.createElement('button');
  shapesBtn.className = 'cat-btn' + (activeHeraldCat === '__shapes__' ? ' active' : '');
  shapesBtn.textContent = 'Shapes';
  shapesBtn.addEventListener('click', () => {
    activeHeraldCat = '__shapes__';
    catWrap.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b === shapesBtn));
    loadShapesGrid();
  });
  catWrap.appendChild(shapesBtn);

  HERALDIC_CATEGORIES.forEach(hcat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (hcat.id === activeHeraldCat ? ' active' : '');
    btn.textContent = hcat.name;
    btn.addEventListener('click', () => {
      activeHeraldCat = hcat.id;
      catWrap.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b === btn));
      loadHeraldGrid(hcat.id);
    });
    catWrap.appendChild(btn);
  });
}

function loadShapesGrid() {
  iconGrid.innerHTML = '';
  Object.entries(BASIC_SHAPES).forEach(([key, shape]) => {
    const cell = document.createElement('div');
    cell.className = 'icon-cell';
    cell.title = shape.label;
    cell.draggable = true;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('fill', '#1C1C1C');
    svg.style.cssText = 'width:100%;height:100%;pointer-events:none;display:block;';
    svg.innerHTML = shape.path;
    cell.appendChild(svg);

    const nameEl = document.createElement('span');
    nameEl.className = 'icon-cell-name';
    nameEl.textContent = shape.label;
    cell.appendChild(nameEl);

    cell.addEventListener('click', () => placeShapeEmblem(key, shape.label, 50, 50));
    cell.addEventListener('dragstart', ev => {
      ev.dataTransfer.setData('application/vexillum-shape', JSON.stringify({ key, label: shape.label }));
      ev.dataTransfer.effectAllowed = 'copy';
    });

    iconGrid.appendChild(cell);
  });
}

function loadIconGrid(category) {
  iconGrid.innerHTML = '';
  const filtered = ICON_LIST.filter(icon => {
    const matchCat = category === 'All' || icon.category === category;
    const matchSearch = !iconSearchQuery || icon.label.toLowerCase().includes(iconSearchQuery);
    return matchCat && matchSearch;
  });

  if (!filtered.length) {
    const msg = document.createElement('div');
    msg.style.cssText = 'grid-column: 1/-1; text-align:center; color:var(--text-dim); font-size:12px; padding: 20px;';
    msg.textContent = 'Nothing found — try a shorter search';
    iconGrid.appendChild(msg);
    return;
  }

  // Render in batches so the UI doesn't freeze on large category loads
  const BATCH = 30;
  let i = 0;
  function renderBatch() {
    const end = Math.min(i + BATCH, filtered.length);
    for (; i < end; i++) {
      const icon = filtered[i];
      const svgStr = getIconSvg(icon.slug);

      const cell = document.createElement('div');
      cell.className = 'icon-cell';
      cell.title = icon.label;
      cell.draggable = true;
      cell.dataset.slug = icon.slug;

      if (svgStr) {
        const coloured = colourIcon(svgStr, '#1C1C1C', 'transparent');
        const wrap = document.createElement('div');
        wrap.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;';
        wrap.innerHTML = coloured;
        const innerSvg = wrap.querySelector('svg');
        if (innerSvg) innerSvg.style.cssText = 'width:100%;height:100%;pointer-events:none;';
        cell.appendChild(wrap);
      }

      const name = document.createElement('span');
      name.className = 'icon-cell-name';
      name.textContent = icon.label;
      cell.appendChild(name);

      cell.addEventListener('dragstart', e => {
        e.dataTransfer.setData('application/vexillum-icon', JSON.stringify({
          slug: icon.slug, label: icon.label, category: icon.category
        }));
        e.dataTransfer.effectAllowed = 'copy';
      });

      cell.addEventListener('click', () => placeEmblem(icon, 50, 50));
      iconGrid.appendChild(cell);
    }
    if (i < filtered.length) requestAnimationFrame(renderBatch);
  }
  renderBatch();
}

function loadHeraldGrid(catId) {
  iconGrid.innerHTML = '';
  const hcat = HERALDIC_CATEGORIES.find(c => c.id === catId);
  if (!hcat) return;

  let icons = hcat.icons;
  if (iconSearchQuery) {
    icons = icons.filter(slug => slug.includes(iconSearchQuery));
  }

  if (!icons.length) {
    iconGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-dim);font-size:12px;padding:20px;">Nothing found</div>';
    return;
  }

  // Show a loading indicator for uncached icons
  const BATCH = 12;
  let i = 0;
  function renderBatch() {
    const end = Math.min(i + BATCH, icons.length);
    const promises = [];
    for (; i < end; i++) {
      const slug = icons[i];
      const label = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      const cell = document.createElement('div');
      cell.className = 'icon-cell heraldic-cell';
      cell.title = label;
      cell.draggable = true;
      cell.dataset.slug = slug;
      cell.dataset.heraldCat = catId;

      const wrap = document.createElement('div');
      wrap.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;';
      cell.appendChild(wrap);

      const name = document.createElement('span');
      name.className = 'icon-cell-name';
      name.textContent = label;
      cell.appendChild(name);

      // Fetch SVG and inject
      const p = fetchHeraldicSvg(catId, slug).then(svgStr => {
        if (svgStr) {
          wrap.innerHTML = svgStr;
          const innerSvg = wrap.querySelector('svg');
          if (innerSvg) {
            const w = innerSvg.getAttribute('width') || '400';
            const h = innerSvg.getAttribute('height') || '420';
            if (!innerSvg.getAttribute('viewBox')) {
              innerSvg.setAttribute('viewBox', `0 0 ${parseFloat(w)} ${parseFloat(h)}`);
            }
            innerSvg.removeAttribute('width');
            innerSvg.removeAttribute('height');
            innerSvg.style.cssText = 'width:100%;height:100%;pointer-events:none;display:block;overflow:visible;';
          }
        }
      });
      promises.push(p);

      cell.addEventListener('dragstart', ev => {
        ev.dataTransfer.setData('application/vexillum-heraldic', JSON.stringify({
          slug, label, category: catId, heraldic: true
        }));
        ev.dataTransfer.effectAllowed = 'copy';
      });

      cell.addEventListener('click', () => placeHeraldicEmblem(slug, label, catId, 50, 50));
      iconGrid.appendChild(cell);
    }
    if (i < icons.length) requestAnimationFrame(renderBatch);
  }
  renderBatch();
}

// ---- Snap guide overlay ----
let _snapGuideGroup = null;
function _getGuideGroup() {
  if (!_snapGuideGroup || !_snapGuideGroup.isConnected) {
    _snapGuideGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    _snapGuideGroup.id = 'snap-guides';
    _snapGuideGroup.style.pointerEvents = 'none';
  }
  // Always ensure it's last child (on top)
  if (_snapGuideGroup.parentNode !== flagSvg) flagSvg.appendChild(_snapGuideGroup);
  else flagSvg.removeChild(_snapGuideGroup), flagSvg.appendChild(_snapGuideGroup);
  return _snapGuideGroup;
}
function clearSnapGuides() {
  if (_snapGuideGroup) _snapGuideGroup.innerHTML = '';
}
function _guideLine(x1, y1, x2, y2) {
  const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  l.setAttribute('x1', x1); l.setAttribute('y1', y1);
  l.setAttribute('x2', x2); l.setAttribute('y2', y2);
  l.setAttribute('stroke', '#FF6B35');
  l.setAttribute('stroke-width', '0.75');
  l.setAttribute('stroke-dasharray', '4 3');
  return l;
}
function snapToTargets(val, targets, threshold = 2.5) {
  for (const t of targets) {
    if (Math.abs(val - t) < threshold) return { v: t, hit: true };
  }
  return { v: val, hit: false };
}

// ============================================================
// CANVAS EVENTS — Emblem drag drop & selection
// ============================================================

function bindCanvasEvents() {
  const canvasArea = document.getElementById('canvas-area');

  // Drop from icon panel
  canvasArea.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    canvasArea.classList.add('drag-over');
  });
  canvasArea.addEventListener('dragleave', () => canvasArea.classList.remove('drag-over'));
  canvasArea.addEventListener('drop', e => {
    e.preventDefault();
    canvasArea.classList.remove('drag-over');
    const rect = flagSvg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const heraldicData = e.dataTransfer.getData('application/vexillum-heraldic');
    if (heraldicData) {
      const icon = JSON.parse(heraldicData);
      placeHeraldicEmblem(icon.slug, icon.label, icon.category, x, y);
      return;
    }
    const customData = e.dataTransfer.getData('application/vexillum-custom');
    if (customData) {
      const icon = JSON.parse(customData);
      const emblem = {
        id: uuid(), slug: `custom:${icon.id}`, label: icon.name, category: 'Custom',
        x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)),
        size: 20, rotate: 0, flipX: false, flipY: false,
        fg: '#ffffff', bg: 'transparent', _svgContent: icon.svg,
      };
      design.emblems.push(emblem);
      selectEmblem(emblem.id);
      renderAll();
      return;
    }
    const shapeData = e.dataTransfer.getData('application/vexillum-shape');
    if (shapeData) {
      const { key, label } = JSON.parse(shapeData);
      placeShapeEmblem(key, label, x, y);
      return;
    }
    const iconData = e.dataTransfer.getData('application/vexillum-icon');
    if (iconData) {
      placeEmblem(JSON.parse(iconData), x, y);
    }
  });

  // Click / mousedown on canvas
  flagSvg.addEventListener('mousedown', e => {
    const emblemEl = e.target.closest('[data-emblem-id]');
    if (emblemEl) {
      const id = emblemEl.dataset.emblemId;
      selectEmblem(id);
      startEmblemDrag(e, id);
    } else {
      selectEmblem(null);
    }
  });
}

function placeEmblem(icon, x, y) {
  const emblem = {
    id: uuid(),
    slug: icon.slug,
    label: icon.label,
    category: icon.category,
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
    size: 20,
    rotate: 0,
    fg: '#ffffff',
    bg: 'transparent',
    _svgContent: getIconSvg(icon.slug),
  };
  design.emblems.push(emblem);
  selectEmblem(emblem.id);
  renderAll();
}

// ---- Heraldic colour utilities ----
// Extract up to 4 unique non-black fill colours from an SVG string
function extractHeraldicColours(svgStr) {
  const seen = new Set();
  const re = /fill\s*:\s*(#[0-9a-fA-F]{3,8})/gi;
  let m;
  const EXCLUDE = new Set(['#000000','#000','#1c1c1c','#ffffff','#fff','#eeeeee','#eee','#f0f0f0','#fefefe','#fdfdfd']);
  while ((m = re.exec(svgStr)) !== null) {
    let c = m[1].toLowerCase();
    if (c.length === 4) c = '#' + c[1]+c[1]+c[2]+c[2]+c[3]+c[3];
    if (!EXCLUDE.has(c)) seen.add(c);
  }
  return [...seen].slice(0, 5);
}

// Apply a colour remap {originalHex: newHex} to an SVG string
function applyHeraldicColourMap(svgStr, colourMap) {
  if (!colourMap || !Object.keys(colourMap).length) return svgStr;
  let result = svgStr;
  for (const [from, to] of Object.entries(colourMap)) {
    // Replace all occurrences in style="fill:..." and fill="..." attributes
    result = result.replaceAll(`fill:${from}`, `fill:${to}`);
    result = result.replaceAll(`fill:${from.toUpperCase()}`, `fill:${to}`);
    result = result.replaceAll(`fill="${from}"`, `fill="${to}"`);
  }
  return result;
}

async function placeHeraldicEmblem(slug, label, catId, x, y) {
  const svgContent = await fetchHeraldicSvg(catId, slug);
  if (!svgContent) { showToast('Could not load heraldic icon — check your connection'); return; }
  // Build initial colour map (identity — original colours unchanged)
  const colours = extractHeraldicColours(svgContent);
  const heraldColours = {};
  colours.forEach(c => { heraldColours[c] = c; });
  const emblem = {
    id: uuid(),
    slug: `heraldic:${catId}/${slug}`,
    label,
    category: 'Heraldic',
    heraldic: true,
    heraldCat: catId,
    heraldSlug: slug,
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
    size: 20,
    rotate: 0,
    flipX: false,
    flipY: false,
    fg: '#ffffff',
    bg: 'transparent',
    heraldColours,
    _svgContent: svgContent,
  };
  design.emblems.push(emblem);
  selectEmblem(emblem.id);
  renderAll();
}

function placeTextEmblem(text, fontFamily, x, y) {
  if (!text.trim()) return;
  const emblem = {
    id: uuid(),
    type: 'text',
    text: text.trim(),
    fontFamily: fontFamily || 'Bebas Neue',
    label: `"${text.trim().slice(0, 12)}"`,
    category: 'Text',
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
    size: 18,
    rotate: 0,
    flipX: false,
    flipY: false,
    fg: '#ffffff',
    bg: 'transparent',
    textArc: 0,
    _svgContent: null,
  };
  design.emblems.push(emblem);
  selectEmblem(emblem.id);
  renderAll();
}

function placeShapeEmblem(shapeKey, label, x, y) {
  const emblem = {
    id: uuid(),
    type: 'shape',
    shapeKey,
    label,
    category: 'Shape',
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
    size: 20,
    rotate: 0,
    flipX: false,
    flipY: false,
    fg: '#ffffff',
    bg: 'transparent',
    _svgContent: null,
  };
  design.emblems.push(emblem);
  selectEmblem(emblem.id);
  renderAll();
}

// ---- Custom SVG import ----
const CUSTOM_ICONS_KEY = 'vexillum_custom_icons';

function getCustomIcons() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_ICONS_KEY) || '[]'); }
  catch { return []; }
}

function saveCustomIcons(icons) {
  localStorage.setItem(CUSTOM_ICONS_KEY, JSON.stringify(icons));
}

function addCustomIcon(name, svgStr) {
  // Clean up the SVG: strip Inkscape/Sodipodi metadata, keep just the SVG element
  const div = document.createElement('div');
  div.innerHTML = svgStr;
  const svg = div.querySelector('svg');
  if (!svg) { showToast('Invalid SVG file', 'error'); return; }
  // Remove inkscape/sodipodi namespace elements
  svg.querySelectorAll('sodipodi\\:namedview, defs metadata').forEach(el => el.remove());
  const cleanSvg = svg.outerHTML;

  const icons = getCustomIcons();
  const icon = { id: uuid(), name: name.replace(/\.svg$/i, ''), svg: cleanSvg, addedAt: Date.now() };
  icons.unshift(icon);
  if (icons.length > 30) icons.pop();
  saveCustomIcons(icons);
  showToast(`"${icon.name}" imported`, 'success');
  renderCustomIconSection();
}

function renderCustomIconSection() {
  const existing = document.getElementById('custom-icon-section');
  if (existing) existing.remove();
  const icons = getCustomIcons();
  if (!icons.length) return;

  const section = document.createElement('div');
  section.id = 'custom-icon-section';
  section.style.cssText = 'padding:0 8px 6px;border-bottom:1px solid rgba(28,28,28,0.2);margin-bottom:4px;';

  const title = document.createElement('div');
  title.style.cssText = 'font-size:10px;font-weight:700;opacity:0.5;text-transform:uppercase;letter-spacing:0.08em;padding:4px 2px 4px;';
  title.textContent = 'Custom';
  section.appendChild(title);

  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:5px;';

  icons.forEach(icon => {
    const cell = document.createElement('div');
    cell.className = 'icon-cell';
    cell.title = icon.name;
    cell.draggable = true;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;';
    wrap.innerHTML = icon.svg;
    const innerSvg = wrap.querySelector('svg');
    if (innerSvg) {
      const w = innerSvg.getAttribute('width') || '100';
      const h = innerSvg.getAttribute('height') || '100';
      if (!innerSvg.getAttribute('viewBox')) innerSvg.setAttribute('viewBox', `0 0 ${parseFloat(w)} ${parseFloat(h)}`);
      innerSvg.removeAttribute('width'); innerSvg.removeAttribute('height');
      innerSvg.style.cssText = 'width:100%;height:100%;pointer-events:none;display:block;';
    }
    cell.appendChild(wrap);
    const nameEl = document.createElement('span');
    nameEl.className = 'icon-cell-name';
    nameEl.textContent = icon.name;
    cell.appendChild(nameEl);

    cell.addEventListener('click', () => {
      const emblem = {
        id: uuid(), slug: `custom:${icon.id}`, label: icon.name, category: 'Custom',
        x: 50, y: 50, size: 20, rotate: 0, flipX: false, flipY: false,
        fg: '#ffffff', bg: 'transparent', _svgContent: icon.svg,
      };
      design.emblems.push(emblem);
      selectEmblem(emblem.id);
      renderAll();
    });

    cell.addEventListener('dragstart', ev => {
      ev.dataTransfer.setData('application/vexillum-custom', JSON.stringify({
        id: icon.id, name: icon.name, svg: icon.svg
      }));
      ev.dataTransfer.effectAllowed = 'copy';
    });

    grid.appendChild(cell);
  });
  section.appendChild(grid);

  // Insert before the search input
  const searchInput = document.getElementById('icon-search');
  searchInput.parentNode.insertBefore(section, searchInput);
}

function selectEmblem(id) {
  selectedEmblemId = id;
  renderAll();
}

function startEmblemDrag(e, id) {
  const emblem = design.emblems.find(em => em.id === id);
  if (!emblem) return;
  draggingEmblemId = id;
  const rect = flagSvg.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left - (emblem.x / 100 * rect.width);
  dragOffsetY = e.clientY - rect.top - (emblem.y / 100 * rect.height);

  document.addEventListener('mousemove', onEmblemDragMove);
  document.addEventListener('mouseup', onEmblemDragEnd);
  e.preventDefault();
}

function onEmblemDragMove(e) {
  if (!draggingEmblemId) return;
  const emblem = design.emblems.find(em => em.id === draggingEmblemId);
  if (!emblem) return;
  const rect = flagSvg.getBoundingClientRect();
  let x = ((e.clientX - rect.left - dragOffsetX) / rect.width) * 100;
  let y = ((e.clientY - rect.top - dragOffsetY) / rect.height) * 100;

  // Snap targets: grid points + centre + other emblem positions
  const others = design.emblems.filter(em => em.id !== draggingEmblemId);
  const targetsX = [0, 16.7, 25, 33.3, 50, 66.6, 75, 83.3, 100, ...others.map(em => em.x)];
  const targetsY = [0, 16.7, 25, 33.3, 50, 66.6, 75, 83.3, 100, ...others.map(em => em.y)];

  const rx = snapToTargets(x, targetsX);
  const ry = snapToTargets(y, targetsY);
  x = Math.max(0, Math.min(100, rx.v));
  y = Math.max(0, Math.min(100, ry.v));

  emblem.x = x;
  emblem.y = y;

  // Draw snap guides
  const g = _getGuideGroup();
  g.innerHTML = '';
  if (rx.hit) {
    const px = rx.v / 100 * CANVAS_W;
    g.appendChild(_guideLine(px, 0, px, CANVAS_H));
  }
  if (ry.hit) {
    const py = ry.v / 100 * 320;
    g.appendChild(_guideLine(0, py, CANVAS_W, py));
  }
  // Show centre crosshair label at exact centre
  if (rx.hit && Math.abs(rx.v - 50) < 0.1 && ry.hit && Math.abs(ry.v - 50) < 0.1) {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', CANVAS_W/2); dot.setAttribute('cy', CANVAS_H/2);
    dot.setAttribute('r', 3); dot.setAttribute('fill', '#FF6B35');
    g.appendChild(dot);
  }

  // Re-render emblems only (fast path)
  const existing = flagSvg.querySelectorAll('.render-emblem');
  existing.forEach(el => el.remove());
  design.emblems.forEach(em => renderEmblemEl(flagSvg, em, em.id === selectedEmblemId));
  // Ensure guides stay on top
  flagSvg.removeChild(g); flagSvg.appendChild(g);
  updateEmblemControls();
}

function snap(val, targets, threshold = 3) {
  for (const t of targets) {
    if (Math.abs(val - t) < threshold) return t;
  }
  return val;
}

function onEmblemDragEnd() {
  clearSnapGuides();
  draggingEmblemId = null;
  document.removeEventListener('mousemove', onEmblemDragMove);
  document.removeEventListener('mouseup', onEmblemDragEnd);
  onChange();
}

// ---- Emblem controls bar ----
function updateEmblemControls() {
  const emblem = design.emblems.find(em => em.id === selectedEmblemId);
  if (!emblem) { emblemControls.classList.remove('visible'); return; }
  emblemControls.classList.add('visible');

  const sizeEl = document.getElementById('ec-size');
  const rotEl  = document.getElementById('ec-rotate');
  sizeEl.value = emblem.size;
  rotEl.value  = emblem.rotate;
  document.getElementById('ec-size-val').textContent   = emblem.size + '%';
  document.getElementById('ec-rotate-val').textContent = emblem.rotate + '°';
  document.getElementById('ec-flip-h').classList.toggle('active', !!emblem.flipX);
  document.getElementById('ec-flip-v').classList.toggle('active', !!emblem.flipY);

  const isText     = emblem.type === 'text';
  const isHeraldic = !!emblem.heraldic && !isText;

  document.getElementById('ec-gameicon-controls').style.display  = (!isText && !isHeraldic) ? '' : 'none';
  document.getElementById('ec-heraldic-controls').style.display  = isHeraldic ? '' : 'none';
  document.getElementById('ec-text-controls').style.display      = isText ? '' : 'none';
  // Flip doesn't make visual sense for text; keep shown but less relevant
  document.getElementById('ec-flip-h').style.opacity = isText ? '0.4' : '1';
  document.getElementById('ec-flip-v').style.opacity = isText ? '0.4' : '1';

  if (!isText && !isHeraldic) {
    document.getElementById('ec-fg').value = emblem.fg || '#ffffff';
    document.getElementById('ec-bg').value = emblem.bg === 'transparent' ? '#000000' : (emblem.bg || '#000000');
    document.getElementById('ec-bg-transparent').checked = emblem.bg === 'transparent';
  } else if (isHeraldic) {
    buildHeraldSwatches(emblem);
  } else if (isText) {
    document.getElementById('ec-text-content').value  = emblem.text || '';
    document.getElementById('ec-text-font').value     = emblem.fontFamily || 'Bebas Neue';
    document.getElementById('ec-text-arc').value      = emblem.textArc || 0;
    document.getElementById('ec-arc-val').textContent = (emblem.textArc || 0) + '';
  }
}

function buildHeraldSwatches(emblem) {
  const container = document.getElementById('ec-herald-swatches');
  container.innerHTML = '';
  const entries = emblem.heraldColours ? Object.entries(emblem.heraldColours) : [];
  if (entries.length === 0) {
    // No tinctures extracted — show a fill override picker that replaces ALL fills
    const input = document.createElement('input');
    input.type = 'color';
    input.className = 'ec-herald-swatch';
    input.value = emblem.fillOverride || '#ffffff';
    input.title = 'Override fill colour';
    input.addEventListener('input', e => {
      emblem.fillOverride = e.target.value;
      renderAll();
    });
    container.appendChild(input);
    return;
  }
  entries.forEach(([origHex, currentHex]) => {
    const input = document.createElement('input');
    input.type = 'color';
    input.className = 'ec-herald-swatch';
    input.value = currentHex;
    input.title = `Remap ${origHex}`;
    input.addEventListener('input', e => {
      emblem.heraldColours[origHex] = e.target.value;
      renderAll();
    });
    container.appendChild(input);
  });
}

function bindEmblemControls() {
  document.getElementById('ec-size').addEventListener('input', e => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) {
      em.size = +e.target.value;
      document.getElementById('ec-size-val').textContent = em.size + '%';
      renderAll();
    }
  });
  document.getElementById('ec-rotate').addEventListener('input', e => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) {
      em.rotate = +e.target.value;
      document.getElementById('ec-rotate-val').textContent = em.rotate + '°';
      renderAll();
    }
  });
  document.getElementById('ec-flip-h').addEventListener('click', () => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) { em.flipX = !em.flipX; updateEmblemControls(); renderAll(); }
  });
  document.getElementById('ec-flip-v').addEventListener('click', () => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) { em.flipY = !em.flipY; updateEmblemControls(); renderAll(); }
  });
  document.getElementById('ec-fg').addEventListener('input', e => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) { em.fg = e.target.value; renderAll(); }
  });
  document.getElementById('ec-bg').addEventListener('input', e => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em && em.bg !== 'transparent') { em.bg = e.target.value; renderAll(); }
  });
  document.getElementById('ec-bg-transparent').addEventListener('change', e => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) { em.bg = e.target.checked ? 'transparent' : '#000000'; renderAll(); }
  });
  document.getElementById('ec-delete').addEventListener('click', () => {
    design.emblems = design.emblems.filter(em => em.id !== selectedEmblemId);
    selectEmblem(null);
  });

  const ecDupe = document.getElementById('ec-duplicate');
  if (ecDupe) {
    ecDupe.addEventListener('click', () => {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { _copiedEmblem = JSON.parse(JSON.stringify(em)); _pasteEmblem(); }
    });
  }

  // Text emblem controls
  const ecTextContent = document.getElementById('ec-text-content');
  if (ecTextContent) {
    ecTextContent.addEventListener('input', e => {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em && em.type === 'text') { em.text = e.target.value; renderAll(); }
    });
  }
  const ecTextFont = document.getElementById('ec-text-font');
  if (ecTextFont) {
    ecTextFont.addEventListener('change', e => {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em && em.type === 'text') { em.fontFamily = e.target.value; renderAll(); }
    });
  }
  const ecTextArc = document.getElementById('ec-text-arc');
  if (ecTextArc) {
    ecTextArc.addEventListener('input', e => {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em && em.type === 'text') {
        em.textArc = +e.target.value;
        document.getElementById('ec-arc-val').textContent = em.textArc;
        renderAll();
      }
    });
  }
}

// ============================================================
// HEADER BUTTONS
// ============================================================

function bindHeaderButtons() {
  designNameEl.addEventListener('change', e => { design.name = e.target.value || 'Untitled Flag'; });

  document.getElementById('btn-add-hstripes').addEventListener('click', () => addLayer('hstripes'));
  document.getElementById('btn-add-vstripes').addEventListener('click', () => addLayer('vstripes'));
  document.getElementById('btn-add-overlay').addEventListener('click',  () => addLayer('overlay'));

  document.getElementById('btn-save').addEventListener('click', saveDesign);
  document.getElementById('btn-open').addEventListener('click', openSaveModal);
  document.getElementById('btn-export-png').addEventListener('click', exportPng);
  document.getElementById('btn-export-svg').addEventListener('click', exportSvg);

  bindPaletteSelector();
  bindEmblemControls();
  bindSaveModal();
  bindPreviewModal();
  bindFlagShapePicker();
  bindDarkMode();

  // Auto-save before navigating to Inspire
  const inspireLink = document.querySelector('a.header-nav-link[href="inspire.html"]');
  if (inspireLink) {
    inspireLink.addEventListener('click', () => autoSaveCurrentDesign());
  }
}

function bindPaletteSelector() {
  const sel = document.getElementById('palette-select');
  if (!sel) return;
  // Populate options
  PALETTES.forEach((p, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = p.name;
    sel.appendChild(opt);
  });
  sel.value = activePaletteIdx;
  sel.addEventListener('change', e => {
    setActivePalette(+e.target.value);
    // Rebuild layer list so any expanded pickers refresh
    renderLayerList();
  });
}

// ============================================================
// KEYBOARD
// ============================================================

function bindKeyboard() {
  document.addEventListener('keydown', e => {
    const inInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT';
    const ctrl = e.ctrlKey || e.metaKey;

    // Copy
    if (ctrl && e.key === 'c' && selectedEmblemId && !inInput) {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { _copiedEmblem = JSON.parse(JSON.stringify(em)); showToast('Copied', ''); }
      e.preventDefault(); return;
    }
    // Paste
    if (ctrl && e.key === 'v' && _copiedEmblem && !inInput) {
      _pasteEmblem();
      e.preventDefault(); return;
    }
    // Duplicate
    if (ctrl && e.key === 'd' && selectedEmblemId && !inInput) {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { _copiedEmblem = JSON.parse(JSON.stringify(em)); _pasteEmblem(); }
      e.preventDefault(); return;
    }
    if (inInput) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEmblemId) {
      design.emblems = design.emblems.filter(em => em.id !== selectedEmblemId);
      selectEmblem(null);
    }
    if (e.key === 'Escape') selectEmblem(null);
  });
}

function _pasteEmblem() {
  if (!_copiedEmblem) return;
  const newEm = JSON.parse(JSON.stringify(_copiedEmblem));
  newEm.id = uuid();
  newEm.x  = Math.min(97, (_copiedEmblem.x || 50) + 4);
  newEm.y  = Math.min(97, (_copiedEmblem.y || 50) + 4);
  // Don't carry over transient SVG for heraldic — it'll be re-fetched
  if (newEm.heraldic && newEm.heraldCat && newEm.heraldSlug) {
    fetchHeraldicSvg(newEm.heraldCat, newEm.heraldSlug).then(svg => {
      newEm._svgContent = svg;
      renderAll();
    });
  }
  design.emblems.push(newEm);
  selectEmblem(newEm.id);
  renderAll();
}

// ============================================================
// CHANGE CALLBACK
// ============================================================

function onChange() {
  renderAll();
}

// ============================================================
// EXPORT
// ============================================================

function getSvgString(scale = 1) {
  const W = CANVAS_W * scale, H = CANVAS_H * scale;
  const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  tempSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  tempSvg.setAttribute('width', W);
  tempSvg.setAttribute('height', H);
  tempSvg.setAttribute('viewBox', `0 0 ${CANVAS_W} ${CANVAS_H}`);

  // Clip path for clean edges (shape-aware)
  const shapeId = design.flagShape || 'rect32';
  const shape = FLAG_SHAPES[shapeId] || FLAG_SHAPES.rect32;
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  if (shape.clip) {
    defs.innerHTML = `<clipPath id="flag-clip"><polygon points="${shape.clip}"/></clipPath>`;
  } else {
    defs.innerHTML = `<clipPath id="flag-clip"><rect width="${CANVAS_W}" height="${CANVAS_H}"/></clipPath>`;
  }
  tempSvg.appendChild(defs);

  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('clip-path', 'url(#flag-clip)');

  design.layers.forEach(layer => {
    if (!layer.visible) return;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    if (layer.type !== 'overlay') {
      g.setAttribute('data-layer-type', layer.type);
    } else {
      g.setAttribute('data-layer-type', 'overlay');
      g.setAttribute('data-shape', layer.shape);
    }
    g.innerHTML = renderLayer(layer);
    group.appendChild(g);
  });

  design.emblems.forEach(emblem => {
    renderEmblemEl(group, emblem, false);
  });

  tempSvg.appendChild(group);
  return new XMLSerializer().serializeToString(tempSvg);
}

function exportSvg() {
  const svgStr = getSvgString(1);
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(design.name)}.svg`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('SVG exported', 'success');
}

function exportPng() {
  const scale = 2; // 960×640
  const svgStr = getSvgString(scale);
  const W = CANVAS_W * scale, H = CANVAS_H * scale;
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${sanitizeFilename(design.name)}.png`;
    a.click();
    showToast('PNG exported', 'success');
  };
  img.src = url;
}

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-\s]/gi, '').replace(/\s+/g, '-').toLowerCase() || 'flag';
}

// ============================================================
// LOCAL STORAGE — Save / Load
// ============================================================

const STORAGE_KEY = 'vexillum_designs';
const AUTOSAVE_KEY = 'vexillum_current';
const MAX_FREE_SAVES = 3;

function getSavedDesigns() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function setSavedDesigns(designs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
}

function saveDesign() {
  design.name = designNameEl.value || 'Untitled Flag';
  design.updatedAt = Date.now();

  const saved = getSavedDesigns();
  const existing = saved.findIndex(d => d.id === design.id);

  if (existing !== -1) {
    saved[existing] = serializeDesign(design);
  } else {
    if (saved.length >= MAX_FREE_SAVES) {
      showToast(`Free tier: max ${MAX_FREE_SAVES} saved designs`, 'error');
      return;
    }
    design.createdAt = design.createdAt || Date.now();
    saved.unshift(serializeDesign(design));
  }
  setSavedDesigns(saved);
  showToast('Design saved', 'success');
}

function serializeDesign(d) {
  // Deep clone without _svgContent (transient)
  return JSON.parse(JSON.stringify({
    ...d,
    emblems: d.emblems.map(em => {
      const { _svgContent, ...rest } = em;
      return rest;
    })
  }));
}

function autoSaveCurrentDesign() {
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(serializeDesign(design)));
  } catch(e) {}
}

function loadDesign(saved) {
  design = { ...saved, emblems: saved.emblems || [] };
  // Restore inline SVG content
  const heraldicPromises = [];
  design.emblems.forEach(em => {
    if (em.heraldic && em.heraldCat && em.heraldSlug) {
      // Heraldic emblem — fetch from GitHub
      heraldicPromises.push(
        fetchHeraldicSvg(em.heraldCat, em.heraldSlug).then(svg => {
          em._svgContent = svg;
          // Init colour map if missing (older saved designs)
          if (svg && !em.heraldColours) {
            const colours = extractHeraldicColours(svg);
            em.heraldColours = {};
            colours.forEach(c => { em.heraldColours[c] = c; });
          }
        })
      );
    } else {
      em._svgContent = getIconSvg(em.slug);
    }
  });
  designNameEl.value = design.name;
  selectedEmblemId = null;
  // Render immediately with what we have, then re-render after heraldic SVGs load
  renderAll();
  if (heraldicPromises.length) {
    Promise.all(heraldicPromises).then(() => renderAll());
  }
}

// ---- Save Modal ----
function bindSaveModal() {
  document.getElementById('modal-close').addEventListener('click', closeSaveModal);
  saveModal.addEventListener('click', e => { if (e.target === saveModal) closeSaveModal(); });
}

function openSaveModal() {
  const saved = getSavedDesigns();
  const list = document.getElementById('saved-designs-list');
  list.innerHTML = '';

  if (!saved.length) {
    const msg = document.createElement('div');
    msg.className = 'no-saves-msg';
    msg.textContent = 'No saved designs yet. Press Save to save this design.';
    list.appendChild(msg);
  } else {
    saved.forEach(d => {
      const item = document.createElement('div');
      item.className = 'saved-design-item';

      const thumb = document.createElement('div');
      thumb.className = 'saved-design-thumb';
      const thumbSvg = makeThumbnail(d);
      thumb.appendChild(thumbSvg);

      const info = document.createElement('div');
      info.className = 'saved-design-info';
      info.innerHTML = `<div class="saved-design-name">${escapeHtml(d.name)}</div>
        <div class="saved-design-date">${d.updatedAt ? new Date(d.updatedAt).toLocaleDateString() : ''}</div>`;

      const delBtn = document.createElement('button');
      delBtn.className = 'saved-design-delete';
      delBtn.title = 'Delete saved design';
      delBtn.innerHTML = '×';
      delBtn.addEventListener('click', e => {
        e.stopPropagation();
        const designs = getSavedDesigns().filter(x => x.id !== d.id);
        setSavedDesigns(designs);
        openSaveModal(); // refresh
      });

      item.appendChild(thumb);
      item.appendChild(info);
      item.appendChild(delBtn);
      item.addEventListener('click', () => { loadDesign(d); closeSaveModal(); });
      list.appendChild(item);
    });
  }

  saveModal.classList.remove('hidden');
}

function closeSaveModal() {
  saveModal.classList.add('hidden');
}

function bindPreviewModal() {
  const btn   = document.getElementById('btn-preview');
  const modal = document.getElementById('preview-modal');
  const close = document.getElementById('preview-close');
  const wrap  = document.getElementById('preview-flag-wrap');
  if (!btn || !modal || !wrap) return;

  btn.addEventListener('click', () => {
    // Render at 2× scale into the modal
    const W = 720, H = 480;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', '0 0 480 320');
    svg.style.cssText = 'display:block;';

    // White base
    const base = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    base.setAttribute('width', 480); base.setAttribute('height', 320);
    base.setAttribute('fill', 'white');
    svg.appendChild(base);

    // Render layers
    design.layers.forEach(layer => {
      if (!layer.visible) return;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.innerHTML = renderLayer(layer);
      svg.appendChild(g);
    });
    // Render emblems
    design.emblems.forEach(em => renderEmblemEl(svg, em, false));

    wrap.innerHTML = '';
    wrap.appendChild(svg);
    modal.classList.remove('hidden');
  });

  close.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

  const exportBtn = document.getElementById('preview-export-png');
  if (exportBtn) exportBtn.addEventListener('click', exportPng);
}

function bindFlagShapePicker() {
  const btn = document.getElementById('btn-flag-shape');
  const pop = document.getElementById('shape-picker');
  if (!btn || !pop) return;

  // Build grid of shape options
  const grid = document.createElement('div');
  grid.className = 'shape-picker-grid';

  Object.entries(FLAG_SHAPES).forEach(([id, shape]) => {
    const b = document.createElement('button');
    b.className = 'shape-picker-btn' + ((design.flagShape || 'rect32') === id ? ' active' : '');
    b.dataset.shapeId = id;
    // Mini SVG preview
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 40 40');
    svg.setAttribute('width', '40');
    svg.setAttribute('height', '40');
    svg.setAttribute('fill', 'currentColor');
    svg.innerHTML = shape.icon;
    const lbl = document.createElement('span');
    lbl.textContent = shape.label.replace('\n', ' ');
    b.appendChild(svg);
    b.appendChild(lbl);
    b.addEventListener('click', () => {
      applyFlagShape(id);
      grid.querySelectorAll('.shape-picker-btn').forEach(x => x.classList.toggle('active', x.dataset.shapeId === id));
      pop.classList.add('hidden');
    });
    grid.appendChild(b);
  });

  const title = document.createElement('div');
  title.className = 'shape-picker-title';
  title.textContent = 'Flag Shape';
  pop.appendChild(title);
  pop.appendChild(grid);

  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (!pop.classList.contains('hidden')) { pop.classList.add('hidden'); return; }
    const r = btn.getBoundingClientRect();
    pop.style.right = (window.innerWidth - r.right) + 'px';
    pop.style.top   = (r.bottom + 6) + 'px';
    pop.style.left  = 'auto';
    pop.classList.remove('hidden');
  });

  document.addEventListener('click', e => {
    if (!pop.contains(e.target) && e.target !== btn) pop.classList.add('hidden');
  });
}

function applyFlagShape(shapeId) {
  design.flagShape = shapeId;
  renderAll();
  autoSaveCurrentDesign();
}

function bindDarkMode() {
  const btn = document.getElementById('btn-dark-mode');
  if (!btn) return;
  // Restore saved preference
  if (localStorage.getItem('vexillum_dark') === '1') {
    document.body.classList.add('dark-mode');
    btn.textContent = '☀';
    btn.title = 'Light mode';
  }
  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    btn.textContent = isDark ? '☀' : '☾';
    btn.title = isDark ? 'Light mode' : 'Dark mode';
    localStorage.setItem('vexillum_dark', isDark ? '1' : '0');
  });
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================
// TOAST
// ============================================================

let toastTimer;
function showToast(msg, type = '') {
  toast.textContent = msg;
  toast.className = 'show' + (type ? ` ${type}` : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = ''; }, 2500);
}
