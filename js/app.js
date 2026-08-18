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

// ---- Undo / Redo ----
let _history    = [];
let _histIdx    = -1;
let _histTimer  = null;
const MAX_HISTORY = 50;

// ---- Handle drag state ----
let _handleDragType    = null;
let _handleDragEmblemId = null;
let _handleStartDist   = 0;
let _handleStartSize   = 0;
let _handleStartAngle  = 0;
let _handleStartRotate = 0;
let _handleCenterX     = 0;
let _handleCenterY     = 0;

// ---- Multi-select & group drag ----
let _multiSelect = new Set();
let _prevDragX   = 0;
let _prevDragY   = 0;

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

  // Priority 1: load from shared URL hash (?#d=…)
  let loadedFromUrl = false;
  if (window.location.hash.startsWith('#d=')) {
    loadedFromUrl = _loadDesignFromUrl();
    if (loadedFromUrl) {
      designNameEl.value = design.name;
      // Clear the hash so refreshing doesn't re-load it (user may have edited since)
      history.replaceState(null, '', window.location.pathname + window.location.search);
      showToast('Shared design loaded — it\'s now yours to edit!', 'success');
    }
  }

  // Priority 2: Restore auto-saved design if no URL share
  if (!loadedFromUrl) {
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
  }

  bindHeaderButtons();
  bindIconPanel();
  bindCanvasEvents();
  bindKeyboard();
  renderAll();
  loadShapesGrid(); // default panel view
  pushHistory();    // record initial state so first undo restores it
  _updateUndoRedoBtns();
});

// ---- Full render cycle ----
function renderAll() {
  renderFlag(flagSvg, design, selectedEmblemId, _multiSelect);
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
  const isMultiSel = _multiSelect.has(emblem.id);
  const row = document.createElement('div');
  row.className = 'emblem-row'
    + (emblem.id === selectedEmblemId ? ' selected' : '')
    + (isMultiSel ? ' multi-selected' : '');
  row.dataset.emblemId = emblem.id;

  // Mini preview
  const preview = document.createElement('div');
  preview.className = 'emblem-row-preview';

  // Group: show stacked-square icon
  if (emblem.type === 'group') {
    preview.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:100%;height:100%;"><rect x="2" y="8" width="12" height="12" rx="1"/><rect x="10" y="4" width="12" height="12" rx="1"/></svg>`;
  } else if (emblem.type === 'shape' && BASIC_SHAPES[emblem.shapeKey]) {
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

  // Colour swatch (fg colour picker for non-heraldic, non-group emblems)
  if (!emblem.heraldic && emblem.type !== 'group') {
    const colorWrap = buildColorPicker(emblem.fg || '#ffffff', val => {
      emblem.fg = val;
      // Update the swatch fill in the row preview (dark bg so white shows)
      if (emblem.type === 'shape') {
        const previewSvg = preview.querySelector('svg');
        if (previewSvg) previewSvg.setAttribute('fill', val);
      }
      onChange();
    });
    colorWrap.classList.add('emblem-row-color');
    const sw = colorWrap.querySelector('.cp-swatch');
    if (sw) { sw.style.width = '18px'; sw.style.height = '18px'; sw.style.borderRadius = '3px'; }
    row.appendChild(colorWrap);
  }

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
    if (selectedEmblemId === emblem.id) selectedEmblemId = null;
    _commitChange();
  });

  // Drag handle (insert at beginning)
  const dragHandle = document.createElement('span');
  dragHandle.className = 'layer-drag';
  dragHandle.title = 'Drag to reorder';
  dragHandle.innerHTML = `<svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor"><circle cx="3" cy="2" r="1.5"/><circle cx="7" cy="2" r="1.5"/><circle cx="3" cy="7" r="1.5"/><circle cx="7" cy="7" r="1.5"/><circle cx="3" cy="12" r="1.5"/><circle cx="7" cy="12" r="1.5"/></svg>`;
  dragHandle.addEventListener('pointerdown', e => startEmblemRowDrag(e, emblem.id));

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
  card.className = 'layer-card' + (layer.expanded ? ' expanded' : '') + (!layer.visible ? ' hidden' : '') + (layer.locked ? ' locked' : '');
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
  drag.addEventListener('pointerdown', e => { if (!layer.locked) startLayerDrag(e, layer.id); });

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

  // Lock
  const lock = document.createElement('button');
  lock.className = 'icon-btn layer-lock' + (layer.locked ? ' active' : '');
  lock.title = layer.locked ? 'Unlock layer' : 'Lock layer';
  lock.innerHTML = layer.locked
    ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`
    : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>`;
  lock.addEventListener('click', e => { e.stopPropagation(); toggleLayerLocked(layer.id); });

  header.appendChild(drag);
  header.appendChild(thumb);
  header.appendChild(label);
  header.appendChild(vis);
  header.appendChild(lock);
  header.addEventListener('click', () => { if (!layer.locked) toggleLayerExpanded(layer.id); });

  // Body
  const body = document.createElement('div');
  body.className = 'layer-body';
  body.appendChild(buildLayerBody(layer));

  // Delete
  const delBtn = document.createElement('button');
  delBtn.className = 'layer-delete';
  delBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg> Remove layer`;
  delBtn.addEventListener('click', () => { if (!layer.locked) deleteLayer(layer.id); else showToast('Unlock this layer first'); });
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
  let _shadesExpanded = false;

  function _pick(hex) {
    _currentHex = hex;
    swatch.style.background = hex;
    nativeSwatch.style.background = hex;
    native.value = hex;
    popover.querySelectorAll('[data-hex]').forEach(c => {
      c.classList.toggle('selected', c.dataset.hex.toLowerCase() === hex.toLowerCase());
    });
    onChangeCallback(hex);
  }

  // ── Compact chip row: one chip per palette base colour ──
  const chipRow = document.createElement('div');
  chipRow.className = 'cp-chip-row';

  function buildChipRow() {
    chipRow.innerHTML = '';
    const palette = getActivePalette();
    const bases = palette.bases || palette.colors.slice(0, 8).map(c => c.hex);
    bases.slice(0, 8).forEach(hex => {
      const chip = document.createElement('button');
      chip.className = 'cp-base-chip' + (hex.toLowerCase() === _currentHex.toLowerCase() ? ' selected' : '');
      chip.dataset.hex = hex;
      chip.style.background = hex;
      chip.type = 'button';
      chip.title = hex;
      chip.addEventListener('click', e => { e.stopPropagation(); _pick(hex); _closeAllPopovers(); });
      chipRow.appendChild(chip);
    });
  }
  buildChipRow();

  // ── Shade grid: hidden by default, shown when expanded ──
  const shadeGrid = document.createElement('div');
  shadeGrid.className = 'cp-shade-grid cp-shade-collapsed';

  function buildShadeGrid() {
    shadeGrid.innerHTML = '';
    const palette = getActivePalette();
    const bases = palette.bases || palette.colors.slice(0, 5).map(c => c.hex);
    bases.slice(0, 5).forEach(baseHex => {
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

  // ── Neutrals row ──
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

  // ── Bottom row: expand shades toggle + custom input ──
  const bottomRow = document.createElement('div');
  bottomRow.className = 'cp-bottom-row';

  const expandBtn = document.createElement('button');
  expandBtn.type = 'button';
  expandBtn.className = 'cp-expand-btn';
  expandBtn.title = 'Show shades';
  expandBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg> Shades`;
  expandBtn.addEventListener('click', e => {
    e.stopPropagation();
    _shadesExpanded = !_shadesExpanded;
    shadeGrid.classList.toggle('cp-shade-collapsed', !_shadesExpanded);
    expandBtn.classList.toggle('open', _shadesExpanded);
    expandBtn.innerHTML = _shadesExpanded
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg> Shades`
      : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg> Shades`;
  });

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

  const customLabel = document.createElement('span');
  customLabel.className = 'cp-custom-label';
  customLabel.textContent = 'Custom';

  bottomRow.appendChild(expandBtn);
  bottomRow.appendChild(customLabel);
  bottomRow.appendChild(nativeWrap);

  popover.appendChild(chipRow);
  popover.appendChild(shadeGrid);
  popover.appendChild(neutralRow);
  popover.appendChild(bottomRow);
  document.body.appendChild(popover);

  swatch.addEventListener('click', e => {
    e.stopPropagation();
    if (_activePopover === popover) { _closeAllPopovers(); return; }
    _closeAllPopovers();
    buildChipRow();
    buildShadeGrid();
    // Position: prefer below, flip above if needed
    const r = swatch.getBoundingClientRect();
    const popH = _shadesExpanded ? 280 : 160;
    let left = r.left, top = r.bottom + 6;
    if (left + 220 > window.innerWidth) left = Math.max(4, window.innerWidth - 224);
    if (top + popH > window.innerHeight) top = Math.max(4, r.top - popH - 6);
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

      // Gradient toggle button
      const gradBtn = document.createElement('button');
      gradBtn.className = 'band-grad-btn' + (band.gradient ? ' active' : '');
      gradBtn.title = band.gradient ? 'Remove gradient' : 'Add gradient fade';
      gradBtn.textContent = '⟿';
      gradBtn.addEventListener('click', () => {
        band.gradient = !band.gradient;
        if (band.gradient && !band.gradientEnd) band.gradientEnd = '#ffffff';
        rebuildBandRows();
        onChange();
      });

      // Gradient end colour (only shown when gradient is on)
      const gradEndWrap = band.gradient
        ? buildColorPicker(band.gradientEnd || '#ffffff', val => { band.gradientEnd = val; onChange(); })
        : null;

      // Pattern fill selector (only shown when no gradient)
      let patternSelect = null;
      if (!band.gradient) {
        patternSelect = document.createElement('select');
        patternSelect.className = 'band-pattern-select';
        patternSelect.title = 'Fill pattern';
        [
          ['solid','Solid'],
          ['hatch45','Hatch ╲'],
          ['hatch-h','Lines ═'],
          ['hatch-v','Lines ║'],
          ['crosshatch','Crosshatch ╳'],
          ['dots','Dots ·'],
          ['checker','Checker ▦'],
        ].forEach(([val, lbl]) => {
          const opt = document.createElement('option');
          opt.value = val; opt.textContent = lbl;
          if ((band.pattern || 'solid') === val) opt.selected = true;
          patternSelect.appendChild(opt);
        });
        patternSelect.addEventListener('change', e => {
          band.pattern = e.target.value;
          // Show/hide bg colour picker based on whether it's a non-solid pattern
          rebuildBandRows();
          onChange();
        });
      }

      // Pattern background colour (shown for non-solid patterns without gradient)
      let patternBgWrap = null;
      if (!band.gradient && band.pattern && band.pattern !== 'solid') {
        patternBgWrap = buildColorPicker(band.patternBg || 'transparent', val => {
          band.patternBg = val; onChange();
        });
        patternBgWrap.title = 'Pattern background colour';
      }

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
      row.appendChild(gradBtn);
      if (gradEndWrap) row.appendChild(gradEndWrap);
      if (patternSelect) row.appendChild(patternSelect);
      if (patternBgWrap) row.appendChild(patternBgWrap);
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

  // Clip region
  const clipSection = document.createElement('div');
  clipSection.className = 'clip-region-section';
  clipSection.innerHTML = `<span class="control-label">Clip Region</span>`;
  const clipGrid = document.createElement('div');
  clipGrid.className = 'clip-region-grid';
  const regions = [
    ['tl','top','tr'],
    ['left','full','right'],
    ['bl','bottom','br'],
  ];
  const regionLabels = { tl:'↖', top:'↑', tr:'↗', left:'←', full:'□', right:'→', bl:'↙', bottom:'↓', br:'↘' };
  regions.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'clip-region-row';
    row.forEach(region => {
      const btn = document.createElement('button');
      btn.className = 'clip-region-btn' + ((layer.clipRegion || 'full') === region ? ' active' : '');
      btn.title = region;
      btn.textContent = regionLabels[region];
      btn.addEventListener('click', () => {
        layer.clipRegion = region;
        clipGrid.querySelectorAll('.clip-region-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        onChange();
      });
      rowEl.appendChild(btn);
    });
    clipGrid.appendChild(rowEl);
  });
  clipSection.appendChild(clipGrid);
  wrap.appendChild(clipSection);

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
    border:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="3" y="3" width="18" height="18"/></svg>`,
    wavyh:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2,12 Q5,9 8,12 Q11,15 14,12 Q17,9 20,12 Q21,13 22,12 L22,16 Q21,17 20,16 Q17,13 14,16 Q11,19 8,16 Q5,13 2,16 Z"/></svg>`,
    zigzagh:  `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="2,10 6,14 10,10 14,14 18,10 22,14 22,22 2,22"/></svg>`,
    rhombus:  `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,12 12,22 2,12"/></svg>`,
    crescent: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18,5 A9,9 0 1,0 18,19 A7,7 0 1,1 18,5 Z"/></svg>`,
    star:     `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 14.5,9 22,9 16,14 18.5,21 12,17 5.5,21 8,14 2,9 9.5,9"/></svg>`,
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
function toggleLayerLocked(id) {
  const layer = design.layers.find(l => l.id === id);
  if (layer) { layer.locked = !layer.locked; renderLayerList(); }
}
function deleteLayer(id) {
  design.layers = design.layers.filter(l => l.id !== id);
  _commitChange();
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
  _commitChange();
}

// ---- Layer drag to reorder ----
function startLayerDrag(e, layerId) {
  dragLayerId = layerId;
  dragLayerOriginY = e.clientY;
  document.addEventListener('pointermove', onLayerDragMove);
  document.addEventListener('pointerup', onLayerDragEnd);
  try { e.target.setPointerCapture(e.pointerId); } catch {}
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
  document.removeEventListener('pointermove', onLayerDragMove);
  document.removeEventListener('pointerup', onLayerDragEnd);
}

// ---- Emblem row drag-to-reorder ----
let _dragEmblemId = null;
let _dragEmblemY  = 0;
let _copiedEmblem = null;

function startEmblemRowDrag(e, emblemId) {
  _dragEmblemId = emblemId;
  _dragEmblemY  = e.clientY;
  document.addEventListener('pointermove', _onEmblemRowMove);
  document.addEventListener('pointerup',   _onEmblemRowEnd);
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
  document.removeEventListener('pointermove', _onEmblemRowMove);
  document.removeEventListener('pointerup',   _onEmblemRowEnd);
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
      const raw = icons[i];
      // Support "folder:slug" entries used by merged categories
      const colonIdx = raw.indexOf(':');
      const fetchCat = colonIdx !== -1 ? raw.slice(0, colonIdx) : catId;
      const slug     = colonIdx !== -1 ? raw.slice(colonIdx + 1) : raw;
      const label = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      const cell = document.createElement('div');
      cell.className = 'icon-cell heraldic-cell';
      cell.title = label;
      cell.draggable = true;
      cell.dataset.slug = slug;
      cell.dataset.heraldCat = fetchCat;

      const wrap = document.createElement('div');
      wrap.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;';
      cell.appendChild(wrap);

      const name = document.createElement('span');
      name.className = 'icon-cell-name';
      name.textContent = label;
      cell.appendChild(name);

      // Fetch SVG and inject
      const p = fetchHeraldicSvg(fetchCat, slug).then(svgStr => {
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
          slug, label, category: fetchCat, heraldic: true
        }));
        ev.dataTransfer.effectAllowed = 'copy';
      });

      cell.addEventListener('click', () => placeHeraldicEmblem(slug, label, fetchCat, 50, 50));
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
      selectedEmblemId = emblem.id;
      _commitChange();
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
  flagSvg.addEventListener('pointerdown', e => {
    // Handle clicks (resize / rotate) take priority
    const handleEl = e.target.closest('.emblem-handle');
    if (handleEl) {
      const emblemEl = handleEl.closest('[data-emblem-id]');
      if (emblemEl) {
        startHandleDrag(e, emblemEl.dataset.emblemId, handleEl.dataset.handle);
      }
      e.stopPropagation();
      return;
    }
    const emblemEl = e.target.closest('[data-emblem-id]');
    if (emblemEl) {
      const id = emblemEl.dataset.emblemId;
      if (e.shiftKey) {
        // Shift+click: toggle multi-select
        if (_multiSelect.has(id)) {
          _multiSelect.delete(id);
        } else {
          _multiSelect.add(id);
        }
        renderAll();
      } else {
        _multiSelect.clear();
        selectEmblem(id);
        startEmblemDrag(e, id);
      }
      closeOverlayQuickedit();
      return;
    }

    // Check if click landed on a rendered overlay layer
    const layerEl = e.target.closest('[data-layer-id]');
    if (layerEl) {
      const layerId = layerEl.dataset.layerId;
      const layer = design.layers.find(l => l.id === layerId && l.type === 'overlay');
      if (layer && !layer.locked) {
        openOverlayQuickedit(layer);
        _multiSelect.clear();
        selectEmblem(null);
        return;
      }
    }

    _multiSelect.clear();
    selectEmblem(null);
    closeOverlayQuickedit();
  });
}

