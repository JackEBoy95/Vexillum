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
  bindHeaderButtons();
  bindIconPanel();
  bindCanvasEvents();
  bindKeyboard();
  renderAll();
  loadIconGrid('All');
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
  // Render top-to-bottom visually = reverse of actual order (first in array = bottom)
  const layers = [...design.layers].reverse();
  layers.forEach(layer => {
    const card = buildLayerCard(layer);
    layerList.appendChild(card);
  });
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

      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.value = band.color;
      colorInput.title = 'Band colour';
      colorInput.addEventListener('input', e => { band.color = e.target.value; onChange(); });

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

      row.appendChild(colorInput);
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
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = layer.color || '#ffffff';
  colorInput.addEventListener('input', e => { layer.color = e.target.value; onChange(); });
  colorRow.appendChild(colorInput);
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

// ============================================================
// ICON PANEL
// ============================================================

let currentCategory = 'All';
let iconSearchQuery = '';

function bindIconPanel() {
  // Category buttons
  const catWrap = document.querySelector('.icon-categories');
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (cat === 'All' ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      currentCategory = cat;
      catWrap.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.textContent === cat));
      loadIconGrid(cat);
    });
    catWrap.appendChild(btn);
  });

  iconSearch.addEventListener('input', e => {
    iconSearchQuery = e.target.value.trim().toLowerCase();
    loadIconGrid(currentCategory);
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
        const coloured = colourIcon(svgStr, '#e8e4dc', 'transparent');
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
    const data = e.dataTransfer.getData('application/vexillum-icon');
    if (!data) return;
    const icon = JSON.parse(data);
    const rect = flagSvg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    placeEmblem(icon, x, y);
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

  // Snap to thirds, quarters, halves
  x = snap(x, [0, 25, 33.3, 50, 66.6, 75, 100]);
  y = snap(y, [0, 25, 33.3, 50, 66.6, 75, 100]);

  emblem.x = Math.max(0, Math.min(100, x));
  emblem.y = Math.max(0, Math.min(100, y));

  // Optimised: just re-render emblems
  const existing = flagSvg.querySelectorAll('.render-emblem');
  existing.forEach(el => el.remove());
  design.emblems.forEach(em => renderEmblemEl(flagSvg, em, em.id === selectedEmblemId));
  updateEmblemControls();
}

function snap(val, targets, threshold = 3) {
  for (const t of targets) {
    if (Math.abs(val - t) < threshold) return t;
  }
  return val;
}

function onEmblemDragEnd() {
  draggingEmblemId = null;
  document.removeEventListener('mousemove', onEmblemDragMove);
  document.removeEventListener('mouseup', onEmblemDragEnd);
  onChange();
}

// ---- Emblem controls bar ----
function updateEmblemControls() {
  const emblem = design.emblems.find(em => em.id === selectedEmblemId);
  if (!emblem) {
    emblemControls.classList.remove('visible');
    return;
  }
  emblemControls.classList.add('visible');

  document.getElementById('ec-size').value = emblem.size;
  document.getElementById('ec-rotate').value = emblem.rotate;
  document.getElementById('ec-fg').value = emblem.fg;
  document.getElementById('ec-bg').value = emblem.bg === 'transparent' ? '#000000' : emblem.bg;
  document.getElementById('ec-bg-transparent').checked = emblem.bg === 'transparent';
}

function bindEmblemControls() {
  document.getElementById('ec-size').addEventListener('input', e => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) { em.size = +e.target.value; renderAll(); }
  });
  document.getElementById('ec-rotate').addEventListener('input', e => {
    const em = design.emblems.find(x => x.id === selectedEmblemId);
    if (em) { em.rotate = +e.target.value; renderAll(); }
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

  bindEmblemControls();
  bindSaveModal();
}

// ============================================================
// KEYBOARD
// ============================================================

function bindKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEmblemId) {
      design.emblems = design.emblems.filter(em => em.id !== selectedEmblemId);
      selectEmblem(null);
    }
    if (e.key === 'Escape') selectEmblem(null);
  });
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

  // Clip rect for clean edges
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `<clipPath id="flag-clip"><rect width="${CANVAS_W}" height="${CANVAS_H}"/></clipPath>`;
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

function loadDesign(saved) {
  design = { ...saved, emblems: saved.emblems || [] };
  // Restore inline SVG content from ICON_DATA
  design.emblems.forEach(em => { em._svgContent = getIconSvg(em.slug); });
  designNameEl.value = design.name;
  selectedEmblemId = null;
  renderAll();
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
