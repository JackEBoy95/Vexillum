// ============================================================
// VEXILLUM — Icon Library
// All icons from game-icons.net (CC BY 3.0)
// Attribution: Lorc, Delapouite, and other contributors
// SVG data is inlined via icon-data.js — no fetch() needed
// ============================================================

const FREE_ICONS = [
  // ---- Plants & Trees ----
  { slug: 'pine-tree',       label: 'Pine Tree',        category: 'Plants'    },
  { slug: 'palm-tree',       label: 'Palm Tree',        category: 'Plants'    },
  { slug: 'coconut-palm',    label: 'Coconut Palm',     category: 'Plants'    },
  { slug: 'evergreen-tree',  label: 'Evergreen',        category: 'Plants'    },
  { slug: 'olive-branch',    label: 'Olive Branch',     category: 'Plants'    },
  { slug: 'laurels',         label: 'Laurel Wreath',    category: 'Plants'    },
  { slug: 'maple-leaf',      label: 'Maple Leaf',       category: 'Plants'    },
  { slug: 'oak-leaf',        label: 'Oak Leaf',         category: 'Plants'    },
  { slug: 'oak-seed',        label: 'Acorn',            category: 'Plants'    },
  { slug: 'chestnut-leaf',   label: 'Chestnut Leaf',    category: 'Plants'    },
  { slug: 'grapevine',       label: 'Grapevine',        category: 'Plants'    },
  { slug: 'wheat',           label: 'Wheat Sheaf',      category: 'Plants'    },
  { slug: 'corn',            label: 'Corn',             category: 'Plants'    },
  { slug: 'sunflower',       label: 'Sunflower',        category: 'Plants'    },
  { slug: 'rose',            label: 'Rose',             category: 'Plants'    },
  { slug: 'tulip',           label: 'Tulip',            category: 'Plants'    },
  { slug: 'lily',            label: 'Lily',             category: 'Plants'    },
  { slug: 'lotus',           label: 'Lotus',            category: 'Plants'    },
  { slug: 'thistle',         label: 'Thistle',          category: 'Plants'    },
  { slug: 'shamrock',        label: 'Shamrock',         category: 'Plants'    },
  { slug: 'clover',          label: 'Clover',           category: 'Plants'    },
  { slug: 'fern',            label: 'Fern',             category: 'Plants'    },
  { slug: 'bamboo',          label: 'Bamboo',           category: 'Plants'    },
  { slug: 'cactus',          label: 'Cactus',           category: 'Plants'    },
  { slug: 'vine',            label: 'Vine',             category: 'Plants'    },
  { slug: 'hemp-leaf',       label: 'Hemp Leaf',        category: 'Plants'    },
  { slug: 'two-feathers',    label: 'Feathers',         category: 'Plants'    },

  // ---- Animals ----
  { slug: 'lion',            label: 'Lion (Rampant)',   category: 'Animals'   },
  { slug: 'eagle-emblem',    label: 'Eagle',            category: 'Animals'   },
  { slug: 'double-headed-eagle', label: 'Double Eagle', category: 'Animals'   },
  { slug: 'bear-face',       label: 'Bear',             category: 'Animals'   },
  { slug: 'wolf-head',       label: 'Wolf',             category: 'Animals'   },
  { slug: 'fox-head',        label: 'Fox',              category: 'Animals'   },
  { slug: 'deer-head',       label: 'Stag / Deer',      category: 'Animals'   },
  { slug: 'moose-head',      label: 'Moose',            category: 'Animals'   },
  { slug: 'horse',           label: 'Horse',            category: 'Animals'   },
  { slug: 'horse-head',      label: 'Horse Head',       category: 'Animals'   },
  { slug: 'bull-horns',      label: 'Bull',             category: 'Animals'   },
  { slug: 'ram-head',        label: 'Ram',              category: 'Animals'   },
  { slug: 'ram',             label: 'Ram (Full)',        category: 'Animals'   },
  { slug: 'goat-head',       label: 'Goat',             category: 'Animals'   },
  { slug: 'boar',            label: 'Boar',             category: 'Animals'   },
  { slug: 'elephant',        label: 'Elephant',         category: 'Animals'   },
  { slug: 'camel',           label: 'Camel',            category: 'Animals'   },
  { slug: 'tiger-head',      label: 'Tiger',            category: 'Animals'   },
  { slug: 'leopard',         label: 'Leopard',          category: 'Animals'   },
  { slug: 'panther',         label: 'Panther',          category: 'Animals'   },
  { slug: 'panther-head',    label: 'Panther Head',     category: 'Animals'   },
  { slug: 'dragon-head',     label: 'Dragon',           category: 'Animals'   },
  { slug: 'griffin',         label: 'Griffin',          category: 'Animals'   },
  { slug: 'phoenix',         label: 'Phoenix',          category: 'Animals'   },
  { slug: 'thunderbird',     label: 'Thunderbird',      category: 'Animals'   },
  { slug: 'raven',           label: 'Raven',            category: 'Animals'   },
  { slug: 'dove',            label: 'Dove',             category: 'Animals'   },
  { slug: 'swan',            label: 'Swan',             category: 'Animals'   },
  { slug: 'peacock',         label: 'Peacock',          category: 'Animals'   },
  { slug: 'rooster',         label: 'Rooster',          category: 'Animals'   },
  { slug: 'snake',           label: 'Snake',            category: 'Animals'   },
  { slug: 'turtle',          label: 'Turtle',           category: 'Animals'   },
  { slug: 'dolphin',         label: 'Dolphin',          category: 'Animals'   },
  { slug: 'fish',            label: 'Fish',             category: 'Animals'   },
  { slug: 'salmon',          label: 'Salmon',           category: 'Animals'   },
  { slug: 'whale',           label: 'Whale',            category: 'Animals'   },
  { slug: 'bee',             label: 'Bee',              category: 'Animals'   },
  { slug: 'butterfly',       label: 'Butterfly',        category: 'Animals'   },
  { slug: 'scorpion',        label: 'Scorpion',         category: 'Animals'   },
  { slug: 'spider',          label: 'Spider',           category: 'Animals'   },
  { slug: 'frog',            label: 'Frog',             category: 'Animals'   },
  { slug: 'rabbit',          label: 'Rabbit',           category: 'Animals'   },
  { slug: 'bison',           label: 'Bison',            category: 'Animals'   },
  { slug: 'kangaroo',        label: 'Kangaroo',         category: 'Animals'   },
  { slug: 'paw-print',       label: 'Paw Print',        category: 'Animals'   },

  // ---- Weapons & Military ----
  { slug: 'broadsword',      label: 'Sword',            category: 'Weapons'   },
  { slug: 'crossed-swords',  label: 'Crossed Swords',   category: 'Weapons'   },
  { slug: 'scimitar',        label: 'Scimitar',         category: 'Weapons'   },
  { slug: 'dagger',          label: 'Dagger',           category: 'Weapons'   },
  { slug: 'spear',           label: 'Spear',            category: 'Weapons'   },
  { slug: 'halberd',         label: 'Halberd',          category: 'Weapons'   },
  { slug: 'lance',           label: 'Lance',            category: 'Weapons'   },
  { slug: 'arrow',           label: 'Arrow',            category: 'Weapons'   },
  { slug: 'arrowhead',       label: 'Arrowhead',        category: 'Weapons'   },
  { slug: 'bow-arrow',       label: 'Bow & Arrow',      category: 'Weapons'   },
  { slug: 'crossbow',        label: 'Crossbow',         category: 'Weapons'   },
  { slug: 'quiver',          label: 'Quiver',           category: 'Weapons'   },
  { slug: 'axe',             label: 'Axe',              category: 'Weapons'   },
  { slug: 'battle-axe',      label: 'Battle Axe',       category: 'Weapons'   },
  { slug: 'war-hammer',      label: 'War Hammer',       category: 'Weapons'   },
  { slug: 'mace',            label: 'Mace',             category: 'Weapons'   },
  { slug: 'morning-star',    label: 'Morning Star',     category: 'Weapons'   },
  { slug: 'flail',           label: 'Flail',            category: 'Weapons'   },
  { slug: 'trident',         label: 'Trident',          category: 'Weapons'   },
  { slug: 'shield',          label: 'Shield',           category: 'Weapons'   },
  { slug: 'heraldic-shield', label: 'Heraldic Shield',  category: 'Weapons'   },
  { slug: 'round-shield',    label: 'Round Shield',     category: 'Weapons'   },
  { slug: 'knight-helmet',   label: 'Knight Helmet',    category: 'Weapons'   },
  { slug: 'cannon',          label: 'Cannon',           category: 'Weapons'   },
  { slug: 'cannon-shot',     label: 'Cannon Shot',      category: 'Weapons'   },
  { slug: 'cannonball',      label: 'Cannonball',       category: 'Weapons'   },
  { slug: 'musket',          label: 'Musket',           category: 'Weapons'   },
  { slug: 'bayonet',         label: 'Bayonet',          category: 'Weapons'   },
  { slug: 'bomb-explosion',  label: 'Bomb',             category: 'Weapons'   },
  { slug: 'fortress',        label: 'Fortress',         category: 'Weapons'   },

  // ---- Celestial ----
  { slug: 'sun-symbol',      label: 'Sun',              category: 'Celestial' },
  { slug: 'sun',             label: 'Sun (Radiant)',    category: 'Celestial' },
  { slug: 'sun-face',        label: 'Sun with Face',    category: 'Celestial' },
  { slug: 'sunburst',        label: 'Sunburst',         category: 'Celestial' },
  { slug: 'rising-sun',      label: 'Rising Sun',       category: 'Celestial' },
  { slug: 'crescent-moon',   label: 'Crescent Moon',    category: 'Celestial' },
  { slug: 'star',            label: 'Star (5-point)',   category: 'Celestial' },
  { slug: '6-pointed-star',  label: 'Star (6-point)',   category: 'Celestial' },
  { slug: '8-pointed-star',  label: 'Star (8-point)',   category: 'Celestial' },
  { slug: 'starburst',       label: 'Starburst',        category: 'Celestial' },
  { slug: 'heraldic-star',   label: 'Mullet (Heraldic)',category: 'Celestial' },
  { slug: 'estoile',         label: 'Estoile',          category: 'Celestial' },
  { slug: 'southern-cross',  label: 'Southern Cross',   category: 'Celestial' },
  { slug: 'compass-rose',    label: 'Compass Rose',     category: 'Celestial' },
  { slug: 'comet',           label: 'Comet',            category: 'Celestial' },
  { slug: 'galaxy',          label: 'Galaxy',           category: 'Celestial' },
  { slug: 'lightning-bolt',  label: 'Lightning Bolt',   category: 'Celestial' },
  { slug: 'thunderbolt',     label: 'Thunderbolt',      category: 'Celestial' },
  { slug: 'cloud',           label: 'Cloud',            category: 'Celestial' },
  { slug: 'snowflake',       label: 'Snowflake',        category: 'Celestial' },
  { slug: 'mountain-road',   label: 'Mountain',         category: 'Celestial' },
  { slug: 'wave-crest',      label: 'Wave',             category: 'Celestial' },
  { slug: 'flame',           label: 'Flame',            category: 'Celestial' },
  { slug: 'spiral',          label: 'Spiral',           category: 'Celestial' },

  // ---- Heraldic Charges ----
  { slug: 'fleur-de-lys',    label: 'Fleur-de-lis',    category: 'Heraldic'  },
  { slug: 'trefoil',         label: 'Trefoil',          category: 'Heraldic'  },
  { slug: 'quatrefoil',      label: 'Quatrefoil',       category: 'Heraldic'  },
  { slug: 'estoile',         label: 'Estoile',          category: 'Heraldic'  },
  { slug: 'lozenge',         label: 'Lozenge',          category: 'Heraldic'  },
  { slug: 'roundel',         label: 'Roundel',          category: 'Heraldic'  },
  { slug: 'annulet',         label: 'Annulet (Ring)',   category: 'Heraldic'  },
  { slug: 'ring',            label: 'Ring',             category: 'Heraldic'  },
  { slug: 'heart',           label: 'Heart',            category: 'Heraldic'  },
  { slug: 'crown',           label: 'Crown',            category: 'Heraldic'  },
  { slug: 'royal-crown',     label: 'Royal Crown',      category: 'Heraldic'  },
  { slug: 'cross-of-jerusalem', label: 'Jerusalem Cross', category: 'Heraldic'},
  { slug: 'maltese-cross',   label: 'Maltese Cross',    category: 'Heraldic'  },
  { slug: 'cross-patty',     label: 'Cross Patty',      category: 'Heraldic'  },
  { slug: 'solar-cross',     label: 'Solar Cross',      category: 'Heraldic'  },
  { slug: 'hexagram',        label: 'Hexagram',         category: 'Heraldic'  },
  { slug: 'pentacle',        label: 'Pentagram',        category: 'Heraldic'  },
  { slug: 'ermine',          label: 'Ermine Spot',      category: 'Heraldic'  },
  { slug: 'teardrop',        label: 'Teardrop',         category: 'Heraldic'  },
  { slug: 'omega',           label: 'Omega',            category: 'Heraldic'  },
  { slug: 'zigzag',          label: 'Zigzag',           category: 'Heraldic'  },

  // ---- Crowns & People ----
  { slug: 'crowned-skull',   label: 'Crown & Skull',    category: 'People'    },
  { slug: 'crowned-heart',   label: 'Crown & Heart',    category: 'People'    },
  { slug: 'skull',           label: 'Skull',            category: 'People'    },
  { slug: 'hand',            label: 'Open Hand',        category: 'People'    },
  { slug: 'fist',            label: 'Fist',             category: 'People'    },
  { slug: 'wing',            label: 'Wing',             category: 'People'    },
  { slug: 'feathered-wing',  label: 'Feathered Wing',   category: 'People'    },
  { slug: 'angel-wings',     label: 'Angel Wings',      category: 'People'    },
  { slug: 'all-seeing-eye',  label: 'All-Seeing Eye',   category: 'People'    },
  { slug: 'bleeding-eye',    label: 'Eye',              category: 'People'    },
  { slug: 'halo',            label: 'Halo',             category: 'People'    },
  { slug: 'mermaid',         label: 'Mermaid',          category: 'People'    },
  { slug: 'centaur',         label: 'Centaur',          category: 'People'    },
  { slug: 'harpy',           label: 'Harpy',            category: 'People'    },
  { slug: 'paw-print',       label: 'Paw Print',        category: 'People'    },

  // ---- Tools & Buildings ----
  { slug: 'anchor',          label: 'Anchor',           category: 'Tools'     },
  { slug: 'key',             label: 'Key',              category: 'Tools'     },
  { slug: 'padlock',         label: 'Padlock',          category: 'Tools'     },
  { slug: 'chain',           label: 'Chain',            category: 'Tools'     },
  { slug: 'wagon-wheel',     label: 'Wheel',            category: 'Tools'     },
  { slug: 'gears',           label: 'Gears',            category: 'Tools'     },
  { slug: 'hammer',          label: 'Hammer',           category: 'Tools'     },
  { slug: 'sickle',          label: 'Sickle',           category: 'Tools'     },
  { slug: 'hammer-sickle',   label: 'Hammer & Sickle',  category: 'Tools'     },
  { slug: 'pickaxe',         label: 'Pickaxe',          category: 'Tools'     },
  { slug: 'shovel',          label: 'Shovel',           category: 'Tools'     },
  { slug: 'anvil',           label: 'Anvil',            category: 'Tools'     },
  { slug: 'torch',           label: 'Torch',            category: 'Tools'     },
  { slug: 'lantern',         label: 'Lantern',          category: 'Tools'     },
  { slug: 'bell',            label: 'Bell',             category: 'Tools'     },
  { slug: 'open-book',       label: 'Book',             category: 'Tools'     },
  { slug: 'scroll',          label: 'Scroll',           category: 'Tools'     },
  { slug: 'castle',          label: 'Castle',           category: 'Tools'     },
  { slug: 'fortress',        label: 'Fortress',         category: 'Tools'     },
  { slug: 'lighthouse',      label: 'Lighthouse',       category: 'Tools'     },
  { slug: 'church',          label: 'Church',           category: 'Tools'     },
  { slug: 'mosque',          label: 'Mosque',           category: 'Tools'     },
  { slug: 'bridge',          label: 'Bridge',           category: 'Tools'     },
  { slug: 'fire-bowl',       label: 'Fire Bowl',        category: 'Tools'     },
  { slug: 'oil-derrick',     label: 'Oil Derrick',      category: 'Tools'     },
  { slug: 'industrial-city', label: 'Factory',          category: 'Tools'     },

  // ---- Mythical & Symbolic ----
  { slug: 'triskelion',      label: 'Triskelion',       category: 'Symbolic'  },
  { slug: 'ouroboros',       label: 'Ouroboros',        category: 'Symbolic'  },
  { slug: 'tree-of-life',    label: 'Tree of Life',     category: 'Symbolic'  },
  { slug: 'labyrinth',       label: 'Labyrinth',        category: 'Symbolic'  },
  { slug: 'winged-circle',   label: 'Winged Sun Disk',  category: 'Symbolic'  },
  { slug: 'scarab',          label: 'Scarab',           category: 'Symbolic'  },
  { slug: 'ankh',            label: 'Ankh',             category: 'Symbolic'  },
  { slug: 'eye-of-horus',    label: 'Eye of Horus',     category: 'Symbolic'  },
  { slug: 'yin-yang',        label: 'Yin-Yang',         category: 'Symbolic'  },
  { slug: 'dharma-wheel',    label: 'Dharma Wheel',     category: 'Symbolic'  },
  { slug: 'celtic-knot',     label: 'Celtic Knot',      category: 'Symbolic'  },
  { slug: 'infinity',        label: 'Infinity',         category: 'Symbolic'  },
  { slug: 'spiderweb',       label: 'Spiderweb',        category: 'Symbolic'  },
  { slug: 'halo',            label: 'Nimbus',           category: 'Symbolic'  },
  { slug: 'pentacle',        label: 'Pentacle',         category: 'Symbolic'  },
  { slug: 'hexagram',        label: 'Hexagram',         category: 'Symbolic'  },
  { slug: 'solar-cross',     label: 'Solar Cross',      category: 'Symbolic'  },
];