// ============================================================
// HANDLE DRAG — resize & rotate emblems
// ============================================================

function startHandleDrag(e, emblemId, handleType) {
  const emblem = design.emblems.find(em => em.id === emblemId);
  if (!emblem) return;
  selectEmblem(emblemId);
  _handleDragType    = handleType;
  _handleDragEmblemId = emblemId;
  _handleStartSize   = emblem.size;
  _handleStartRotate = emblem.rotate || 0;

  const rect = flagSvg.getBoundingClientRect();
  const svgX = (e.clientX - rect.left) / rect.width * CANVAS_W;
  const svgY = (e.clientY - rect.top)  / rect.height * CANVAS_H;
  _handleCenterX = emblem.x / 100 * CANVAS_W;
  _handleCenterY = emblem.y / 100 * CANVAS_H;

  const dx = svgX - _handleCenterX, dy = svgY - _handleCenterY;
  _handleStartDist  = Math.sqrt(dx * dx + dy * dy) || 1;
  _handleStartAngle = Math.atan2(dy, dx);

  document.addEventListener('pointermove', onHandleDragMove);
  document.addEventListener('pointerup',   onHandleDragEnd);
  try { e.target.setPointerCapture(e.pointerId); } catch {}
  e.preventDefault();
}

function onHandleDragMove(e) {
  if (!_handleDragType || !_handleDragEmblemId) return;
  const emblem = design.emblems.find(em => em.id === _handleDragEmblemId);
  if (!emblem) return;

  const rect = flagSvg.getBoundingClientRect();
  const svgX = (e.clientX - rect.left) / rect.width * CANVAS_W;
  const svgY = (e.clientY - rect.top)  / rect.height * CANVAS_H;
  const dx = svgX - _handleCenterX, dy = svgY - _handleCenterY;

  if (_handleDragType === 'rotate') {
    const angle = Math.atan2(dy, dx);
    const delta = (angle - _handleStartAngle) * 180 / Math.PI;
    emblem.rotate = Math.round(_handleStartRotate + delta);
    const rv = document.getElementById('ec-rotate');
    if (rv) { rv.value = emblem.rotate; document.getElementById('ec-rotate-val').value = emblem.rotate; }
  } else {
    // resize — ratio of current mouse distance vs start distance
    const dist = Math.sqrt(dx * dx + dy * dy);
    const newSize = Math.max(2, Math.min(80, _handleStartSize * dist / _handleStartDist));
    emblem.size = Math.round(newSize * 10) / 10;
    const sv = document.getElementById('ec-size');
    if (sv) { sv.value = emblem.size; document.getElementById('ec-size-val').value = emblem.size; }
  }

  // Fast re-render
  flagSvg.querySelectorAll('.render-emblem').forEach(el => el.remove());
  design.emblems.forEach(em => renderEmblemEl(flagSvg, em, em.id === selectedEmblemId));
}

