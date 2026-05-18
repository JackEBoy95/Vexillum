// ============================================================
// VEXILLUM — Colour Palettes
// Curated sets of colours that work well together in flags
// ============================================================

const PALETTES = [
  {
    id: 'heraldic',
    name: 'Heraldic Tinctures',
    colors: [
      { hex: '#C8102E', name: 'Gules' },
      { hex: '#003087', name: 'Azure' },
      { hex: '#005C2E', name: 'Vert' },
      { hex: '#1C1C1C', name: 'Sable' },
      { hex: '#FFD700', name: 'Or' },
      { hex: '#FFFFFF', name: 'Argent' },
      { hex: '#6B2D8B', name: 'Purpure' },
      { hex: '#C46210', name: 'Tenné' },
      { hex: '#808080', name: 'Cendrée' },
      { hex: '#5B92C8', name: 'Bleu Celeste' },
    ]
  },
  {
    id: 'nordic',
    name: 'Nordic',
    colors: [
      { hex: '#003580', name: 'Deep Navy' },
      { hex: '#C60C30', name: 'Scarlet' },
      { hex: '#FFFFFF', name: 'White' },
      { hex: '#FECC02', name: 'Gold' },
      { hex: '#006AA7', name: 'Swedish Blue' },
      { hex: '#003897', name: 'Finnish Blue' },
      { hex: '#EF2B2D', name: 'Nordic Red' },
      { hex: '#002868', name: 'Midnight' },
      { hex: '#F0F0F0', name: 'Ice' },
      { hex: '#D4A017', name: 'Amber' },
    ]
  },
  {
    id: 'pan-african',
    name: 'Pan-African',
    colors: [
      { hex: '#009A44', name: 'African Green' },
      { hex: '#FCD116', name: 'Gold' },
      { hex: '#CE1126', name: 'Red' },
      { hex: '#1C1C1C', name: 'Black' },
      { hex: '#006400', name: 'Forest' },
      { hex: '#FF8C00', name: 'Orange' },
      { hex: '#8B0000', name: 'Dark Red' },
      { hex: '#FFFFFF', name: 'White' },
      { hex: '#4169E1', name: 'Royal Blue' },
      { hex: '#FFE066', name: 'Light Gold' },
    ]
  },
  {
    id: 'islamic',
    name: 'Islamic',
    colors: [
      { hex: '#006600', name: 'Emerald' },
      { hex: '#FFFFFF', name: 'White' },
      { hex: '#C8102E', name: 'Red' },
      { hex: '#FFD700', name: 'Gold' },
      { hex: '#1C1C1C', name: 'Black' },
      { hex: '#003087', name: 'Royal Blue' },
      { hex: '#228B22', name: 'Forest' },
      { hex: '#9B59B6', name: 'Purple' },
      { hex: '#E8D5B0', name: 'Sand' },
      { hex: '#C0AB8E', name: 'Desert' },
    ]
  },
  {
    id: 'east-asian',
    name: 'East Asian',
    colors: [
      { hex: '#DE2910', name: 'China Red' },
      { hex: '#FFDE00', name: 'Imperial Yellow' },
      { hex: '#003153', name: 'Navy' },
      { hex: '#FFFFFF', name: 'White' },
      { hex: '#1C1C1C', name: 'Black' },
      { hex: '#4CAF50', name: 'Jade' },
      { hex: '#FF6B35', name: 'Vermillion' },
      { hex: '#D4AF37', name: 'Antique Gold' },
      { hex: '#2E86AB', name: 'Sky Blue' },
      { hex: '#800020', name: 'Burgundy' },
    ]
  },
  {
    id: 'natural',
    name: 'Natural',
    colors: [
      { hex: '#228B22', name: 'Forest' },
      { hex: '#8B4513', name: 'Earth' },
      { hex: '#87CEEB', name: 'Sky' },
      { hex: '#DEB887', name: 'Sand' },
      { hex: '#2F4F4F', name: 'Pine' },
      { hex: '#4682B4', name: 'Ocean' },
      { hex: '#F4A460', name: 'Clay' },
      { hex: '#9ACD32', name: 'Meadow' },
      { hex: '#FFFACD', name: 'Cream' },
      { hex: '#A0522D', name: 'Sienna' },
    ]
  },
  {
    id: 'bold',
    name: 'Bold & Modern',
    colors: [
      { hex: '#E53935', name: 'Red' },
      { hex: '#1E88E5', name: 'Blue' },
      { hex: '#43A047', name: 'Green' },
      { hex: '#FFB300', name: 'Amber' },
      { hex: '#8E24AA', name: 'Purple' },
      { hex: '#FB8C00', name: 'Orange' },
      { hex: '#00ACC1', name: 'Teal' },
      { hex: '#F06292', name: 'Pink' },
      { hex: '#1C1C1C', name: 'Black' },
      { hex: '#FFFFFF', name: 'White' },
    ]
  },
  {
    id: 'slavic',
    name: 'Slavic',
    colors: [
      { hex: '#D52B1E', name: 'Red' },
      { hex: '#003DA5', name: 'Blue' },
      { hex: '#FFFFFF', name: 'White' },
      { hex: '#FFD700', name: 'Gold' },
      { hex: '#1C1C1C', name: 'Black' },
      { hex: '#006400', name: 'Green' },
      { hex: '#8B0000', name: 'Dark Red' },
      { hex: '#C0C0C0', name: 'Silver' },
      { hex: '#FF8C00', name: 'Orange' },
      { hex: '#4B0082', name: 'Indigo' },
    ]
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    colors: [
      { hex: '#C0392B', name: 'Terracotta' },
      { hex: '#2471A3', name: 'Aegean Blue' },
      { hex: '#FFFFFF', name: 'White' },
      { hex: '#D4AC0D', name: 'Gold' },
      { hex: '#196F3D', name: 'Olive Green' },
      { hex: '#F0B27A', name: 'Sand' },
      { hex: '#1A5276', name: 'Deep Sea' },
      { hex: '#922B21', name: 'Pompeii' },
      { hex: '#F7DC6F', name: 'Lemon' },
      { hex: '#117A65', name: 'Teal' },
    ]
  },
  {
    id: 'oceanic',
    name: 'Oceanic',
    colors: [
      { hex: '#0E6655', name: 'Deep Teal' },
      { hex: '#1A5276', name: 'Navy' },
      { hex: '#76D7C4', name: 'Aquamarine' },
      { hex: '#F0E68C', name: 'Sand' },
      { hex: '#FFFFFF', name: 'White' },
      { hex: '#27AE60', name: 'Seagrass' },
      { hex: '#2980B9', name: 'Pacific' },
      { hex: '#F39C12', name: 'Coral Gold' },
      { hex: '#154360', name: 'Abyss' },
      { hex: '#ABEBC6', name: 'Seafoam' },
    ]
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: [
      { hex: '#F1948A', name: 'Rose' },
      { hex: '#85C1E9', name: 'Sky' },
      { hex: '#82E0AA', name: 'Mint' },
      { hex: '#F8C471', name: 'Peach' },
      { hex: '#C39BD3', name: 'Lavender' },
      { hex: '#FDFEFE', name: 'White' },
      { hex: '#A9CCE3', name: 'Powder Blue' },
      { hex: '#F9E79F', name: 'Butter' },
      { hex: '#A8D5A2', name: 'Sage' },
      { hex: '#FADADD', name: 'Blush' },
    ]
  },
  {
    id: 'dark-heraldic',
    name: 'Dark Heraldic',
    colors: [
      { hex: '#7B0000', name: 'Crimson' },
      { hex: '#00204A', name: 'Midnight' },
      { hex: '#1A3D00', name: 'Forest' },
      { hex: '#B8860B', name: 'Dark Gold' },
      { hex: '#1C1C1C', name: 'Sable' },
      { hex: '#C0C0C0', name: 'Silver' },
      { hex: '#4B0082', name: 'Indigo' },
      { hex: '#8B4513', name: 'Bronze' },
      { hex: '#F5F5DC', name: 'Bone' },
      { hex: '#2F4F2F', name: 'Hunter' },
    ]
  },
  {
    id: 'latin-american',
    name: 'Latin American',
    colors: [
      { hex: '#C0392B', name: 'Red' },
      { hex: '#27AE60', name: 'Green' },
      { hex: '#F1C40F', name: 'Yellow' },
      { hex: '#2C3E50', name: 'Navy' },
      { hex: '#FFFFFF', name: 'White' },
      { hex: '#E67E22', name: 'Orange' },
      { hex: '#8E44AD', name: 'Purple' },
      { hex: '#1ABC9C', name: 'Teal' },
      { hex: '#2980B9', name: 'Blue' },
      { hex: '#D35400', name: 'Burnt Orange' },
    ]
  },
];

// Default active palette index
let activePaletteIdx = 0;

function getActivePalette() {
  return PALETTES[activePaletteIdx];
}

function setActivePalette(idx) {
  activePaletteIdx = idx;
  // Refresh any open pickers
  document.querySelectorAll('.cp-chips').forEach(el => refreshPickerChips(el));
}

function refreshPickerChips(chipsEl) {
  const palette = getActivePalette();
  const chips = chipsEl.querySelectorAll('.cp-chip[data-idx]');
  chips.forEach((chip, i) => {
    const col = palette.colors[i];
    if (col) {
      chip.style.background = col.hex;
      chip.title = col.name;
      chip.dataset.hex = col.hex;
    }
  });
}