// Deduplicate by slug (some icons appear in multiple categories above)
const _seen = new Set();
const ICON_LIST = FREE_ICONS.filter(i => {
  if (_seen.has(i.slug)) return false;
  _seen.add(i.slug);
  return true;
});

const CATEGORIES = ['All', ...new Set(ICON_LIST.map(i => i.category))];

// Synchronous lookup — no fetch needed, everything is inlined in ICON_DATA
function getIconSvg(slug) {
  return ICON_DATA[slug] || null;
}

// Recolour an SVG string: replace fill with fg, optionally add bg rect
function colourIcon(svgStr, fg = '#ffffff', bg = 'transparent') {
  let svg = svgStr
    .replace(/fill="[^"]*"/g, '')
    .replace(/fill:[^;"]*/g, '')
    .replace(/<svg/, `<svg fill="${fg}"`);
  if (bg && bg !== 'transparent') {
    svg = svg.replace(/<svg([^>]*)>/, `<svg$1><rect width="100%" height="100%" fill="${bg}"/>`);
  }
  return svg;
}

// Legacy async wrapper (kept for compatibility)
async function fetchIcon(slug) {
  const data = ICON_DATA[slug];
  if (data) return data;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect x="100" y="100" width="312" height="312" fill="currentColor" opacity="0.3" rx="20"/></svg>`;
}