function onHandleDragEnd() {
  if (!_handleDragType) return;
  _handleDragType = null;
  _handleDragEmblemId = null;
  document.removeEventListener('pointermove', onHandleDragMove);
  document.removeEventListener('pointerup',   onHandleDragEnd);
  clearTimeout(_histTimer);
  renderAll();
  pushHistory();
  autoSaveCurrentDesign();
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
    scaleX: 1,
    scaleY: 1,
    opacity: 100,
    strokeColor: '#000000',
    strokeWidth: 0,
    fg: '#ffffff',
    bg: 'transparent',
    _svgContent: getIconSvg(icon.slug),
  };
  design.emblems.push(emblem);
  selectedEmblemId = emblem.id;
  _commitChange();
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
    scaleX: 1,
    scaleY: 1,
    opacity: 100,
    strokeColor: '#000000',
    strokeWidth: 0,
    fg: '#ffffff',
    bg: 'transparent',
    heraldColours,
    _svgContent: svgContent,
  };
  design.emblems.push(emblem);
  selectedEmblemId = emblem.id;
  _commitChange();
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
    scaleX: 1,
    scaleY: 1,
    opacity: 100,
    strokeColor: '#000000',
    strokeWidth: 0,
    fg: '#ffffff',
    bg: 'transparent',
    textArc: 0,
    _svgContent: null,
  };
  design.emblems.push(emblem);
  selectedEmblemId = emblem.id;
  _commitChange();
}

function placeShapeEmblem(shapeKey, label, x, y) {
  const shapeDef = (typeof BASIC_SHAPES !== 'undefined') ? BASIC_SHAPES[shapeKey] : null;
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
    scaleX: shapeDef && shapeDef.defaultScaleX != null ? shapeDef.defaultScaleX : 1,
    scaleY: shapeDef && shapeDef.defaultScaleY != null ? shapeDef.defaultScaleY : 1,
    opacity: 100,
    strokeColor: '#000000',
    strokeWidth: 0,
    fg: '#ffffff',
    bg: 'transparent',
    _svgContent: null,
  };
  design.emblems.push(emblem);
  selectedEmblemId = emblem.id;
  _commitChange();
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
      selectedEmblemId = emblem.id;
      _commitChange();
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
  dragOffsetY = e.clientY - rect.top  - (emblem.y / 100 * rect.height);
  _prevDragX = emblem.x;
  _prevDragY = emblem.y;

  document.addEventListener('pointermove', onEmblemDragMove);
  document.addEventListener('pointerup', onEmblemDragEnd);
  try { flagSvg.setPointerCapture(e.pointerId); } catch {}
  e.preventDefault();
}

function onEmblemDragMove(e) {
  if (!draggingEmblemId) return;
  const emblem = design.emblems.find(em => em.id === draggingEmblemId);
  if (!emblem) return;
  const rect = flagSvg.getBoundingClientRect();
  let x = ((e.clientX - rect.left - dragOffsetX) / rect.width) * 100;
  let y = ((e.clientY - rect.top - dragOffsetY) / rect.height) * 100;

  const others = design.emblems.filter(em => em.id !== draggingEmblemId);

  // Grid snap targets + positions of other emblems
  const targetsX = [0, 16.7, 25, 33.3, 50, 66.6, 75, 83.3, 100, ...others.map(em => em.x)];
  const targetsY = [0, 16.7, 25, 33.3, 50, 66.6, 75, 83.3, 100, ...others.map(em => em.y)];

  // Equal-distance snap: add positions where this emblem is evenly spaced with others
  const equalX = [], equalY = [];
  for (let i = 0; i < others.length; i++) {
    for (let j = i + 1; j < others.length; j++) {
      // Midpoint — dragging emblem equidistant from others[i] and others[j]
      equalX.push((others[i].x + others[j].x) / 2);
      equalY.push((others[i].y + others[j].y) / 2);
    }
    // Extension — drag at equal spacing on either side of each other emblem
    for (let j = 0; j < others.length; j++) {
      if (i === j) continue;
      equalX.push(others[i].x + (others[i].x - others[j].x));
      equalY.push(others[i].y + (others[i].y - others[j].y));
    }
  }

  const rx = snapToTargets(x, targetsX);
  const ry = snapToTargets(y, targetsY);
  let rxEq = { v: x, hit: false }, ryEq = { v: y, hit: false };
  if (!rx.hit) rxEq = snapToTargets(x, equalX, 2.0);
  if (!ry.hit) ryEq = snapToTargets(y, equalY, 2.0);

  x = Math.max(0, Math.min(100, rx.hit ? rx.v : (rxEq.hit ? rxEq.v : x)));
  y = Math.max(0, Math.min(100, ry.hit ? ry.v : (ryEq.hit ? ryEq.v : y)));

  // For group emblems, move all children by the same delta
  if (emblem.type === 'group' && Array.isArray(emblem.children)) {
    const dx = x - _prevDragX;
    const dy = y - _prevDragY;
    if (dx !== 0 || dy !== 0) {
      emblem.children.forEach(child => {
        child.x = Math.max(0, Math.min(100, child.x + dx));
        child.y = Math.max(0, Math.min(100, child.y + dy));
      });
    }
  }
  _prevDragX = x;
  _prevDragY = y;

  emblem.x = x;
  emblem.y = y;

  // Draw snap guides
  const gg = _getGuideGroup();
  gg.innerHTML = '';
  // Grid/align guides (orange)
  if (rx.hit) gg.appendChild(_guideLine(rx.v / 100 * CANVAS_W, 0, rx.v / 100 * CANVAS_W, CANVAS_H));
  if (ry.hit) gg.appendChild(_guideLine(0, ry.v / 100 * CANVAS_H, CANVAS_W, ry.v / 100 * CANVAS_H));
  // Equal-distance guides (teal)
  if (!rx.hit && rxEq.hit) {
    const lx = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const gx = rxEq.v / 100 * CANVAS_W;
    lx.setAttribute('x1', gx); lx.setAttribute('y1', 0);
    lx.setAttribute('x2', gx); lx.setAttribute('y2', CANVAS_H);
    lx.setAttribute('stroke', '#06B6D4'); lx.setAttribute('stroke-width', '0.75');
    lx.setAttribute('stroke-dasharray', '3 3');
    gg.appendChild(lx);
  }
  if (!ry.hit && ryEq.hit) {
    const ly = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const gy = ryEq.v / 100 * CANVAS_H;
    ly.setAttribute('x1', 0); ly.setAttribute('y1', gy);
    ly.setAttribute('x2', CANVAS_W); ly.setAttribute('y2', gy);
    ly.setAttribute('stroke', '#06B6D4'); ly.setAttribute('stroke-width', '0.75');
    ly.setAttribute('stroke-dasharray', '3 3');
    gg.appendChild(ly);
  }
  // Centre crosshair dot
  if (rx.hit && Math.abs(rx.v - 50) < 0.1 && ry.hit && Math.abs(ry.v - 50) < 0.1) {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', CANVAS_W/2); dot.setAttribute('cy', CANVAS_H/2);
    dot.setAttribute('r', 3); dot.setAttribute('fill', '#FF6B35');
    gg.appendChild(dot);
  }

  // Re-render emblems only (fast path)
  flagSvg.querySelectorAll('.render-emblem').forEach(el => el.remove());
  design.emblems.forEach(em => renderEmblemEl(flagSvg, em, em.id === selectedEmblemId));
  flagSvg.removeChild(gg); flagSvg.appendChild(gg);
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
  document.removeEventListener('pointermove', onEmblemDragMove);
  document.removeEventListener('pointerup', onEmblemDragEnd);
  clearTimeout(_histTimer);
  renderAll();
  pushHistory();
  autoSaveCurrentDesign();
}

// ---- Emblem controls bar ----
function updateEmblemControls() {
  const emblem = design.emblems.find(em => em.id === selectedEmblemId);

  // Group button — show whenever 2+ emblems are multi-selected
  const groupBtn   = document.getElementById('ec-group');
  const ungroupBtn = document.getElementById('ec-ungroup');
  if (groupBtn)   groupBtn.style.display   = _multiSelect.size >= 2 ? '' : 'none';
  if (ungroupBtn) ungroupBtn.style.display = (emblem && emblem.type === 'group') ? '' : 'none';

  if (!emblem) {
    if (_multiSelect.size < 2) emblemControls.classList.remove('visible');
    else emblemControls.classList.add('visible'); // show bar just for Group button
    return;
  }
  emblemControls.classList.add('visible');

  const sizeEl = document.getElementById('ec-size');
  const rotEl  = document.getElementById('ec-rotate');
  sizeEl.value = emblem.size;
  rotEl.value  = emblem.rotate;
  document.getElementById('ec-size-val').value   = emblem.size;
  document.getElementById('ec-rotate-val').value = emblem.rotate;
  document.getElementById('ec-flip-h').classList.toggle('active', !!emblem.flipX);
  document.getElementById('ec-flip-v').classList.toggle('active', !!emblem.flipY);

  // Opacity
  const opEl = document.getElementById('ec-opacity');
  if (opEl) { opEl.value = emblem.opacity ?? 100; document.getElementById('ec-opacity-val').value = emblem.opacity ?? 100; }

  // Distribute buttons — only show when 2+ multi-selected
  const distH = document.getElementById('ec-dist-h');
  const distV = document.getElementById('ec-dist-v');
  if (distH) distH.style.display = _multiSelect.size >= 3 ? '' : 'none';
  if (distV) distV.style.display = _multiSelect.size >= 3 ? '' : 'none';

  // Stroke/outline controls
  const strokeColorEl = document.getElementById('ec-stroke-color');
  const strokeWidthEl = document.getElementById('ec-stroke-width');
  const strokeWidthValEl = document.getElementById('ec-stroke-width-val');
  if (strokeColorEl) strokeColorEl.value = emblem.strokeColor || '#000000';
  if (strokeWidthEl) strokeWidthEl.value = emblem.strokeWidth || 0;
  if (strokeWidthValEl) strokeWidthValEl.value = emblem.strokeWidth || 0;

  // W%/H% stretch controls
  const sxPct = Math.round((emblem.scaleX || 1) * 100);
  const syPct = Math.round((emblem.scaleY || 1) * 100);
  const scaleXEl = document.getElementById('ec-scale-x');
  const scaleYEl = document.getElementById('ec-scale-y');
  if (scaleXEl) { scaleXEl.value = sxPct; document.getElementById('ec-scale-x-val').value = sxPct; }
  if (scaleYEl) { scaleYEl.value = syPct; document.getElementById('ec-scale-y-val').value = syPct; }

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
  const ecSize = document.getElementById('ec-size');
  const ecSizeVal = document.getElementById('ec-size-val');
  const ecRotate = document.getElementById('ec-rotate');
  const ecRotateVal = document.getElementById('ec-rotate-val');
  const ecFlipH = document.getElementById('ec-flip-h');
  const ecFlipV = document.getElementById('ec-flip-v');

  if (ecSize) ecSize.addEventListener('input', e => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) {
      em.size = +e.target.value;
      if (ecSizeVal) ecSizeVal.value = em.size;
      renderAll();
    }
  });
  if (ecSizeVal) {
    ecSizeVal.addEventListener('input', e => {
      const val = Math.max(5, Math.min(80, +e.target.value || 5));
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.size = val; if (ecSize) ecSize.value = val; onChange(); }
    });
    ecSizeVal.addEventListener('change', e => {
      const val = Math.max(5, Math.min(80, +e.target.value || 5));
      e.target.value = val;
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.size = val; if (ecSize) ecSize.value = val; _commitChange(); }
    });
  }

  if (ecRotate) ecRotate.addEventListener('input', e => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) {
      em.rotate = +e.target.value;
      if (ecRotateVal) ecRotateVal.value = em.rotate;
      renderAll();
    }
  });
  if (ecRotateVal) {
    ecRotateVal.addEventListener('input', e => {
      const val = Math.max(-180, Math.min(180, +e.target.value || 0));
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.rotate = val; if (ecRotate) ecRotate.value = val; onChange(); }
    });
    ecRotateVal.addEventListener('change', e => {
      const val = Math.max(-180, Math.min(180, +e.target.value || 0));
      e.target.value = val;
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.rotate = val; if (ecRotate) ecRotate.value = val; _commitChange(); }
    });
  }
  if (ecFlipH) ecFlipH.addEventListener('click', () => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) { em.flipX = !em.flipX; updateEmblemControls(); renderAll(); }
  });
  if (ecFlipV) ecFlipV.addEventListener('click', () => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) { em.flipY = !em.flipY; updateEmblemControls(); renderAll(); }
  });

  // Opacity controls
  const ecOpacity    = document.getElementById('ec-opacity');
  const ecOpacityVal = document.getElementById('ec-opacity-val');
  if (ecOpacity) {
    ecOpacity.addEventListener('input', e => {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.opacity = +e.target.value; ecOpacityVal.value = e.target.value; renderAll(); }
    });
  }
  if (ecOpacityVal) {
    ecOpacityVal.addEventListener('input', e => {
      const val = Math.max(5, Math.min(100, +e.target.value || 100));
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.opacity = val; ecOpacity.value = val; onChange(); }
    });
    ecOpacityVal.addEventListener('change', e => {
      const val = Math.max(5, Math.min(100, +e.target.value || 100));
      e.target.value = val;
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.opacity = val; ecOpacity.value = val; _commitChange(); }
    });
  }

  // Alignment buttons
  function _alignEmblem(em, axis, mode) {
    // axis: 'x'|'y', mode: 'start'|'centre'|'end'
    const sxm = em.scaleX || 1;
    const sym = em.scaleY || 1;
    const halfWpct = (em.size / 100 * CANVAS_W * sxm / 2) / CANVAS_W * 100;
    const halfHpct = (em.size / 100 * CANVAS_W * sym / 2) / CANVAS_H * 100;
    if (axis === 'x') {
      if (mode === 'start')  em.x = halfWpct;
      if (mode === 'centre') em.x = 50;
      if (mode === 'end')    em.x = 100 - halfWpct;
    } else {
      if (mode === 'start')  em.y = halfHpct;
      if (mode === 'centre') em.y = 50;
      if (mode === 'end')    em.y = 100 - halfHpct;
    }
  }
  function _doAlign(axis, mode) {
    const targets = _multiSelect.size >= 2
      ? design.emblems.filter(em => _multiSelect.has(em.id))
      : design.emblems.filter(em => em.id === selectedEmblemId);
    targets.forEach(em => _alignEmblem(em, axis, mode));
    renderAll(); _commitChange();
  }
  function _doDistribute(axis) {
    const targets = design.emblems
      .filter(em => _multiSelect.has(em.id))
      .sort((a, b) => (axis === 'x' ? a.x - b.x : a.y - b.y));
    if (targets.length < 3) return;
    const first = axis === 'x' ? targets[0].x : targets[0].y;
    const last  = axis === 'x' ? targets[targets.length-1].x : targets[targets.length-1].y;
    const step  = (last - first) / (targets.length - 1);
    targets.forEach((em, i) => { if (axis === 'x') em.x = first + step * i; else em.y = first + step * i; });
    renderAll(); _commitChange();
  }

  ['ec-align-left','ec-align-ch','ec-align-right','ec-align-top','ec-align-cv','ec-align-bottom','ec-dist-h','ec-dist-v'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (id === 'ec-align-left')   _doAlign('x','start');
      if (id === 'ec-align-ch')     _doAlign('x','centre');
      if (id === 'ec-align-right')  _doAlign('x','end');
      if (id === 'ec-align-top')    _doAlign('y','start');
      if (id === 'ec-align-cv')     _doAlign('y','centre');
      if (id === 'ec-align-bottom') _doAlign('y','end');
      if (id === 'ec-dist-h')       _doDistribute('x');
      if (id === 'ec-dist-v')       _doDistribute('y');
    });
  });

  // W%/H% stretch controls
  const ecScaleX    = document.getElementById('ec-scale-x');
  const ecScaleXVal = document.getElementById('ec-scale-x-val');
  const ecScaleY    = document.getElementById('ec-scale-y');
  const ecScaleYVal = document.getElementById('ec-scale-y-val');
  if (ecScaleX) {
    ecScaleX.addEventListener('input', e => {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.scaleX = +e.target.value / 100; ecScaleXVal.value = e.target.value; renderAll(); }
    });
  }
  if (ecScaleXVal) {
    ecScaleXVal.addEventListener('input', e => {
      const val = Math.max(25, Math.min(500, +e.target.value || 100));
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.scaleX = val / 100; ecScaleX.value = val; onChange(); }
    });
    ecScaleXVal.addEventListener('change', e => {
      const val = Math.max(25, Math.min(500, +e.target.value || 100));
      e.target.value = val;
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.scaleX = val / 100; ecScaleX.value = val; _commitChange(); }
    });
  }
  if (ecScaleY) {
    ecScaleY.addEventListener('input', e => {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.scaleY = +e.target.value / 100; ecScaleYVal.value = e.target.value; renderAll(); }
    });
  }
  if (ecScaleYVal) {
    ecScaleYVal.addEventListener('input', e => {
      const val = Math.max(25, Math.min(500, +e.target.value || 100));
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.scaleY = val / 100; ecScaleY.value = val; onChange(); }
    });
    ecScaleYVal.addEventListener('change', e => {
      const val = Math.max(25, Math.min(500, +e.target.value || 100));
      e.target.value = val;
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.scaleY = val / 100; ecScaleY.value = val; _commitChange(); }
    });
  }
  const ecFg = document.getElementById('ec-fg');
  if (ecFg) ecFg.addEventListener('input', e => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) { em.fg = e.target.value; renderAll(); }
  });
  const ecBg = document.getElementById('ec-bg');
  if (ecBg) ecBg.addEventListener('input', e => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em && em.bg !== 'transparent') { em.bg = e.target.value; renderAll(); }
  });
  const ecBgTransparent = document.getElementById('ec-bg-transparent');
  if (ecBgTransparent) ecBgTransparent.addEventListener('change', e => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) { em.bg = e.target.checked ? 'transparent' : '#000000'; renderAll(); }
  });
  const ecDelete = document.getElementById('ec-delete');
  if (ecDelete) ecDelete.addEventListener('click', () => {
    design.emblems = design.emblems.filter(em => em.id !== selectedEmblemId);
    selectedEmblemId = null;
    _commitChange();
  });

  const ecDupe = document.getElementById('ec-duplicate');
  if (ecDupe) {
    ecDupe.addEventListener('click', () => {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { _copiedEmblem = JSON.parse(JSON.stringify(em)); _pasteEmblem(); }
    });
  }

  // Group / Ungroup
  const ecGroup = document.getElementById('ec-group');
  if (ecGroup) ecGroup.addEventListener('click', groupEmblems);
  const ecUngroup = document.getElementById('ec-ungroup');
  if (ecUngroup) ecUngroup.addEventListener('click', () => ungroupEmblem(selectedEmblemId));

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

  // Stroke/outline controls
  const ecStrokeColor    = document.getElementById('ec-stroke-color');
  const ecStrokeWidth    = document.getElementById('ec-stroke-width');
  const ecStrokeWidthVal = document.getElementById('ec-stroke-width-val');
  if (ecStrokeColor) {
    ecStrokeColor.addEventListener('input', e => {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.strokeColor = e.target.value; renderAll(); }
    });
  }
  if (ecStrokeWidth) {
    ecStrokeWidth.addEventListener('input', e => {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) {
        em.strokeWidth = +e.target.value;
        if (ecStrokeWidthVal) ecStrokeWidthVal.value = e.target.value;
        renderAll();
      }
    });
    ecStrokeWidth.addEventListener('change', e => {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.strokeWidth = +e.target.value; _commitChange(); }
    });
  }
  if (ecStrokeWidthVal) {
    ecStrokeWidthVal.addEventListener('input', e => {
      const val = Math.max(0, Math.min(20, +e.target.value || 0));
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.strokeWidth = val; if (ecStrokeWidth) ecStrokeWidth.value = val; renderAll(); }
    });
    ecStrokeWidthVal.addEventListener('change', e => {
      const val = Math.max(0, Math.min(20, +e.target.value || 0));
      e.target.value = val;
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { em.strokeWidth = val; if (ecStrokeWidth) ecStrokeWidth.value = val; _commitChange(); }
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

  const undoBtn = document.getElementById('btn-undo');
  const redoBtn = document.getElementById('btn-redo');
  if (undoBtn) undoBtn.addEventListener('click', undo);
  if (redoBtn) redoBtn.addEventListener('click', redo);

  document.getElementById('btn-save').addEventListener('click', saveDesign);
  document.getElementById('btn-open').addEventListener('click', openSaveModal);
  // Export PNG/SVG are now handled inside bindExportModal()

  bindPaletteSelector();
  bindEmblemControls();
  bindSaveModal();
  bindPreviewModal();
  bindFlagShapePicker();
  bindRandomFlag();
  bindDarkMode();
  bindTemplatesModal();
  bindVexChecker();
  bindExportModal();
  bindShareModal();
  bindUpgradeModal();
  bindOverlayQuickedit();
  bindMobileNav();
  bindHeaderMenu();

  // Auto-save before navigating to Inspire
  const inspireLink = document.querySelector('a.header-nav-link[href="inspire.html"]');
  if (inspireLink) {
    inspireLink.addEventListener('click', () => autoSaveCurrentDesign());
  }
}

// ============================================================
// OVERLAY IN-CANVAS QUICKEDIT
// ============================================================

let _oqeLayerId = null;

function openOverlayQuickedit(layer) {
  _oqeLayerId = layer.id;
  const panel  = document.getElementById('overlay-quickedit');
  const title  = document.getElementById('oqe-title');
  const body   = document.getElementById('oqe-body');
  if (!panel || !body) return;

  title.textContent = SHAPES[layer.shape]?.label || 'Overlay';
  body.innerHTML = '';

  // ---- Shape picker ----
  const grid = document.createElement('div');
  grid.className = 'oqe-shape-grid';
  Object.entries(SHAPES).forEach(([key, shape]) => {
    const btn = document.createElement('button');
    btn.className = 'oqe-shape-btn' + (layer.shape === key ? ' active' : '');
    btn.title = shape.label;
    btn.innerHTML = shapeIcon(key);
    btn.addEventListener('click', () => {
      layer.shape = key;
      layer.params = {};
      onChange();
      // Rebuild the panel with the new shape
      openOverlayQuickedit(layer);
    });
    grid.appendChild(btn);
  });
  body.appendChild(grid);

  // ---- Colour row ----
  const colourRow = document.createElement('div');
  colourRow.className = 'oqe-row';
  colourRow.innerHTML = '<span class="oqe-label">Colour</span>';
  const colourPicker = buildColorPicker(layer.color || '#ffffff', val => {
    layer.color = val;
    onChange();
  });
  colourRow.appendChild(colourPicker);
  body.appendChild(colourRow);

  // ---- Opacity row ----
  const opRow = document.createElement('div');
  opRow.className = 'oqe-row';
  const opVal = document.createElement('span');
  opVal.className = 'oqe-val';
  opVal.textContent = `${layer.opacity ?? 100}%`;
  opRow.innerHTML = '<span class="oqe-label">Opacity</span>';
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
  body.appendChild(opRow);

  // ---- Shape-specific params ----
  if (layer.shape && SHAPES[layer.shape]) {
    const shapeDef = SHAPES[layer.shape];
    Object.entries(shapeDef.params || {}).forEach(([key, def]) => {
      const row = document.createElement('div');
      row.className = 'oqe-row';
      const val = document.createElement('span');
      val.className = 'oqe-val';
      val.textContent = layer.params?.[key] ?? def.default;
      row.innerHTML = `<span class="oqe-label">${def.label}</span>`;
      const input = document.createElement('input');
      input.type = 'range';
      input.min = def.min; input.max = def.max; input.step = def.step || 1;
      input.value = layer.params?.[key] ?? def.default;
      input.addEventListener('input', e => {
        if (!layer.params) layer.params = {};
        layer.params[key] = +e.target.value;
        val.textContent = layer.params[key];
        onChange();
      });
      row.appendChild(input);
      row.appendChild(val);
      body.appendChild(row);
    });
  }

  panel.classList.remove('hidden');
}

function closeOverlayQuickedit() {
  _oqeLayerId = null;
  const panel = document.getElementById('overlay-quickedit');
  if (panel) panel.classList.add('hidden');
}

function bindOverlayQuickedit() {
  const closeBtn = document.getElementById('oqe-close');
  if (closeBtn) closeBtn.addEventListener('click', closeOverlayQuickedit);
}

// ============================================================
// MOBILE NAV
// ============================================================

function bindMobileNav() {
  const nav = document.getElementById('mobile-nav');
  if (!nav) return;

  const layersPanel = document.getElementById('layers-panel');
  const iconsPanel  = document.getElementById('icons-panel');

  // Which panel is currently open: null | 'layers' | 'icons'
  let activePanel = null;

  function showPanel(name) {
    if (activePanel === name) {
      // Toggle off — go back to canvas
      closeAllPanels();
      setActiveBtn('canvas');
      return;
    }
    activePanel = name;
    layersPanel.classList.toggle('panel-open', name === 'layers');
    iconsPanel.classList.toggle('panel-open',  name === 'icons');
    setActiveBtn(name);
  }

  function closeAllPanels() {
    activePanel = null;
    layersPanel.classList.remove('panel-open');
    iconsPanel.classList.remove('panel-open');
  }

  function setActiveBtn(name) {
    nav.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.panel === name);
    });
  }

  document.getElementById('mnav-canvas').addEventListener('click', () => {
    closeAllPanels();
    setActiveBtn('canvas');
  });
  document.getElementById('mnav-layers').addEventListener('click', () => showPanel('layers'));
  document.getElementById('mnav-icons').addEventListener('click',  () => showPanel('icons'));
  document.getElementById('mnav-export').addEventListener('click', () => {
    closeAllPanels();
    setActiveBtn('canvas');
    document.getElementById('export-modal').classList.remove('hidden');
  });

  // Tapping the canvas area closes open panels
  document.getElementById('canvas-area').addEventListener('pointerdown', e => {
    if (activePanel) {
      closeAllPanels();
      setActiveBtn('canvas');
    }
  }, { passive: true });
}

function bindHeaderMenu() {
  const menuBtn  = document.getElementById('btn-menu');
  const menu     = document.getElementById('header-menu');
  const backdrop = document.getElementById('header-menu-backdrop');
  if (!menuBtn || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    backdrop.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  }
  function closeMenu() {
    menu.classList.remove('open');
    backdrop.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  menuBtn.addEventListener('click', e => {
    e.stopPropagation();
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  backdrop.addEventListener('click', closeMenu);

  // Forward each menu item click to its real header button (or follow href)
  menu.querySelectorAll('.hm-item[data-target]').forEach(item => {
    item.addEventListener('click', () => {
      closeMenu();
      const target = document.getElementById(item.dataset.target);
      if (target) setTimeout(() => target.click(), 0);
    });
  });

  // Links in the menu just navigate — close the menu first so the transition is clean
  menu.querySelectorAll('a.hm-item').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
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

    // Undo
    if (ctrl && e.key === 'z' && !e.shiftKey && !inInput) {
      undo(); e.preventDefault(); return;
    }
    // Redo (Ctrl+Y or Ctrl+Shift+Z)
    if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey)) && !inInput) {
      redo(); e.preventDefault(); return;
    }
    // Copy
    if (ctrl && e.key === 'c' && selectedEmblemId && !inInput) {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { _copiedEmblem = JSON.parse(JSON.stringify(em)); showToast('Copied', ''); }
      e.preventDefault(); return;
    }
    // Paste
    if (ctrl && e.key === 'v' && _copiedEmblem && !inInput) {
      _pasteEmblem(); e.preventDefault(); return;
    }
    // Duplicate
    if (ctrl && e.key === 'd' && selectedEmblemId && !inInput) {
      const em = design.emblems.find(x => x.id === selectedEmblemId);
      if (em) { _copiedEmblem = JSON.parse(JSON.stringify(em)); _pasteEmblem(); }
      e.preventDefault(); return;
    }
    // Group
    if (ctrl && e.key === 'g' && !inInput) {
      if (_multiSelect.size >= 2) groupEmblems();
      else if (selectedEmblemId) {
        const em = design.emblems.find(x => x.id === selectedEmblemId);
        if (em && em.type === 'group') ungroupEmblem(selectedEmblemId);
      }
      e.preventDefault(); return;
    }
    if (inInput) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEmblemId) {
      design.emblems = design.emblems.filter(em => em.id !== selectedEmblemId);
      selectedEmblemId = null;
      _commitChange();
      return;
    }
    if (e.key === 'Escape') { _multiSelect.clear(); selectEmblem(null); }
  });
}

function _pasteEmblem() {
  if (!_copiedEmblem) return;
  const newEm = JSON.parse(JSON.stringify(_copiedEmblem));
  newEm.id = uuid();
  newEm.x  = Math.min(97, (_copiedEmblem.x || 50) + 4);
  newEm.y  = Math.min(97, (_copiedEmblem.y || 50) + 4);
  if (newEm.heraldic && newEm.heraldCat && newEm.heraldSlug) {
    fetchHeraldicSvg(newEm.heraldCat, newEm.heraldSlug).then(svg => {
      newEm._svgContent = svg;
      renderAll();
    });
  }
  design.emblems.push(newEm);
  selectedEmblemId = newEm.id;
  _commitChange();
}

// ============================================================
// GROUP / UNGROUP
// ============================================================

function groupEmblems() {
  const ids = [..._multiSelect];
  if (ids.length < 2) return;

  const children = ids.map(id => design.emblems.find(em => em.id === id)).filter(Boolean);
  if (children.length < 2) { showToast('Select 2+ icons to group', ''); return; }

  // Compute centroid
  const cx = children.reduce((s, c) => s + c.x, 0) / children.length;
  const cy = children.reduce((s, c) => s + c.y, 0) / children.length;

  const group = {
    id:       uuid(),
    type:     'group',
    label:    'Group',
    x:        cx,
    y:        cy,
    size:     20,
    rotate:   0,
    flipX:    false,
    flipY:    false,
    hidden:   false,
    children: children.map(c => JSON.parse(JSON.stringify(c))), // deep copy
  };

  // Preserve _svgContent on children (not serialized but needed for render)
  group.children.forEach((gc, i) => {
    gc._svgContent = children[i]._svgContent;
  });

  // Remove individual emblems, insert group in same z-order as first member
  const firstIdx = Math.min(...ids.map(id => design.emblems.findIndex(em => em.id === id)));
  design.emblems = design.emblems.filter(em => !ids.includes(em.id));
  design.emblems.splice(Math.max(0, firstIdx), 0, group);

  _multiSelect.clear();
  selectedEmblemId = group.id;
  showToast(`Grouped ${children.length} icons`, 'success');
  _commitChange();
}

function ungroupEmblem(id) {
  const group = design.emblems.find(em => em.id === id && em.type === 'group');
  if (!group) return;

  const idx = design.emblems.findIndex(em => em.id === id);
  const released = (group.children || []).map(c => ({ ...c, id: c.id || uuid() }));

  design.emblems.splice(idx, 1, ...released);
  selectedEmblemId = null;
  showToast('Ungrouped', 'success');
  _commitChange();
}

// ============================================================
// UNDO / REDO
// ============================================================

function pushHistory() {
  const state = JSON.stringify(serializeDesign(design));
  if (_histIdx >= 0 && _history[_histIdx] === state) return; // no change
  _history = _history.slice(0, _histIdx + 1);
  _history.push(state);
  if (_history.length > MAX_HISTORY) _history.shift();
  _histIdx = _history.length - 1;
  _updateUndoRedoBtns();
}

function undo() {
  if (_histIdx <= 0) return;
  _histIdx--;
  _applyHistoryState(JSON.parse(_history[_histIdx]));
}

function redo() {
  if (_histIdx >= _history.length - 1) return;
  _histIdx++;
  _applyHistoryState(JSON.parse(_history[_histIdx]));
}

function _applyHistoryState(state) {
  design = { ...state, emblems: (state.emblems || []).map(em => ({ ...em })) };
  design.emblems.forEach(em => {
    if (em.heraldic && em.heraldCat && em.heraldSlug) {
      fetchHeraldicSvg(em.heraldCat, em.heraldSlug).then(svg => {
        em._svgContent = svg;
        renderAll();
      });
    } else if (em.slug && !em.heraldic) {
      em._svgContent = getIconSvg(em.slug);
    }
  });
  designNameEl.value = design.name;
  selectedEmblemId = null;
  renderAll();
  _updateUndoRedoBtns();
  autoSaveCurrentDesign();
}

function _updateUndoRedoBtns() {
  const ub = document.getElementById('btn-undo');
  const rb = document.getElementById('btn-redo');
  if (ub) ub.disabled = (_histIdx <= 0);
  if (rb) rb.disabled = (_histIdx >= _history.length - 1);
}

// ============================================================
// CHANGE CALLBACK
// ============================================================

function onChange() {
  renderAll();
  autoSaveCurrentDesign();
  // Debounced history push (handles slider drags, continuous changes)
  clearTimeout(_histTimer);
  _histTimer = setTimeout(pushHistory, 600);
  // Update vex checker if open
  const vexBody = document.getElementById('vex-checker-body');
  if (vexBody && !vexBody.classList.contains('hidden')) updateVexChecker();
}

// Immediate history push (use after discrete actions: place, delete, layer add/remove)
function _commitChange() {
  clearTimeout(_histTimer);
  renderAll();
  pushHistory();
  autoSaveCurrentDesign();
}

// ============================================================
// TIER / PRO SYSTEM
// ============================================================

const TIER_KEY     = 'vexillum_tier';       // localStorage key: 'free' | 'pro' | 'business'
const TIER_KEY_VAL = 'vexillum_tier_key';   // stores the activation key

// Hardcoded valid keys for v1 (replace with server validation later)
const VALID_KEYS = {
  'VEXILLUM-PRO-DEMO-2024':  'pro',
  'VEXILLUM-BIZ-DEMO-2024':  'business',
};

function getTier() {
  return localStorage.getItem(TIER_KEY) || 'free';
}
function isPro()      { return true; } // all features free
function isBusiness() { return getTier() === 'business'; }

function setTier(tier, key) {
  localStorage.setItem(TIER_KEY, tier);
  if (key) localStorage.setItem(TIER_KEY_VAL, key);
  _updateTierUI();
}

function _updateTierUI() {
  const badge = document.getElementById('header-tier-badge');
  if (!badge) return;
  const tier = getTier();
  badge.className = 'header-tier-badge header-tier-' + tier;
  badge.textContent = tier.toUpperCase();
  badge.title = isPro() ? 'Pro features active' : 'Upgrade to Pro';
  // Make badge clickable — free opens upgrade modal, pro does nothing distracting
  badge.style.cursor = isPro() ? 'default' : 'pointer';
}

// Gate a feature: if free, show upgrade modal and return false. Otherwise return true.
function requirePro(featureName) {
  if (isPro()) return true;
  openUpgradeModal(featureName);
  return false;
}
function requireBusiness(featureName) {
  if (isBusiness()) return true;
  openUpgradeModal(featureName);
  return false;
}

let _upgradeModalOpen = false;

function openUpgradeModal(featureName) {
  const modal = document.getElementById('upgrade-modal');
  if (!modal) return;
  // Update the header prompt if a specific feature triggered it
  const tagline = modal.querySelector('.upgrade-tagline');
  if (tagline && featureName) {
    tagline.textContent = `"${featureName}" is a Pro feature`;
  } else if (tagline) {
    tagline.textContent = 'Design flags without limits';
  }
  modal.classList.remove('hidden');
  _upgradeModalOpen = true;
}

// Upgrade modal removed — all features are free
function bindUpgradeModal() { _updateTierUI(); }
function openUpgradeModal() {}
function _launchCheckout() {}
function _activateKey() {}

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
  } else if (shape.clipD) {
    defs.innerHTML = `<clipPath id="flag-clip"><path d="${shape.clipD}"/></clipPath>`;
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
  if (!requirePro('SVG export')) return;
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

// Returns a Promise<string> data URL for a PNG at the given pixel scale
function _makePngDataUrl(scale) {
  return new Promise((resolve, reject) => {
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

      // Watermark removed — all exports are free
      if (false) {
        const fontSize = Math.max(11, Math.round(H * 0.038));
        ctx.save();
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 ${fontSize}px DM Sans, sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        // Drop shadow for legibility on any background
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 4;
        ctx.fillText('vexillum.app', W - 8, H - 6);
        ctx.restore();
      }

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

function exportPng(scale = 2) {
  _makePngDataUrl(scale).then(dataUrl => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${sanitizeFilename(design.name)}.png`;
    a.click();
    showToast('PNG exported', 'success');
  }).catch(() => showToast('Export failed', 'error'));
}

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-\s]/gi, '').replace(/\s+/g, '-').toLowerCase() || 'flag';
}

// ============================================================
// EXPORT MODAL
// ============================================================

function _getExportScale() {
  const checked = document.querySelector('input[name="export-res"]:checked');
  if (!checked) return 2;
  if (checked.value === 'custom') {
    const w = parseInt(document.getElementById('export-custom-w').value, 10) || 1920;
    return Math.max(1, w / CANVAS_W);
  }
  return parseFloat(checked.value);
}

function bindExportModal() {
  const modal   = document.getElementById('export-modal');
  const openBtn = document.getElementById('btn-export-png');  // header "Export" button
  const closeBtn = document.getElementById('export-modal-close');

  function _updateResLabels() {
    // Update size hints based on current CANVAS_W/H
    const pairs = [[1,'res-1x'],[2,'res-2x'],[4,'res-4x']];
    pairs.forEach(([s, id]) => {
      const lbl = document.getElementById(id)?.closest('.export-res-opt')?.querySelector('em');
      if (lbl) lbl.textContent = `${Math.round(CANVAS_W*s)}×${Math.round(CANVAS_H*s)}`;
    });
  }

  function openExport() {
    _updateResLabels();
    modal.classList.remove('hidden');
  }
  function closeExport() { modal.classList.add('hidden'); }

  openBtn.addEventListener('click', openExport);
  closeBtn.addEventListener('click', closeExport);
  modal.addEventListener('click', e => { if (e.target === modal) closeExport(); });

  // Also wire up the "Export" button inside preview modal
  const previewExportBtn = document.getElementById('preview-export-png');
  if (previewExportBtn) previewExportBtn.addEventListener('click', () => {
    document.getElementById('preview-modal').classList.add('hidden');
    openExport();
  });

  // Download PNG — 1× free, 2×/4×/custom requires pro
  document.getElementById('export-dl-png').addEventListener('click', () => {
    const scale = _getExportScale();
    if (scale > 1 && !requirePro('Hi-res PNG export')) return;
    exportPng(scale);
  });

  // Copy PNG to clipboard — pro only
  document.getElementById('export-copy-png').addEventListener('click', async () => {
    if (!requirePro('Copy PNG to clipboard')) return;
    const scale = _getExportScale();
    try {
      const dataUrl = await _makePngDataUrl(scale);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('PNG copied to clipboard', 'success');
    } catch (err) {
      showToast('Copy failed — try a different browser', 'error');
    }
  });

  // Download SVG — pro only (handled inside exportSvg)
  document.getElementById('export-dl-svg').addEventListener('click', exportSvg);

  // Copy SVG code to clipboard — pro only
  document.getElementById('export-copy-svg').addEventListener('click', () => {
    if (!requirePro('Copy SVG to clipboard')) return;
    const svgStr = getSvgString(1);
    navigator.clipboard.writeText(svgStr)
      .then(() => showToast('SVG code copied to clipboard', 'success'))
      .catch(() => showToast('Copy failed', 'error'));
  });

  // Update lock indicators whenever modal opens
  openBtn.addEventListener('click', _updateExportLockUI, { capture: true });

  function _updateExportLockUI() {
    const pro = isPro();
    // 4× and custom labels get a lock icon when on free tier
    ['res-4x', 'res-custom'].forEach(id => {
      const el = document.getElementById(id)?.closest('.export-res-opt');
      if (!el) return;
      let lockSpan = el.querySelector('.res-lock');
      if (!pro) {
        if (!lockSpan) { lockSpan = document.createElement('span'); lockSpan.className = 'res-lock'; lockSpan.textContent = '🔒'; el.appendChild(lockSpan); }
      } else {
        lockSpan?.remove();
      }
    });
    // Visually dim pro-only buttons
    ['export-copy-png','export-dl-svg','export-copy-svg'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.classList.toggle('btn-locked', !pro);
    });
  }
  _updateExportLockUI();
}

// ============================================================
// SHARE MODAL — URL-encoded design
// ============================================================

function _designToShareUrl() {
  // Strip runtime-only fields and large cached SVG content before encoding
  const stripped = JSON.parse(JSON.stringify(design));
  stripped.emblems = (stripped.emblems || []).map(em => {
    const copy = { ...em };
    delete copy._svgContent;  // can be re-fetched or stored from icons list
    return copy;
  });
  try {
    const json = JSON.stringify(stripped);
    // Base64-encode (URL safe) — no compression dep needed for typical designs
    const b64 = btoa(unescape(encodeURIComponent(json)));
    const url = new URL(window.location.href);
    url.hash = 'd=' + b64;
    return { url: url.toString(), bytes: b64.length };
  } catch (e) {
    return null;
  }
}

function _loadDesignFromUrl() {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith('#d=')) return false;
    const b64 = hash.slice(3);
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json);
    if (!parsed || !parsed.layers) return false;
    Object.assign(design, parsed);
    // Re-fetch any heraldic SVG content that was stripped
    design.emblems.forEach(em => {
      if (em.heraldic && !em._svgContent) {
        fetchHeraldicSvg(em.heraldCat, em.heraldSlug).then(svg => {
          if (svg) { em._svgContent = svg; renderAll(); }
        });
      } else if (!em._svgContent && em.slug && !em.type) {
        em._svgContent = getIconSvg(em.slug);
      }
    });
    return true;
  } catch (e) {
    return false;
  }
}

function bindShareModal() {
  const modal    = document.getElementById('share-modal');
  const openBtn  = document.getElementById('btn-share');
  const closeBtn = document.getElementById('share-modal-close');
  const urlInput = document.getElementById('share-url-input');
  const copyBtn  = document.getElementById('share-copy-link');
  const sizeHint = document.getElementById('share-size-hint');
  const nativeBtn = document.getElementById('share-native-btn');

  function openShare() {
    if (!requirePro('Share design links')) return;
    const result = _designToShareUrl();
    if (result) {
      urlInput.value = result.url;
      const kb = (result.bytes / 1024).toFixed(1);
      sizeHint.textContent = `Link encodes the full design (${kb} KB). Works best for simple flags — complex designs may produce very long URLs.`;
    } else {
      urlInput.value = '';
      sizeHint.textContent = 'Could not generate link — design may be too complex.';
    }
    if (navigator.share) nativeBtn.style.display = '';
    modal.classList.remove('hidden');
  }
  function closeShare() { modal.classList.add('hidden'); }

  openBtn.addEventListener('click', openShare);
  closeBtn.addEventListener('click', closeShare);
  modal.addEventListener('click', e => { if (e.target === modal) closeShare(); });

  // Wire up preview modal share button
  const previewShareBtn = document.getElementById('preview-share-btn');
  if (previewShareBtn) previewShareBtn.addEventListener('click', () => {
    document.getElementById('preview-modal').classList.add('hidden');
    openShare();
  });

  // Copy link
  copyBtn.addEventListener('click', () => {
    if (!urlInput.value) return;
    navigator.clipboard.writeText(urlInput.value)
      .then(() => { showToast('Link copied!', 'success'); copyBtn.textContent = '✓ Copied'; setTimeout(() => { copyBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy'; }, 2000); })
      .catch(() => { urlInput.select(); document.execCommand('copy'); showToast('Link copied!', 'success'); });
  });

  // Select all on click for easy manual copy
  urlInput.addEventListener('click', () => urlInput.select());

  // Native share (mobile / Chromium)
  nativeBtn.addEventListener('click', async () => {
    try {
      const dataUrl = await _makePngDataUrl(2);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `${sanitizeFilename(design.name)}.png`, { type: 'image/png' });
      await navigator.share({ title: design.name, text: 'Flag designed in Vexillum', files: [file] });
    } catch {
      showToast('Share cancelled', '');
    }
  });

  // Copy image
  document.getElementById('share-copy-image').addEventListener('click', async () => {
    if (!requirePro('Copy image to clipboard')) return;
    try {
      const dataUrl = await _makePngDataUrl(2);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('Image copied to clipboard', 'success');
    } catch {
      showToast('Copy failed — try downloading instead', 'error');
    }
  });
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
    if (false && saved.length >= MAX_FREE_SAVES && !isPro()) {
      openUpgradeModal('Unlimited saved designs');
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
  const mc = document.getElementById('modal-close');
  if (mc) mc.addEventListener('click', closeSaveModal);
  if (saveModal) saveModal.addEventListener('click', e => { if (e.target === saveModal) closeSaveModal(); });
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

// ============================================================
// ============================================================
// PREVIEW MODAL
// ============================================================

let _previewSvgStr = '';    // cached SVG string for current preview

function bindPreviewModal() {
  const btn   = document.getElementById('btn-preview');
  const modal = document.getElementById('preview-modal');
  const close = document.getElementById('preview-close');
  const wrap  = document.getElementById('preview-flag-wrap');
  if (!btn || !modal || !wrap) return;

  function openPreview() {
    _previewSvgStr = getSvgString(1);
    const div = document.createElement('div');
    div.innerHTML = _previewSvgStr;
    const svgEl = div.querySelector('svg');
    if (!svgEl) { modal.classList.remove('hidden'); return; }

    const previewW = Math.min(720, CANVAS_W * 1.5);
    const previewH = Math.round(previewW / CANVAS_W * CANVAS_H);
    svgEl.setAttribute('width', previewW);
    svgEl.setAttribute('height', previewH);
    svgEl.style.cssText = 'display:block;max-width:100%;border-radius:4px;';

    wrap.innerHTML = '';
    wrap.appendChild(svgEl);
    modal.classList.remove('hidden');
  }

  btn.addEventListener('click', openPreview);
  close.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

  // preview-export-png and preview-share-btn are wired in bindExportModal / bindShareModal
}

// ============================================================
// VEXILLOLOGY CHECKER
// ============================================================

const VEX_RULES = [
  {
    id: 'simple',
    label: 'Keep it simple',
    check(d) {
      const total = d.layers.length + d.emblems.length;
      if (total <= 4) return 'pass';
      if (total <= 7) return 'warn';
      return 'fail';
    },
    tip(d) {
      const total = d.layers.length + d.emblems.length;
      if (total <= 4) return 'Simple design — easy to reproduce.';
      if (total <= 7) return 'Getting complex. Consider simplifying.';
      return 'Too many elements — flags work best when simple.';
    }
  },
  {
    id: 'colours',
    label: 'Limit colours (≤3)',
    check(d) {
      const cols = _countDesignColours(d);
      if (cols <= 3) return 'pass';
      if (cols <= 5) return 'warn';
      return 'fail';
    },
    tip(d) {
      const cols = _countDesignColours(d);
      if (cols <= 3) return `${cols} colour${cols === 1 ? '' : 's'} — within the ideal range.`;
      return `${cols} colours detected. Aim for 3 or fewer for maximum impact.`;
    }
  },
  {
    id: 'notext',
    label: 'No text or seals',
    check(d) {
      return d.emblems.some(e => e.type === 'text') ? 'warn' : 'pass';
    },
    tip(d) {
      return d.emblems.some(e => e.type === 'text')
        ? 'Text is hard to read at small sizes. Consider a symbol instead.'
        : 'No text — great for legibility at any size.';
    }
  },
  {
    id: 'distinctive',
    label: 'Distinctive design',
    check(d) {
      if (d.layers.length === 0 && d.emblems.length === 0) return 'fail';
      if (d.emblems.length > 0) return 'pass';
      return 'warn';
    },
    tip(d) {
      if (d.layers.length === 0 && d.emblems.length === 0) return 'Blank flag — add some design!';
      if (d.emblems.length > 0) return 'Has a charge/symbol — helps make it distinctive.';
      return 'Only stripes — consider adding a symbol or charge.';
    }
  },
  {
    id: 'contrast',
    label: 'Good colour contrast',
    check(d) {
      // Check if any adjacent bands have low contrast
      for (const layer of d.layers) {
        if (layer.bands && layer.bands.length >= 2) {
          for (let i = 0; i < layer.bands.length - 1; i++) {
            if (_lowContrast(layer.bands[i].color, layer.bands[i+1].color)) return 'warn';
          }
        }
      }
      return 'pass';
    },
    tip(d) {
      return 'Adjacent colours should contrast well for visibility.';
    }
  }
];

function _countDesignColours(d) {
  const cols = new Set();
  d.layers.forEach(l => {
    if (l.bands) l.bands.forEach(b => cols.add(b.color.toLowerCase()));
    if (l.color) cols.add(l.color.toLowerCase());
  });
  d.emblems.forEach(e => { if (e.fg) cols.add(e.fg.toLowerCase()); });
  return cols.size;
}

function _lowContrast(hex1, hex2) {
  const lum = h => {
    const r = parseInt(h.slice(1,3),16)/255, g = parseInt(h.slice(3,5),16)/255, b = parseInt(h.slice(5,7),16)/255;
    return 0.299*r + 0.587*g + 0.114*b;
  };
  return Math.abs(lum(hex1) - lum(hex2)) < 0.12;
}

function updateVexChecker() {
  const items = document.getElementById('vex-checker-items');
  const score = document.getElementById('vex-checker-score');
  if (!items || !score) return;

  const results = VEX_RULES.map(rule => ({
    rule,
    status: rule.check(design),
    tip: rule.tip(design)
  }));

  const passes = results.filter(r => r.status === 'pass').length;
  const total  = results.length;
  const pct    = Math.round(passes / total * 100);
  score.textContent = `${passes}/${total}`;
  score.className = 'vex-score ' + (passes === total ? 'good' : passes >= total - 1 ? 'ok' : 'poor');

  items.innerHTML = '';
  results.forEach(({ status, tip }) => {
    const row = document.createElement('div');
    row.className = 'vex-item';
    const dot = document.createElement('span');
    dot.className = `vex-dot ${status}`;
    const txt = document.createElement('span');
    txt.textContent = tip;
    row.appendChild(dot);
    row.appendChild(txt);
    items.appendChild(row);
  });
}


function bindVexChecker() {
  const toggle = document.getElementById('vex-checker-toggle');
  const body   = document.getElementById('vex-checker-body');
  if (!toggle || !body) return;
  toggle.addEventListener('click', () => {
    const open = !body.classList.contains('hidden');
    body.classList.toggle('hidden', open);
    toggle.classList.toggle('open', !open);
    if (!open) updateVexChecker();
  });
}

// ============================================================
// FLAG TEMPLATES
// ============================================================

const FLAG_TEMPLATES = [
  {
    name: 'Blank Canvas',
    design: () => ({ ...newDesign(), flagShape: 'rect32', layers: [{ id: uuid(), type:'hstripes', visible:true, expanded:false, bands:[{color:'#ffffff',weight:1}] }], emblems: [] })
  },
  {
    name: 'Tricolour H',
    design: () => ({ ...newDesign(), flagShape: 'rect32', layers: [{ id: uuid(), type:'hstripes', visible:true, expanded:false, bands:[{color:'#c0392b',weight:1},{color:'#ffffff',weight:1},{color:'#2c3e50',weight:1}] }], emblems: [] })
  },
  {
    name: 'Tricolour V',
    design: () => ({ ...newDesign(), flagShape: 'rect32', layers: [{ id: uuid(), type:'vstripes', visible:true, expanded:false, bands:[{color:'#003082',weight:1},{color:'#ffffff',weight:1},{color:'#c0392b',weight:1}] }], emblems: [] })
  },
  {
    name: 'Nordic Cross',
    design: () => ({ ...newDesign(), flagShape: 'rect32', layers: [
      { id: uuid(), type:'hstripes', visible:true, expanded:false, bands:[{color:'#006AA7',weight:1}] },
      { id: uuid(), type:'overlay',  visible:true, expanded:false, shape:'nordic', color:'#FECC02', opacity:100, params:{thickness:28,offset:35} }
    ], emblems: [] })
  },
  {
    name: 'Saltire',
    design: () => ({ ...newDesign(), flagShape: 'rect32', layers: [
      { id: uuid(), type:'hstripes', visible:true, expanded:false, bands:[{color:'#003078',weight:1}] },
      { id: uuid(), type:'overlay',  visible:true, expanded:false, shape:'saltire', color:'#ffffff', opacity:100, params:{thickness:14} }
    ], emblems: [] })
  },
  {
    name: 'Cross',
    design: () => ({ ...newDesign(), flagShape: 'rect32', layers: [
      { id: uuid(), type:'hstripes', visible:true, expanded:false, bands:[{color:'#ffffff',weight:1}] },
      { id: uuid(), type:'overlay',  visible:true, expanded:false, shape:'cross', color:'#c0392b', opacity:100, params:{thickness:28} }
    ], emblems: [] })
  },
  {
    name: 'Chevron',
    design: () => ({ ...newDesign(), flagShape: 'rect32', layers: [
      { id: uuid(), type:'hstripes', visible:true, expanded:false, bands:[{color:'#009b3a',weight:1},{color:'#ffd700',weight:1}] },
      { id: uuid(), type:'overlay',  visible:true, expanded:false, shape:'chevron', color:'#003087', opacity:100, params:{depth:42,thickness:30} }
    ], emblems: [] })
  },
  {
    name: 'Left Triangle',
    design: () => ({ ...newDesign(), flagShape: 'rect32', layers: [
      { id: uuid(), type:'hstripes', visible:true, expanded:false, bands:[{color:'#c0392b',weight:1},{color:'#ffffff',weight:1}] },
      { id: uuid(), type:'overlay',  visible:true, expanded:false, shape:'triangle', color:'#003087', opacity:100, params:{depth:40,side:0} }
    ], emblems: [] })
  },
  {
    name: 'Quartered',
    design: () => ({ ...newDesign(), flagShape: 'rect32', layers: [
      { id: uuid(), type:'vstripes', visible:true, expanded:false, bands:[{color:'#c0392b',weight:1},{color:'#003087',weight:1}] },
      { id: uuid(), type:'overlay',  visible:true, expanded:false, shape:'cross', color:'#ffffff', opacity:100, params:{thickness:12} }
    ], emblems: [] })
  },
  {
    name: 'Canton',
    design: () => ({ ...newDesign(), flagShape: 'rect32', layers: [
      { id: uuid(), type:'hstripes', visible:true, expanded:false, bands:[{color:'#c0392b',weight:1}] },
      { id: uuid(), type:'overlay',  visible:true, expanded:false, shape:'canton', color:'#003087', opacity:100, params:{width:33,height:50} }
    ], emblems: [] })
  },
  {
    name: 'Border',
    design: () => ({ ...newDesign(), flagShape: 'rect32', layers: [
      { id: uuid(), type:'hstripes', visible:true, expanded:false, bands:[{color:'#ffd700',weight:1}] },
      { id: uuid(), type:'overlay',  visible:true, expanded:false, shape:'border', color:'#003087', opacity:100, params:{thickness:20} }
    ], emblems: [] })
  },
  {
    name: 'Diagonal Split',
    design: () => ({ ...newDesign(), flagShape: 'rect32', layers: [
      { id: uuid(), type:'hstripes', visible:true, expanded:false, bands:[{color:'#c0392b',weight:1}] },
      { id: uuid(), type:'overlay',  visible:true, expanded:false, shape:'triangle', color:'#003087', opacity:100, params:{depth:100,side:0} }
    ], emblems: [] })
  }
];

function buildTemplatesGrid() {
  const grid = document.getElementById('templates-grid');
  if (!grid) return;
  grid.innerHTML = '';
  FLAG_TEMPLATES.forEach((tpl, i) => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.title = tpl.name;

    // Generate thumbnail
    const d = tpl.design();
    const thumb = makeThumbnail(d, 140, 93);
    thumb.style.cssText = 'display:block;width:100%;height:auto;border-radius:4px 4px 0 0;';
    card.appendChild(thumb);

    const lbl = document.createElement('div');
    lbl.className = 'template-card-label';
    lbl.textContent = tpl.name;
    card.appendChild(lbl);

    card.addEventListener('click', () => {
      if (design.layers.length > 0 || design.emblems.length > 0) {
        if (!confirm(`Load "${tpl.name}"? Your current design will be replaced.`)) return;
      }
      design = tpl.design();
      design.name = tpl.name;
      selectedEmblemId = null;
      _multiSelect.clear();
      _commitChange();
      document.getElementById('templates-modal').classList.add('hidden');
    });

    grid.appendChild(card);
  });
}

function bindTemplatesModal() {
  const btn   = document.getElementById('btn-templates');
  const modal = document.getElementById('templates-modal');
  const close = document.getElementById('templates-close');
  if (!btn || !modal) return;

  btn.addEventListener('click', () => {
    buildTemplatesGrid();
    modal.classList.remove('hidden');
  });
  if (close) close.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
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
    if (r.width === 0) {
      // mobile: button is hidden — centre the picker below the header
      pop.style.left      = '50%';
      pop.style.right     = 'auto';
      pop.style.top       = '50px';
      pop.style.transform = 'translateX(-50%)';
    } else {
      pop.style.right     = (window.innerWidth - r.right) + 'px';
      pop.style.top       = (r.bottom + 6) + 'px';
      pop.style.left      = 'auto';
      pop.style.transform = '';
    }
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

function randomFlag() {
  const numBands = 2 + Math.floor(Math.random() * 3);
  const isV      = Math.random() < 0.35;
  const pal      = PALETTES[Math.floor(Math.random() * PALETTES.length)];
  const cols     = [...pal.colors].sort(() => Math.random() - 0.5);

  const bands = Array.from({ length: numBands }, (_, i) => ({
    color: cols[i % cols.length], weight: 1
  }));

  const layers = [{ id: uuid(), type: isV ? 'vstripes' : 'hstripes', visible: true, expanded: false, bands }];

  if (Math.random() < 0.55) {
    const opts = [
      { shape: 'cross',    params: { thickness: 10 + Math.floor(Math.random() * 25) } },
      { shape: 'nordic',   params: { thickness: 25 + Math.floor(Math.random() * 20), offset: 30 + Math.floor(Math.random() * 20) } },
      { shape: 'saltire',  params: { thickness: 10 + Math.floor(Math.random() * 20) } },
      { shape: 'chevron',  params: { depth: 30 + Math.floor(Math.random() * 30), thickness: 20 + Math.floor(Math.random() * 25) } },
      { shape: 'triangle', params: { depth: 30 + Math.floor(Math.random() * 50), side: 0 } },
      { shape: 'canton',   params: { width: 28 + Math.floor(Math.random() * 15), height: 40 + Math.floor(Math.random() * 20) } },
    ];
    const pick = opts[Math.floor(Math.random() * opts.length)];
    const overlayColor = cols.find(c => c !== bands[0].color) || '#ffffff';
    layers.push({ id: uuid(), type: 'overlay', shape: pick.shape, color: overlayColor, opacity: 100, visible: true, expanded: false, params: pick.params });
  }

  design = newDesign();
  design.layers = layers;
  design.emblems = [];
  design.name = 'Random Flag';
  designNameEl.value = design.name;
  pushHistory();
  renderAll();
  autoSaveCurrentDesign();
  showToast('New random flag!', 'success');
}

function bindRandomFlag() {
  const btn = document.getElementById('btn-random');
  if (btn) btn.addEventListener('click', randomFlag);
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
