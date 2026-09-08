// Flag data for 50 world countries
// Each entry: slug, name, officialName, category, continent, proportion, adopted, designType,
//             metaDescription, keywords, colors[], svg (900×600 viewBox inner), design{}, breakdown[], history[], ctaHeadline, ctaBody

module.exports = [

  // ── EUROPE ──────────────────────────────────────────────────────────────────

  {
    slug: 'france',
    isoCode: 'fr',
    name: 'France',
    officialName: 'Le Drapeau Tricolore',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '2:3',
    adopted: '1794',
    designType: 'Vertical Tricolour',
    metaDescription: 'The French Tricolore — official blue, white and red hex codes, design breakdown, and history from the Revolution to today.',
    keywords: 'France flag, French Tricolore, bleu blanc rouge, flag colors hex, French flag history',
    colors: [
      { name: 'French Blue', hex: '#002395', pantone: 'Pantone 280 C', usage: 'Hoist stripe' },
      { name: 'White',       hex: '#FFFFFF', pantone: '',              usage: 'Centre stripe' },
      { name: 'French Red',  hex: '#ED2939', pantone: 'Pantone 032 C', usage: 'Fly stripe' },
    ],
    svg: `<rect x="0" y="0" width="300" height="600" fill="#002395"/>
        <rect x="300" y="0" width="300" height="600" fill="#FFFFFF"/>
        <rect x="600" y="0" width="300" height="600" fill="#ED2939"/>`,
    design: {
      name: 'France',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'vstripes', visible: true, expanded: false, bands: [
        { color: '#002395', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#ED2939', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'The French Tricolore is divided into three equal vertical bands of blue, white, and red — a design often called a <strong>tricolour</strong>. Each stripe is precisely one-third of the flag\'s width, giving the flag a clean, geometric simplicity that has influenced flag design worldwide.',
      'In official usage, the blue is rendered as Pantone 280 C (a deep navy) and the red as Pantone 032 C (a vivid scarlet), though a lighter version with Pantone 286 C and 485 C is also used for certain state contexts.',
    ],
    history: [
      'The tricolour emerged during the French Revolution of 1789. The red and blue were the traditional colours of Paris; the white was the Bourbon royal colour. The revolutionary Marquis de Lafayette reportedly combined them into the cockade that became the flag\'s prototype.',
      'The National Convention officially adopted the vertical tricolour on 15 February 1794. Napoleon\'s campaigns spread the tricolour design across Europe, inspiring similar flags in Italy, Belgium, Ireland, and many others.',
      'With brief interruptions during the Restoration (1815–1830), the tricolour has flown continuously as France\'s national flag. The Fifth Republic confirmed it in the 1958 Constitution, and it remains one of the most recognised flags on Earth.',
    ],
    ctaHeadline: 'Design your own Tricolour',
    ctaBody: 'Remix the French flag or build a brand-new vertical tricolour — swap colours, adjust stripe widths, and export in seconds.',
  },

  {
    slug: 'germany',
    isoCode: 'de',
    name: 'Germany',
    officialName: 'Bundesflagge',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '3:5',
    adopted: '1949',
    designType: 'Horizontal Tricolour',
    metaDescription: 'Germany flag — official black, red and gold hex codes, proportions, and the history of the Bundesflagge from the 1848 revolution to the Federal Republic.',
    keywords: 'Germany flag, German flag colors, Bundesflagge, black red gold, German flag history, flag hex codes',
    colors: [
      { name: 'Black', hex: '#000000', pantone: '',              usage: 'Top stripe' },
      { name: 'Red',   hex: '#DD0000', pantone: 'Pantone 485 C', usage: 'Middle stripe' },
      { name: 'Gold',  hex: '#FFCE00', pantone: 'Pantone 116 C', usage: 'Bottom stripe' },
    ],
    svg: `<rect x="0" y="0" width="900" height="200" fill="#000000"/>
        <rect x="0" y="200" width="900" height="200" fill="#DD0000"/>
        <rect x="0" y="400" width="900" height="200" fill="#FFCE00"/>`,
    design: {
      name: 'Germany',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#000000', weight: 1 },
        { color: '#DD0000', weight: 1 },
        { color: '#FFCE00', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Three equal horizontal stripes of black, red, and gold make up the German federal flag. The colours derive from the uniforms of the Lützow Free Corps during the Napoleonic Wars — black coats with red facings and gold buttons.',
      'The proportions are 3:5 (height to width). The federal eagle (Bundesadler) appears on the state flag variant, but the civil flag uses only the tricolour.',
    ],
    history: [
      'Black, red, and gold first flew together during the 1848 Frankfurt Parliament, symbolising liberal German unity. The Weimar Republic adopted the tricolour in 1919, but the Nazi regime replaced it with the swastika flag in 1935.',
      'West Germany re-adopted black-red-gold in 1949 with the founding of the Federal Republic. East Germany used the same colours but added a state emblem 1959–1990. After reunification in 1990, the plain tricolour became the flag of unified Germany.',
    ],
    ctaHeadline: 'Remix the German Tricolour',
    ctaBody: 'Start from the Bundesflagge and customise it — change colours, add overlays, and export your design for free.',
  },

  {
    slug: 'italy',
    isoCode: 'it',
    name: 'Italy',
    officialName: 'Il Tricolore Italiano',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '2:3',
    adopted: '1948',
    designType: 'Vertical Tricolour',
    metaDescription: 'Italy flag — official green, white and red hex codes, design history from Napoleon to the Italian Republic.',
    keywords: 'Italy flag, Italian Tricolore, green white red, Italian flag colors, Risorgimento flag',
    colors: [
      { name: 'Fern Green', hex: '#009246', pantone: 'Pantone 347 C', usage: 'Hoist stripe' },
      { name: 'White',      hex: '#FFFFFF', pantone: '',              usage: 'Centre stripe' },
      { name: 'Flame Red',  hex: '#CE2B37', pantone: 'Pantone 186 C', usage: 'Fly stripe' },
    ],
    svg: `<rect x="0" y="0" width="300" height="600" fill="#009246"/>
        <rect x="300" y="0" width="300" height="600" fill="#FFFFFF"/>
        <rect x="600" y="0" width="300" height="600" fill="#CE2B37"/>`,
    design: {
      name: 'Italy',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'vstripes', visible: true, expanded: false, bands: [
        { color: '#009246', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#CE2B37', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Three equal vertical stripes of green, white, and red form the Italian flag, known as the <strong>Il Tricolore</strong>. The design closely mirrors France\'s but rotates the colour order and swaps blue for green.',
      'The official shades are Pantone 347 C (green) and Pantone 186 C (red). The civil and military flags are identical; a version bearing the coat of arms is used by the President.',
    ],
    history: [
      'The Italian tricolour debuted on 7 January 1797 in Reggio Emilia, adopted by the Cispadane Republic — a Napoleonic client state. The colours were inspired by the French Tricolore, with green substituted for blue, possibly reflecting Milanese civic colours or Napoleon\'s Lombard Legion uniforms.',
      'The flag became the symbol of the Risorgimento — the 19th-century movement for Italian unification. The House of Savoy\'s shield occupied the centre stripe from 1861 to 1946. After the republic was proclaimed in 1948 the plain tricolour was enshrined in the Constitution.',
    ],
    ctaHeadline: 'Design your own Tricolore',
    ctaBody: 'Remix the Italian flag, swap the green for another hue, or build something entirely new in the Quick Flags editor.',
  },

  {
    slug: 'spain',
    isoCode: 'es',
    name: 'Spain',
    officialName: 'La Rojigualda',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '2:3',
    adopted: '1981',
    designType: 'Horizontal Bicolour with Coat of Arms',
    metaDescription: 'Spain flag — official red and yellow hex codes, the history of La Rojigualda, and design breakdown of the Spanish national flag.',
    keywords: 'Spain flag, Spanish flag colors, rojigualda, red yellow flag, Spanish flag history, coat of arms Spain',
    colors: [
      { name: 'Gules Red',     hex: '#AA151B', pantone: 'Pantone 1795 C', usage: 'Top and bottom stripes' },
      { name: 'Golden Yellow', hex: '#F1BF00', pantone: 'Pantone 116 C',  usage: 'Centre stripe (double height)' },
    ],
    svg: `<rect x="0" y="0" width="900" height="150" fill="#AA151B"/>
        <rect x="0" y="150" width="900" height="300" fill="#F1BF00"/>
        <rect x="0" y="450" width="900" height="150" fill="#AA151B"/>`,
    design: {
      name: 'Spain',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#AA151B', weight: 1 },
        { color: '#F1BF00', weight: 2 },
        { color: '#AA151B', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'The Spanish flag — La Rojigualda — has three horizontal stripes: red (top), yellow (middle, double height), and red (bottom). The yellow stripe is twice the height of each red stripe, giving proportions of 1:2:1.',
      'A version of the coat of arms is centred on the yellow stripe, slightly towards the hoist. The civil flag omits the shield. The official red is a deep crimson (Pantone 1795 C) and the gold a bright amber-yellow (Pantone 116 C).',
    ],
    history: [
      'Charles III introduced the distinctive red-and-yellow scheme in 1785 to make Spanish warships identifiable at sea — many nations used the white ensign of the Bourbons, causing confusion. The new "Rojigualda" (red-yellow) stood out from a distance.',
      'The flag has survived various political upheavals — republic, dictatorship, and monarchy — with changes to the shield rather than the colour scheme. The current coat of arms, including the Pillars of Hercules, was adopted in 1981 under the post-Franco constitutional monarchy.',
    ],
    ctaHeadline: 'Remix La Rojigualda',
    ctaBody: 'Start from the Spanish flag — adjust stripe proportions, add an emblem, or experiment with a completely new palette.',
  },

  {
    slug: 'netherlands',
    isoCode: 'nl',
    name: 'Netherlands',
    officialName: 'De Nederlandse Vlag',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '2:3',
    adopted: '1937',
    designType: 'Horizontal Tricolour',
    metaDescription: 'Netherlands flag — official red, white and blue hex codes, history from the Prince\'s Flag to the modern Dutch tricolour.',
    keywords: 'Netherlands flag, Dutch flag, Holland flag, red white blue flag, Nederlandse vlag, Dutch flag history',
    colors: [
      { name: 'Vermilion Red', hex: '#AE1C28', pantone: 'Pantone 186 C', usage: 'Top stripe' },
      { name: 'White',         hex: '#FFFFFF', pantone: '',              usage: 'Middle stripe' },
      { name: 'Cobalt Blue',   hex: '#21468B', pantone: 'Pantone 280 C', usage: 'Bottom stripe' },
    ],
    svg: `<rect x="0" y="0" width="900" height="200" fill="#AE1C28"/>
        <rect x="0" y="200" width="900" height="200" fill="#FFFFFF"/>
        <rect x="0" y="400" width="900" height="200" fill="#21468B"/>`,
    design: {
      name: 'Netherlands',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#AE1C28', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#21468B', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Three equal horizontal bands of red, white, and blue form the Dutch flag. Identical in layout to the French tricolour rotated 90°, the Dutch flag is often distinguished by its deeper, darker blue.',
      'The flag is officially 2:3 in proportion. On the Dutch Liberation Day (5 May), an orange streamer is traditionally attached to the flag in memory of the House of Orange-Nassau.',
    ],
    history: [
      'The Dutch tricolour evolved from the <em>Prinsenvlag</em> (Prince\'s Flag) used by William of Orange during the Dutch Revolt (1572). The original was orange, white, and blue — orange representing the House of Orange. Over time, orange dye faded or was substituted for red, and by the early 17th century red predominated.',
      'A 1937 royal decree formally fixed the colours as red, white, and blue, ending decades of inconsistency between orange and red versions. The Dutch flag influenced France\'s tricolour and countless other flags worldwide, making it one of the most historically significant designs.',
    ],
    ctaHeadline: 'Create your own Horizontal Tricolour',
    ctaBody: 'Use the Netherlands flag as your starting point — adjust the stripe colours, add symbols, and export your design.',
  },

  {
    slug: 'belgium',
    isoCode: 'be',
    name: 'Belgium',
    officialName: 'De Belgische Vlag / Le Drapeau Belge',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '13:15',
    adopted: '1831',
    designType: 'Vertical Tricolour',
    metaDescription: 'Belgium flag — official black, yellow and red hex codes, design history from the 1830 revolution to the modern Belgian state.',
    keywords: 'Belgium flag, Belgian flag colors, black yellow red, drapeau belge, Belgian flag history, Belgian revolution',
    colors: [
      { name: 'Sable Black',  hex: '#000000', pantone: '',              usage: 'Hoist stripe' },
      { name: 'Or Yellow',    hex: '#FAE042', pantone: 'Pantone 109 C', usage: 'Centre stripe' },
      { name: 'Gules Red',    hex: '#EF3340', pantone: 'Pantone 485 C', usage: 'Fly stripe' },
    ],
    svg: `<rect x="0" y="0" width="300" height="600" fill="#000000"/>
        <rect x="300" y="0" width="300" height="600" fill="#FAE042"/>
        <rect x="600" y="0" width="300" height="600" fill="#EF3340"/>`,
    design: {
      name: 'Belgium',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'vstripes', visible: true, expanded: false, bands: [
        { color: '#000000', weight: 1 },
        { color: '#FAE042', weight: 1 },
        { color: '#EF3340', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Belgium\'s flag comprises three equal vertical bands of black, yellow, and red — the colours of the Duchy of Brabant\'s coat of arms: a golden lion with red claws on a black field. The flag is nearly square, with an official 13:15 ratio (slightly taller than wide).',
      'The vertical layout distinguishes Belgium from the Netherlands (horizontal red-white-blue). The colour order runs left to right: black at the hoist, yellow in the centre, red at the fly.',
    ],
    history: [
      'The Belgian Revolution of 1830 ousted Dutch rule. Revolutionaries improvised a cockade and flag from the Duchy of Brabant\'s heraldic colours. The provisional government officially adopted the tricolour on 23 January 1831.',
      'Originally the stripes were horizontal, mirroring the Brabantian tradition. The National Congress rotated them to vertical bands in 1831, distinguishing Belgium from the Netherlands\' horizontal flag and creating the design used today.',
    ],
    ctaHeadline: 'Remix the Belgian Tricolour',
    ctaBody: 'Start from Belgium\'s bold black-yellow-red vertical tricolour and make it your own in the Quick Flags editor.',
  },

  {
    slug: 'sweden',
    isoCode: 'se',
    name: 'Sweden',
    officialName: 'Sveriges Flagga',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '5:8',
    adopted: '1906',
    designType: 'Nordic Cross',
    metaDescription: 'Sweden flag — official blue and yellow hex codes, Nordic cross design, and history of Sveriges Flagga.',
    keywords: 'Sweden flag, Swedish flag, Nordic cross, blue yellow flag, Sveriges flagga, Scandinavian flag history',
    colors: [
      { name: 'Azure Blue',   hex: '#006AA7', pantone: 'Pantone 301 C', usage: 'Field' },
      { name: 'Golden Yellow', hex: '#FECC02', pantone: 'Pantone 109 C', usage: 'Nordic cross' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#006AA7"/>
        <rect x="0" y="240" width="900" height="120" fill="#FECC02"/>
        <rect x="240" y="0" width="120" height="600" fill="#FECC02"/>`,
    design: {
      name: 'Sweden',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#006AA7', weight: 1 }] },
        { id: 'l2', type: 'overlay',  visible: true, expanded: false, shape: 'nordic', color: '#FECC02', opacity: 100, params: { thickness: 20, offset: 40 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'Sweden\'s flag features a golden-yellow Nordic cross on a sky-blue field. The cross is offset to the left — the vertical arm sits at roughly one-third of the flag\'s width — a hallmark of all Nordic cross flags.',
      'The official shade of blue is Azure (Pantone 301 C), and the cross is a bright golden yellow (Pantone 109 C). The flag\'s proportions are 5:8.',
    ],
    history: [
      'Blue and yellow have been Swedish royal colours since at least the 14th century, appearing in the coat of arms of the Three Crowns. The cross design is shared by all Nordic nations and traces its origin to the Dannebrog (Danish flag), believed to be among the oldest national flags in continuous use.',
      'Sweden\'s flag was given a formal legal basis in 1906, with precise colour standards established over the 20th century. National Flag Day is celebrated on 6 June, also Sweden\'s National Day.',
    ],
    ctaHeadline: 'Design a Nordic Cross Flag',
    ctaBody: 'Remix the Swedish flag — change the field colour, adjust cross thickness and offset, and export your own Nordic-inspired design.',
  },

  {
    slug: 'norway',
    isoCode: 'no',
    name: 'Norway',
    officialName: 'Norges Flagg',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '8:11',
    adopted: '1821',
    designType: 'Nordic Cross',
    metaDescription: 'Norway flag — official red, white and blue hex codes, Nordic cross design, and history of Norges Flagg.',
    keywords: 'Norway flag, Norwegian flag, Nordic cross, red white blue cross, Norges flagg, Scandinavian flag',
    colors: [
      { name: 'Scarlet Red', hex: '#EF2B2D', pantone: 'Pantone 485 C', usage: 'Field' },
      { name: 'White',       hex: '#FFFFFF', pantone: '',              usage: 'Outer cross border' },
      { name: 'Navy Blue',   hex: '#002868', pantone: 'Pantone 280 C', usage: 'Inner cross' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#EF2B2D"/>
        <rect x="0" y="218" width="900" height="164" fill="#FFFFFF"/>
        <rect x="218" y="0" width="164" height="600" fill="#FFFFFF"/>
        <rect x="0" y="246" width="900" height="108" fill="#002868"/>
        <rect x="246" y="0" width="108" height="600" fill="#002868"/>`,
    design: {
      name: 'Norway',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#EF2B2D', weight: 1 }] },
        { id: 'l2', type: 'overlay',  visible: true, expanded: false, shape: 'nordic', color: '#FFFFFF', opacity: 100, params: { thickness: 28, offset: 36 } },
        { id: 'l3', type: 'overlay',  visible: true, expanded: false, shape: 'nordic', color: '#002868', opacity: 100, params: { thickness: 18, offset: 41 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2', 'l3'],
    },
    breakdown: [
      'The Norwegian flag has a red field with a blue Nordic cross outlined in white. The cross is offset to the left, with the intersection point closer to the hoist than the fly.',
      'The cross incorporates the colours of three Nordic neighbours — Danish red, Swedish blue, and a common Scandinavian white — symbolising historical and cultural ties across the region.',
    ],
    history: [
      'Norway used various flags under Danish and later Swedish union arrangements. After a constitutional assembly in 1814, Fredrick Meltzer\'s design — the current red-white-blue Nordic cross — was adopted by the Norwegian parliament (Storting) in 1821.',
      'For much of the 19th century, Norway was required to fly a union mark in the canton. Full independence from Sweden in 1905 allowed the plain national flag to fly without restriction, a symbol of renewed sovereignty.',
    ],
    ctaHeadline: 'Design a Nordic Cross Flag',
    ctaBody: 'Remix Norway\'s three-colour Nordic cross, or build your own Scandinavian-inspired flag from scratch.',
  },

  {
    slug: 'denmark',
    isoCode: 'dk',
    name: 'Denmark',
    officialName: 'Dannebrog',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '28:37',
    adopted: '1370',
    designType: 'Nordic Cross',
    metaDescription: 'Denmark flag — the Dannebrog, one of the world\'s oldest national flags. Official red and white hex codes and its legendary history.',
    keywords: 'Denmark flag, Dannebrog, Danish flag, red white cross, Nordic cross, oldest national flag',
    colors: [
      { name: 'Dannebrog Red', hex: '#C60C30', pantone: 'Pantone 186 C', usage: 'Field' },
      { name: 'White',         hex: '#FFFFFF', pantone: '',              usage: 'Nordic cross' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#C60C30"/>
        <rect x="0" y="240" width="900" height="120" fill="#FFFFFF"/>
        <rect x="240" y="0" width="120" height="600" fill="#FFFFFF"/>`,
    design: {
      name: 'Denmark',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#C60C30', weight: 1 }] },
        { id: 'l2', type: 'overlay',  visible: true, expanded: false, shape: 'nordic', color: '#FFFFFF', opacity: 100, params: { thickness: 20, offset: 40 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'The Dannebrog is a white Nordic cross on a red field. The cross\'s vertical arm is offset to the left, a feature adopted by all Scandinavian national flags that descended from this design.',
      'The official proportions are 28:37 (approximately 3:4). The flag is rectangular; a swallow-tail version (Splitflag) is used by the military and royal family.',
    ],
    history: [
      'According to legend, the Dannebrog fell from the sky during the Battle of Lyndanisse (Estonia) in 1219, boosting Danish morale. While the legend is apocryphal, the flag is documented in use by at least the 14th century, making it one of the oldest continuously used national flags in the world.',
      'The design inspired every other Nordic country\'s flag — Sweden, Norway, Finland, Iceland, and the Faroe Islands all adopted variants of the offset cross pattern, creating the distinctive Nordic flag family.',
    ],
    ctaHeadline: 'Remix the Dannebrog',
    ctaBody: 'Build from the world\'s oldest national flag design — customise the Nordic cross colours and proportions in the Quick Flags editor.',
  },

  {
    slug: 'finland',
    isoCode: 'fi',
    name: 'Finland',
    officialName: 'Suomen Lippu',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '11:18',
    adopted: '1918',
    designType: 'Nordic Cross',
    metaDescription: 'Finland flag — official blue and white hex codes, the Scandinavian Nordic cross design, and history of Suomen Lippu.',
    keywords: 'Finland flag, Finnish flag, Nordic cross, blue white flag, Suomen lippu, Scandinavian flag',
    colors: [
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Field' },
      { name: 'Blue',  hex: '#003580', pantone: 'Pantone 294 C', usage: 'Nordic cross' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#FFFFFF"/>
        <rect x="0" y="240" width="900" height="120" fill="#003580"/>
        <rect x="240" y="0" width="120" height="600" fill="#003580"/>`,
    design: {
      name: 'Finland',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#FFFFFF', weight: 1 }] },
        { id: 'l2', type: 'overlay',  visible: true, expanded: false, shape: 'nordic', color: '#003580', opacity: 100, params: { thickness: 20, offset: 40 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'Finland\'s flag displays a deep-blue Nordic cross on a white field. The white represents the snow that covers Finland for much of the year, while the blue symbolises the country\'s countless lakes and the sky.',
      'The cross is offset to the hoist side, maintaining the Nordic cross tradition. Official proportions are 11:18.',
    ],
    history: [
      'Finland\'s independence from Russia was declared in December 1917. A design competition for the national flag attracted many entries; the blue-cross-on-white design by artists Eero Snellman and Bruno Tuukkanen was selected and officially adopted on 29 May 1918.',
      'Blue and white had long been associated with Finnish identity — appearing in student organisations and regional flags decades before independence. The Nordic cross links Finland visually to its Scandinavian neighbours.',
    ],
    ctaHeadline: 'Design your own Nordic Cross',
    ctaBody: 'Remix Finland\'s blue and white flag — adjust the cross, change the field colour, or create a brand-new Nordic-style design.',
  },

  {
    slug: 'switzerland',
    isoCode: 'ch',
    name: 'Switzerland',
    officialName: 'Schweizer Fahne',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '1:1',
    adopted: '1889',
    designType: 'Square Flag with Cross',
    metaDescription: 'Switzerland flag — official red and white hex codes, the iconic square format, and history of the Swiss cross.',
    keywords: 'Switzerland flag, Swiss flag, white cross red, square flag, Schweizer Fahne, Swiss flag history',
    colors: [
      { name: 'Red',   hex: '#FF0000', pantone: 'Pantone 485 C', usage: 'Field' },
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Equilateral cross' },
    ],
    svg: `<rect x="0" y="0" width="600" height="600" fill="#FF0000"/>
        <rect x="225" y="100" width="150" height="400" fill="#FFFFFF"/>
        <rect x="100" y="225" width="400" height="150" fill="#FFFFFF"/>`,
    design: {
      name: 'Switzerland',
      flagShape: 'rect11',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#FF0000', weight: 1 }] },
        { id: 'l2', type: 'overlay',  visible: true, expanded: false, shape: 'cross', color: '#FFFFFF', opacity: 100, params: { thickness: 25 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'Switzerland\'s flag is one of only two square national flags in the world (the other being Vatican City). It features a bold white cross centred on a red field. The cross arms are equal in length and each arm is one-sixth of the flag\'s width.',
      'The Swiss Federal Cross is different from a Greek or plus-sign cross — the arms are slightly longer relative to their width, giving the symbol a distinctive, solid appearance.',
    ],
    history: [
      'The white cross on red dates to medieval Swiss cantons and appears on the seal of the Old Swiss Confederacy from 1291. It was carried by Swiss soldiers at the Battle of Laupen (1339) and became an increasingly common symbol of Swiss identity.',
      'The Federal Law on the National Flag was enacted in 1889, standardising the design. Switzerland\'s strict neutrality means the flag is widely recognised as a symbol of peace, also adopted by the International Red Cross (with inverted colours) in 1863.',
    ],
    ctaHeadline: 'Remix the Swiss Cross',
    ctaBody: 'Build on the Swiss flag\'s bold symmetry — change colours, adjust the cross, or create your own heraldic design.',
  },

  {
    slug: 'austria',
    isoCode: 'at',
    name: 'Austria',
    officialName: 'Österreichische Fahne',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '2:3',
    adopted: '1918',
    designType: 'Horizontal Bicolour Triband',
    metaDescription: 'Austria flag — official red and white hex codes, and the legend behind one of Europe\'s oldest flag designs.',
    keywords: 'Austria flag, Austrian flag colors, red white red, österreichische fahne, Austrian flag history',
    colors: [
      { name: 'Red',   hex: '#ED2939', pantone: 'Pantone 032 C', usage: 'Top and bottom stripes' },
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Middle stripe' },
    ],
    svg: `<rect x="0" y="0" width="900" height="200" fill="#ED2939"/>
        <rect x="0" y="200" width="900" height="200" fill="#FFFFFF"/>
        <rect x="0" y="400" width="900" height="200" fill="#ED2939"/>`,
    design: {
      name: 'Austria',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#ED2939', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#ED2939', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Austria\'s flag is one of the simplest and oldest in the world: three equal horizontal bands of red, white, and red. The design is a <strong>triband</strong> — a symmetric two-colour horizontal flag.',
      'The civil flag uses only the bands. The state flag adds the Austrian coat of arms — a black eagle with a hammer and sickle in its talons — centred on the white stripe.',
    ],
    history: [
      'Legend credits Duke Leopold V of Austria with designing the flag after the Siege of Acre (1191). His white surcoat was soaked in blood except under his sword belt, leaving a white stripe — inspiring the red-white-red pattern. While the story may be embellished, the colours appear in the Babenberg coat of arms from the 13th century.',
      'The modern national flag was formally adopted in 1918 with the founding of the First Austrian Republic. It remains unchanged today, making Austria\'s design one of the oldest still in continuous use.',
    ],
    ctaHeadline: 'Design a Triband Flag',
    ctaBody: 'Remix Austria\'s red-white-red triband or create your own symmetrical horizontal stripe design.',
  },

  {
    slug: 'poland',
    isoCode: 'pl',
    name: 'Poland',
    officialName: 'Flaga Polski',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '5:8',
    adopted: '1919',
    designType: 'Horizontal Bicolour',
    metaDescription: 'Poland flag — official white and red hex codes, proportions, and the history of the Polish national flag.',
    keywords: 'Poland flag, Polish flag, white red flag, flaga Polski, Polish flag history, Polish colors',
    colors: [
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Top stripe' },
      { name: 'Red',   hex: '#DC143C', pantone: 'Pantone 186 C', usage: 'Bottom stripe' },
    ],
    svg: `<rect x="0" y="0" width="900" height="300" fill="#FFFFFF"/>
        <rect x="0" y="300" width="900" height="300" fill="#DC143C"/>`,
    design: {
      name: 'Poland',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#FFFFFF', weight: 1 },
        { color: '#DC143C', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Poland\'s flag is two equal horizontal bands: white on top and red on the bottom. These are the heraldic colours of the Polish national emblem — the White Eagle on a red field — which dates back to the Piast dynasty in the 13th century.',
      'The state flag adds the White Eagle coat of arms centred on the white stripe. The civil flag uses only the bicolour. The proportions are 5:8.',
    ],
    history: [
      'White and red have symbolised Poland since medieval times through the coat of arms of the Polish Kingdom — a white eagle on a red shield. The horizontal bicolour flag was formally adopted on 1 August 1919 following independence after World War I.',
      'After World War II, communist Poland retained the same colours but added a communist-era emblem. Poland\'s restoration of democracy in 1989 returned the flag to the simple white-red bicolour, removing Soviet-era symbols.',
    ],
    ctaHeadline: 'Remix the Polish Bicolour',
    ctaBody: 'Start from Poland\'s clean white-red flag and design your own national-style bicolour.',
  },

  {
    slug: 'portugal',
    isoCode: 'pt',
    name: 'Portugal',
    officialName: 'Bandeira de Portugal',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '2:3',
    adopted: '1911',
    designType: 'Vertical Bicolour with Coat of Arms',
    metaDescription: 'Portugal flag — official green and red hex codes, the armillary sphere, and the history of the Bandeira de Portugal.',
    keywords: 'Portugal flag, Portuguese flag, green red flag, bandeira de Portugal, Portuguese flag history',
    colors: [
      { name: 'Dark Green', hex: '#006600', pantone: 'Pantone 349 C', usage: 'Hoist band (2/5 width)' },
      { name: 'Scarlet Red', hex: '#FF0000', pantone: 'Pantone 485 C', usage: 'Fly band (3/5 width)' },
      { name: 'Gold',  hex: '#FFD700', pantone: 'Pantone 116 C', usage: 'Shield and armillary sphere' },
    ],
    svg: `<rect x="0" y="0" width="360" height="600" fill="#006600"/>
        <rect x="360" y="0" width="540" height="600" fill="#FF0000"/>
        <circle cx="360" cy="300" r="110" fill="#FFD700" opacity="0.9"/>
        <circle cx="360" cy="300" r="85" fill="#FFFFFF" opacity="0.7"/>
        <circle cx="360" cy="300" r="60" fill="#003399" opacity="0.8"/>`,
    design: {
      name: 'Portugal',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'vstripes', visible: true, expanded: false, bands: [
        { color: '#006600', weight: 2 },
        { color: '#FF0000', weight: 3 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'The Portuguese flag is divided vertically: dark green on the hoist (2/5 of the width) and scarlet red on the fly (3/5). Over the colour border sits the national coat of arms, featuring five blue shields arranged in a cross, surrounded by seven castles, encircled by an armillary sphere.',
      'The armillary sphere — a navigation instrument — commemorates Portugal\'s Age of Discovery, when Portuguese explorers charted the world\'s oceans in the 15th and 16th centuries.',
    ],
    history: [
      'The current bicolour replaced the Monarchist blue-and-white flag after the 5 October 1910 revolution that established the Portuguese Republic. The Republican colours — green and red — were chosen by the Republican Party, with green representing hope and red the blood of those who fought for the republic.',
      'The coat of arms combines medieval heraldry (the five quinas shields, symbolising victories over the Moors) with the armillary sphere of King Manuel I, linking Portugal\'s medieval roots with its imperial maritime era.',
    ],
    ctaHeadline: 'Design an Asymmetric Bicolour',
    ctaBody: 'Remix Portugal\'s green and red flag — adjust the split ratio, add your own emblem, and export your design.',
  },

  {
    slug: 'greece',
    isoCode: 'gr',
    name: 'Greece',
    officialName: 'Σημαία της Ελλάδας',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '2:3',
    adopted: '1978',
    designType: 'Horizontal Stripes with Canton Cross',
    metaDescription: 'Greece flag — official blue and white hex codes, the nine-stripe design, and the history of the Greek national flag.',
    keywords: 'Greece flag, Greek flag, blue white stripes, Greek flag history, Hellenic flag, canton cross',
    colors: [
      { name: 'Greek Blue', hex: '#0D5EAF', pantone: 'Pantone 286 C', usage: 'Five blue stripes and canton field' },
      { name: 'White',      hex: '#FFFFFF', pantone: '',              usage: 'Four white stripes and canton cross' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#0D5EAF"/>
        <rect x="0" y="66" width="900" height="67" fill="#FFFFFF"/>
        <rect x="0" y="199" width="900" height="67" fill="#FFFFFF"/>
        <rect x="0" y="332" width="900" height="67" fill="#FFFFFF"/>
        <rect x="0" y="465" width="900" height="67" fill="#FFFFFF"/>
        <rect x="0" y="0" width="333" height="333" fill="#0D5EAF"/>
        <rect x="0" y="120" width="333" height="93" fill="#FFFFFF"/>
        <rect x="120" y="0" width="93" height="333" fill="#FFFFFF"/>`,
    design: {
      name: 'Greece',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
          { color: '#0D5EAF', weight: 1 },
          { color: '#FFFFFF', weight: 1 },
          { color: '#0D5EAF', weight: 1 },
          { color: '#FFFFFF', weight: 1 },
          { color: '#0D5EAF', weight: 1 },
          { color: '#FFFFFF', weight: 1 },
          { color: '#0D5EAF', weight: 1 },
          { color: '#FFFFFF', weight: 1 },
          { color: '#0D5EAF', weight: 1 },
        ]},
        { id: 'l2', type: 'overlay', visible: true, expanded: false, shape: 'canton', color: '#0D5EAF', opacity: 100, params: { width: 37, height: 55 } },
        { id: 'l3', type: 'overlay', visible: true, expanded: false, shape: 'cross',  color: '#FFFFFF', opacity: 100, params: { thickness: 10 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2', 'l3'],
    },
    breakdown: [
      'The Greek flag has nine equal horizontal stripes alternating blue and white, with a blue canton in the upper hoist corner containing a white cross. The nine stripes are said to represent the nine syllables of the Greek motto <em>Ελευθερία ή Θάνατος</em> ("Freedom or Death").',
      'The cross in the canton represents the Greek Orthodox faith, which played a central role in preserving Greek identity during Ottoman rule. Blue and white have been the national colours since the Greek War of Independence (1821).',
    ],
    history: [
      'Greece\'s revolutionary flags of 1821 varied widely, but blue and white were consistent elements. The nine-stripe design with the canton cross was adopted during the War of Independence and refined over subsequent decades.',
      'Various proportions and shades of blue were used at different times. The current official design — with the distinctive shade of cobalt blue and nine stripes — was confirmed in 1978, replacing a brief period (1969–1974) when the military junta used a lighter shade.',
    ],
    ctaHeadline: 'Design a Striped Flag with Canton',
    ctaBody: 'Remix the Greek flag\'s nine-stripe design, or build your own canton flag from scratch in the Quick Flags editor.',
  },

  {
    slug: 'ireland',
    isoCode: 'ie',
    name: 'Ireland',
    officialName: 'Bratach na hÉireann',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '1:2',
    adopted: '1937',
    designType: 'Vertical Tricolour',
    metaDescription: 'Ireland flag — official green, white and orange hex codes, and the history of the Irish Tricolour from 1848 to the Republic.',
    keywords: 'Ireland flag, Irish flag, green white orange, Bratach na hÉireann, Irish tricolour, Irish flag history',
    colors: [
      { name: 'St. Patrick\'s Green', hex: '#169B62', pantone: 'Pantone 347 C', usage: 'Hoist stripe' },
      { name: 'White',               hex: '#FFFFFF', pantone: '',              usage: 'Centre stripe (peace)' },
      { name: 'Orange',              hex: '#FF883E', pantone: 'Pantone 151 C', usage: 'Fly stripe' },
    ],
    svg: `<rect x="0" y="0" width="300" height="600" fill="#169B62"/>
        <rect x="300" y="0" width="300" height="600" fill="#FFFFFF"/>
        <rect x="600" y="0" width="300" height="600" fill="#FF883E"/>`,
    design: {
      name: 'Ireland',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'vstripes', visible: true, expanded: false, bands: [
        { color: '#169B62', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#FF883E', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Three equal vertical bands of green, white, and orange make up the Irish Tricolour. The flag\'s symbolism is intentionally unifying: green represents Ireland\'s Catholic nationalist tradition, orange represents the Protestant Unionist community (after William of Orange), and white represents peace between them.',
      'The proportions are 1:2 (height to width), making the flag notably elongated compared to most European tricolours.',
    ],
    history: [
      'Thomas Francis Meagher introduced the tricolour on 7 March 1848 in Waterford, inspired by the French Revolution\'s tricolore. The flag gained prominence during the 1916 Easter Rising when it flew over the GPO in Dublin.',
      'The Irish Free State (1922) used the tricolour informally. The 1937 Constitution of Ireland formally enshrined it as the national flag. Northern Ireland continues to use the Union Jack, and the flag remains a symbol of aspiration for Irish unity.',
    ],
    ctaHeadline: 'Design your own Tricolour',
    ctaBody: 'Remix the Irish Tricolour — swap the colours, adjust proportions, and export your vertical stripe design.',
  },

  {
    slug: 'ukraine',
    isoCode: 'ua',
    name: 'Ukraine',
    officialName: 'Прапор України',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '2:3',
    adopted: '1992',
    designType: 'Horizontal Bicolour',
    metaDescription: 'Ukraine flag — official blue and yellow hex codes, and the history of the Ukrainian national flag from independence to today.',
    keywords: 'Ukraine flag, Ukrainian flag, blue yellow flag, Прапор України, Ukrainian flag history, blue gold flag',
    colors: [
      { name: 'Azure Blue',  hex: '#005BBB', pantone: 'Pantone 285 C', usage: 'Top stripe — sky' },
      { name: 'Golden Yellow', hex: '#FFD500', pantone: 'Pantone 109 C', usage: 'Bottom stripe — wheat fields' },
    ],
    svg: `<rect x="0" y="0" width="900" height="300" fill="#005BBB"/>
        <rect x="0" y="300" width="900" height="300" fill="#FFD500"/>`,
    design: {
      name: 'Ukraine',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#005BBB', weight: 1 },
        { color: '#FFD500', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Ukraine\'s flag is two equal horizontal bands: azure blue on top and golden yellow on the bottom. The image evokes the country\'s landscape — a clear blue sky over golden wheat fields, reflecting Ukraine\'s identity as a major agricultural nation.',
      'The proportions are 2:3. The blue is officially Pantone 285 C and the yellow Pantone 109 C, though both appear in slightly different shades across contexts.',
    ],
    history: [
      'Blue and gold appeared on the arms of the Principality of Galicia–Volhynia in medieval times. The modern bicolour gained prominence during the Ukrainian People\'s Republic (1917–1920) but was suppressed under Soviet rule.',
      'Ukraine declared independence in 1991 and officially adopted the blue-and-yellow flag in 1992. Since Russia\'s 2022 invasion, the flag has become a powerful global symbol of resistance and Ukrainian national identity.',
    ],
    ctaHeadline: 'Design a Bicolour Flag',
    ctaBody: 'Start from Ukraine\'s simple, powerful blue and gold bicolour, or create your own two-colour horizontal flag.',
  },

  {
    slug: 'iceland',
    isoCode: 'is',
    name: 'Iceland',
    officialName: 'Íslenski Fáni',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '18:25',
    adopted: '1944',
    designType: 'Nordic Cross',
    metaDescription: 'Iceland flag — official blue, white and red hex codes, Nordic cross design, and history of the Íslenski Fáni.',
    keywords: 'Iceland flag, Icelandic flag, Nordic cross, blue white red, Íslenski fáni, Scandinavian flag',
    colors: [
      { name: 'Bright Blue', hex: '#003897', pantone: 'Pantone 286 C', usage: 'Field' },
      { name: 'White',       hex: '#FFFFFF', pantone: '',              usage: 'Outer cross border' },
      { name: 'Crimson Red', hex: '#D72828', pantone: 'Pantone 186 C', usage: 'Inner cross' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#003897"/>
        <rect x="0" y="218" width="900" height="164" fill="#FFFFFF"/>
        <rect x="218" y="0" width="164" height="600" fill="#FFFFFF"/>
        <rect x="0" y="246" width="900" height="108" fill="#D72828"/>
        <rect x="246" y="0" width="108" height="600" fill="#D72828"/>`,
    design: {
      name: 'Iceland',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#003897', weight: 1 }] },
        { id: 'l2', type: 'overlay',  visible: true, expanded: false, shape: 'nordic', color: '#FFFFFF', opacity: 100, params: { thickness: 28, offset: 36 } },
        { id: 'l3', type: 'overlay',  visible: true, expanded: false, shape: 'nordic', color: '#D72828', opacity: 100, params: { thickness: 18, offset: 41 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2', 'l3'],
    },
    breakdown: [
      'Iceland\'s flag features a red cross outlined in white on a vivid blue field. The cross is offset to the hoist — classic Nordic cross positioning. The colours represent the elements of Iceland\'s landscape: blue for the Atlantic Ocean, white for the snow and ice, and red for the volcanic fires beneath the surface.',
      'Proportions are 18:25. A version with a swallow-tail is used by the President and state vessels.',
    ],
    history: [
      'Iceland was under Danish rule until 1918. The blue-white-red Nordic cross was first used in 1897 by Icelandic students in Copenhagen, combining Danish red-and-white with Norwegian blue. The flag was formally recognised when Iceland became a sovereign kingdom in personal union with Denmark (1918) and adopted fully in 1944 upon declaring a republic.',
      'The design shares the same three-colour Nordic-cross structure as Norway — reversed: Norway has a red field with a blue-on-white cross; Iceland has a blue field with a red-on-white cross.',
    ],
    ctaHeadline: 'Design a Nordic Cross Flag',
    ctaBody: 'Build on Iceland\'s fire-ice-ocean colour palette or create your own three-colour Nordic cross design.',
  },

  {
    slug: 'hungary',
    isoCode: 'hu',
    name: 'Hungary',
    officialName: 'Magyarország Zászlaja',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '1:2',
    adopted: '1957',
    designType: 'Horizontal Tricolour',
    metaDescription: 'Hungary flag — official red, white and green hex codes, and the history of the Hungarian national flag from 1848 to today.',
    keywords: 'Hungary flag, Hungarian flag, red white green, Magyar zászló, Hungarian revolution flag, Hungarian flag colors',
    colors: [
      { name: 'Red',   hex: '#CE2939', pantone: 'Pantone 186 C', usage: 'Top stripe' },
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Middle stripe' },
      { name: 'Green', hex: '#477050', pantone: 'Pantone 349 C', usage: 'Bottom stripe' },
    ],
    svg: `<rect x="0" y="0" width="900" height="200" fill="#CE2939"/>
        <rect x="0" y="200" width="900" height="200" fill="#FFFFFF"/>
        <rect x="0" y="400" width="900" height="200" fill="#477050"/>`,
    design: {
      name: 'Hungary',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#CE2939', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#477050', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Hungary\'s flag is three equal horizontal bands of red (top), white (middle), and green (bottom). The colours come from medieval Hungarian coats of arms: red and silver (white) from the Árpád dynasty, and green from the hills of Hungary.',
      'The proportions are 1:2. The state flag adds a coat of arms on the white stripe; the civil flag is the plain tricolour.',
    ],
    history: [
      'The red-white-green tricolour became a symbol of the 1848 Hungarian Revolution against Habsburg rule. It was officially adopted after the Austro-Hungarian Compromise of 1867, though suppressed during periods of foreign or Soviet domination.',
      'The 1956 Revolution famously cut out the communist-era emblem from the flag\'s centre, and the holed tricolour became an enduring symbol of resistance. Hungary\'s democratic transition of 1989 restored the plain tricolour without any state emblem, as used today.',
    ],
    ctaHeadline: 'Remix the Hungarian Tricolour',
    ctaBody: 'Start from Hungary\'s red-white-green flag and design your own horizontal tricolour.',
  },

  {
    slug: 'czech-republic',
    isoCode: 'cz',
    name: 'Czech Republic',
    officialName: 'Vlajka České Republiky',
    category: 'Country Flag',
    continent: 'Europe',
    proportion: '2:3',
    adopted: '1920',
    designType: 'Bicolour with Triangle',
    metaDescription: 'Czech Republic flag — official white, red and blue hex codes, and the history of the Czech tricolour with its distinctive blue triangle.',
    keywords: 'Czech Republic flag, Czech flag, white red blue triangle, česká vlajka, Czechoslovakia flag, Czech flag colors',
    colors: [
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Top horizontal stripe' },
      { name: 'Red',   hex: '#D7141A', pantone: 'Pantone 485 C', usage: 'Bottom horizontal stripe' },
      { name: 'Blue',  hex: '#11457E', pantone: 'Pantone 281 C', usage: 'Hoist triangle' },
    ],
    svg: `<rect x="0" y="0" width="900" height="300" fill="#FFFFFF"/>
        <rect x="0" y="300" width="900" height="300" fill="#D7141A"/>
        <polygon points="0,0 450,300 0,600" fill="#11457E"/>`,
    design: {
      name: 'Czech Republic',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
          { color: '#FFFFFF', weight: 1 },
          { color: '#D7141A', weight: 1 },
        ]},
        { id: 'l2', type: 'overlay', visible: true, expanded: false, shape: 'triangle', color: '#11457E', opacity: 100, params: { depth: 50, side: 0 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'The Czech flag combines a white top stripe, a red bottom stripe, and a blue triangle extending from the hoist to the flag\'s midpoint. This adds a third colour to what was originally Czechoslovakia\'s bicolour, distinguishing it from the Polish flag (also white over red).',
      'The blue triangle reaches exactly to the centre of the fly edge. White and red were the colours of the Kingdom of Bohemia; blue was added from Moravia and Slovakia\'s heraldic traditions.',
    ],
    history: [
      'Czechoslovakia was founded in 1918 using a white-red bicolour. The blue triangle was added in 1920 to differentiate the flag from Poland\'s identical design. When Czechoslovakia peacefully split in 1993, Slovakia adopted a new design while the Czech Republic retained the existing flag.',
      'A law was passed in 1993 stating the Czech Republic could not change the flag, making it the only successor state to retain the Czechoslovak flag unchanged — and the blue triangle a permanent symbol of Czech national identity.',
    ],
    ctaHeadline: 'Design a Triangle Hoist Flag',
    ctaBody: 'Remix the Czech flag\'s distinctive triangle design — change the colours, adjust the triangle depth, and export your flag.',
  },

  // ── AMERICAS ─────────────────────────────────────────────────────────────────

  {
    slug: 'usa',
    isoCode: 'us',
    name: 'United States',
    officialName: 'The Stars and Stripes',
    category: 'Country Flag',
    continent: 'Americas',
    proportion: '10:19',
    adopted: '1960',
    designType: 'Striped Flag with Star Canton',
    metaDescription: 'USA flag — official red, white and blue hex codes, the history of the Stars and Stripes, and what 50 stars and 13 stripes represent.',
    keywords: 'USA flag, American flag, Stars and Stripes, Old Glory, American flag colors, 50 stars 13 stripes',
    colors: [
      { name: 'Old Glory Red',  hex: '#B22234', pantone: 'Pantone 193 C', usage: '7 red stripes' },
      { name: 'White',          hex: '#FFFFFF', pantone: '',              usage: '6 white stripes' },
      { name: 'Old Glory Blue', hex: '#3C3B6E', pantone: 'Pantone 282 C', usage: 'Blue canton with 50 stars' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#B22234"/>
        <rect x="0" y="46" width="900" height="46" fill="#FFFFFF"/>
        <rect x="0" y="138" width="900" height="46" fill="#FFFFFF"/>
        <rect x="0" y="230" width="900" height="46" fill="#FFFFFF"/>
        <rect x="0" y="322" width="900" height="46" fill="#FFFFFF"/>
        <rect x="0" y="414" width="900" height="46" fill="#FFFFFF"/>
        <rect x="0" y="508" width="900" height="46" fill="#FFFFFF"/>
        <rect x="0" y="0" width="360" height="323" fill="#3C3B6E"/>
        <text x="180" y="175" font-size="110" text-anchor="middle" fill="#FFFFFF" opacity="0.85">★</text>`,
    design: {
      name: 'United States',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
          { color: '#B22234', weight: 1 }, { color: '#FFFFFF', weight: 1 },
          { color: '#B22234', weight: 1 }, { color: '#FFFFFF', weight: 1 },
          { color: '#B22234', weight: 1 }, { color: '#FFFFFF', weight: 1 },
          { color: '#B22234', weight: 1 }, { color: '#FFFFFF', weight: 1 },
          { color: '#B22234', weight: 1 }, { color: '#FFFFFF', weight: 1 },
          { color: '#B22234', weight: 1 }, { color: '#FFFFFF', weight: 1 },
          { color: '#B22234', weight: 1 },
        ]},
        { id: 'l2', type: 'overlay', visible: true, expanded: false, shape: 'canton', color: '#3C3B6E', opacity: 100, params: { width: 40, height: 54 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'The American flag has 13 alternating red and white horizontal stripes representing the original 13 colonies, and a blue rectangle (the "canton" or "union") in the upper hoist bearing 50 white five-pointed stars — one for each US state.',
      'The stripes run red-white-red, starting and ending with red (7 red, 6 white). The canton covers the top 7 stripes on the hoist side. The proportions are specified at 10:19 in the Flag Resolution of 1777, last updated in 1960.',
    ],
    history: [
      'The Continental Congress passed the Flag Resolution on 14 June 1777, calling for "thirteen stripes alternate red and white" and "thirteen stars, white in a blue field." Betsy Ross is popularly credited with sewing the first flag, though this is debated by historians.',
      'Stars have been added as states joined the Union — the 50th star (Hawaii) was added on 4 July 1960. The current 50-star design is the longest-serving version, surpassing the 48-star flag in 1960. 14 June is celebrated as Flag Day.',
    ],
    ctaHeadline: 'Design the next American flag',
    ctaBody: 'Remix the Stars and Stripes — customise the stripes, add your own canton, or imagine what the flag might look like with a 51st star.',
  },

  {
    slug: 'canada',
    isoCode: 'ca',
    name: 'Canada',
    officialName: 'The Maple Leaf Flag',
    category: 'Country Flag',
    continent: 'Americas',
    proportion: '1:2',
    adopted: '1965',
    designType: 'Vertical Tricolour with Emblem',
    metaDescription: 'Canada flag — official red and white hex codes, the maple leaf design, and how Canada chose its iconic flag in 1965.',
    keywords: 'Canada flag, Canadian flag, maple leaf flag, red white red flag, Canadian flag history, Canadian flag design',
    colors: [
      { name: 'Canadian Red', hex: '#FF0000', pantone: 'Pantone 485 C', usage: 'Two red panels (hoist and fly)' },
      { name: 'White',        hex: '#FFFFFF', pantone: '',              usage: 'White square with maple leaf' },
    ],
    svg: `<rect x="0" y="0" width="225" height="600" fill="#FF0000"/>
        <rect x="225" y="0" width="450" height="600" fill="#FFFFFF"/>
        <rect x="675" y="0" width="225" height="600" fill="#FF0000"/>
        <text x="450" y="360" font-size="320" text-anchor="middle" fill="#FF0000">🍁</text>`,
    design: {
      name: 'Canada',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'vstripes', visible: true, expanded: false, bands: [
        { color: '#FF0000', weight: 1 },
        { color: '#FFFFFF', weight: 2 },
        { color: '#FF0000', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'The Canadian flag — the Maple Leaf — has two red vertical bars on either side of a white square that is twice the width of each red bar. Centred on the white square is a stylised 11-pointed red maple leaf.',
      'The leaf is an 11-point design specifically engineered to be aerodynamically stable when the flag flies, eliminating the flutter distortion that plagued earlier designs.',
    ],
    history: [
      'Canada used the Canadian Red Ensign (a British maritime flag with the Canadian coat of arms) for decades, but desire for a distinctive national flag grew. A parliamentary committee examined 3,541 design submissions in 1964.',
      'Prime Minister Lester B. Pearson championed the single-maple-leaf design by artist George Stanley. After a contentious national debate, the Maple Leaf was proclaimed on 15 February 1965 — now celebrated as National Flag of Canada Day.',
    ],
    ctaHeadline: 'Design a Canadian-inspired Flag',
    ctaBody: 'Remix Canada\'s red-and-white tricolour, add your own centrepiece emblem, and export a sharp PNG or SVG.',
  },

  {
    slug: 'brazil',
    isoCode: 'br',
    name: 'Brazil',
    officialName: 'Bandeira do Brasil',
    category: 'Country Flag',
    continent: 'Americas',
    proportion: '7:10',
    adopted: '1992',
    designType: 'Green Field with Yellow Rhombus and Blue Sphere',
    metaDescription: 'Brazil flag — official green, yellow and blue hex codes, the Order and Progress motto, and history of the Bandeira do Brasil.',
    keywords: 'Brazil flag, Brazilian flag, green yellow blue, Bandeira do Brasil, Ordem e Progresso, Brazilian flag history',
    colors: [
      { name: 'Vera Cruz Green', hex: '#009C3B', pantone: 'Pantone 355 C', usage: 'Field' },
      { name: 'Ouro Yellow',     hex: '#FFDF00', pantone: 'Pantone 102 C', usage: 'Rhombus' },
      { name: 'Azul Blue',       hex: '#002776', pantone: 'Pantone 280 C', usage: 'Central blue sphere' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#009C3B"/>
        <polygon points="450,40 860,300 450,560 40,300" fill="#FFDF00"/>
        <circle cx="450" cy="300" r="160" fill="#002776"/>
        <text x="450" y="320" font-size="38" text-anchor="middle" fill="#FFFFFF" font-family="serif" letter-spacing="2">ORDEM E PROGRESSO</text>`,
    design: {
      name: 'Brazil',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#009C3B', weight: 1 }] }],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Brazil\'s flag has a green field (representing the forests), a yellow rhombus (representing Brazil\'s gold wealth), and a blue sphere (representing the sky over Rio de Janeiro at the moment of independence) with 27 white stars (one per state and the Federal District).',
      'A white band across the sphere reads "ORDEM E PROGRESSO" (Order and Progress) — a positivist motto reflecting Brazil\'s Republican ideals at the flag\'s adoption in 1889.',
    ],
    history: [
      'Brazil declared independence from Portugal in 1822. The original imperial flag used green and yellow (the dynastic colours of the Braganza and Habsburg houses of Emperor Pedro I\'s parents). The sphere replaced the imperial arms after the Republic was proclaimed on 15 November 1889.',
      'Stars have been added over time as Brazil\'s states were created or reorganised; the current 27-star arrangement was set in 1992. Each star corresponds to a Brazilian state or the Federal District.',
    ],
    ctaHeadline: 'Remix Brazil\'s Flag',
    ctaBody: 'Start from Brazil\'s iconic green, gold and blue design and put your own spin on it in the Quick Flags editor.',
  },

  {
    slug: 'mexico',
    isoCode: 'mx',
    name: 'Mexico',
    officialName: 'La Bandera de México',
    category: 'Country Flag',
    continent: 'Americas',
    proportion: '4:7',
    adopted: '1968',
    designType: 'Vertical Tricolour with Coat of Arms',
    metaDescription: 'Mexico flag — official green, white and red hex codes, the eagle and serpent emblem, and history of La Bandera de México.',
    keywords: 'Mexico flag, Mexican flag, green white red, bandera de México, Mexican coat of arms, Mexican flag history',
    colors: [
      { name: 'Vert Green', hex: '#006847', pantone: 'Pantone 347 C', usage: 'Hoist stripe — hope' },
      { name: 'White',      hex: '#FFFFFF', pantone: '',              usage: 'Centre stripe — unity' },
      { name: 'Red',        hex: '#CE1126', pantone: 'Pantone 186 C', usage: 'Fly stripe — blood of heroes' },
    ],
    svg: `<rect x="0" y="0" width="300" height="600" fill="#006847"/>
        <rect x="300" y="0" width="300" height="600" fill="#FFFFFF"/>
        <rect x="600" y="0" width="300" height="600" fill="#CE1126"/>
        <text x="450" y="340" font-size="200" text-anchor="middle">🦅</text>`,
    design: {
      name: 'Mexico',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'vstripes', visible: true, expanded: false, bands: [
        { color: '#006847', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#CE1126', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Mexico\'s flag has three equal vertical stripes: green (hoist), white (centre), and red (fly), with the national coat of arms centred on the white stripe. The emblem depicts an eagle perched on a cactus devouring a snake — the Aztec legend of Tenochtitlan\'s founding.',
      'The colours\' modern interpretation links green to independence, white to the Catholic faith (or unity), and red to the blood of national heroes, though interpretations have varied through history.',
    ],
    history: [
      'The green-white-red tricolour appeared when Mexico declared independence from Spain in 1821. The colours were said to represent the three guarantees of Agustín de Iturbide\'s Plan of Iguala: independence (green), religion (white), and union (red).',
      'The current coat of arms design was standardised in 1968. The eagle-and-serpent emblem traces directly to the Aztec founding myth, connecting modern Mexico to its pre-Columbian heritage.',
    ],
    ctaHeadline: 'Remix the Mexican Tricolour',
    ctaBody: 'Start from Mexico\'s green, white and red flag, add your own central emblem, and export a high-quality flag design.',
  },

  {
    slug: 'argentina',
    isoCode: 'ar',
    name: 'Argentina',
    officialName: 'La Bandera Argentina',
    category: 'Country Flag',
    continent: 'Americas',
    proportion: '9:14',
    adopted: '1818',
    designType: 'Horizontal Triband with Sun',
    metaDescription: 'Argentina flag — official sky blue and white hex codes, the Sun of May, and the history of La Bandera Argentina.',
    keywords: 'Argentina flag, Argentine flag, sky blue white, Sol de Mayo, Bandera Argentina, Argentine flag history',
    colors: [
      { name: 'Sky Blue', hex: '#74ACDF', pantone: 'Pantone 278 C', usage: 'Top and bottom stripes' },
      { name: 'White',    hex: '#FFFFFF', pantone: '',              usage: 'Middle stripe and sun' },
      { name: 'Gold',     hex: '#F6B40E', pantone: 'Pantone 116 C', usage: 'Sol de Mayo (Sun of May)' },
    ],
    svg: `<rect x="0" y="0" width="900" height="200" fill="#74ACDF"/>
        <rect x="0" y="200" width="900" height="200" fill="#FFFFFF"/>
        <rect x="0" y="400" width="900" height="200" fill="#74ACDF"/>
        <circle cx="450" cy="300" r="70" fill="#F6B40E"/>`,
    design: {
      name: 'Argentina',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#74ACDF', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#74ACDF', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Argentina\'s flag has three equal horizontal stripes of light blue, white, and light blue. The "official flag" (Bandera oficial de ceremonias) includes the Sol de Mayo — a golden sun with a human face — centred on the white stripe. The civil flag omits the sun.',
      'The sky blue (celeste) is a distinctive light blue, lighter than most national flags\' blues. The sun has 16 straight and 16 wavy rays alternating, totalling 32, representing the Inca sun deity Inti.',
    ],
    history: [
      'General Manuel Belgrano first raised the blue-and-white flag on 27 February 1812 at Rosario, using the cockade colours of the Buenos Aires revolution. Argentina officially adopted it in 1818 after independence from Spain.',
      'The Sun of May was added to the state flag in 1818. Its name references the May Revolution of 1810, the first step toward Argentine independence. 27 February is celebrated as Flag Day in Argentina.',
    ],
    ctaHeadline: 'Design a Triband Flag with Sun',
    ctaBody: 'Remix Argentina\'s sky blue and white design, or add your own golden sun emblem in the Quick Flags editor.',
  },

  {
    slug: 'colombia',
    isoCode: 'co',
    name: 'Colombia',
    officialName: 'La Bandera de Colombia',
    category: 'Country Flag',
    continent: 'Americas',
    proportion: '2:3',
    adopted: '1861',
    designType: 'Horizontal Tricolour',
    metaDescription: 'Colombia flag — official yellow, blue and red hex codes, and the history of La Bandera de Colombia from Simón Bolívar\'s Gran Colombia.',
    keywords: 'Colombia flag, Colombian flag, yellow blue red, Bandera de Colombia, Gran Colombia flag, Colombian flag history',
    colors: [
      { name: 'Yellow', hex: '#FCD116', pantone: 'Pantone 116 C', usage: 'Top stripe (double height) — gold, sovereignty, harmony' },
      { name: 'Blue',   hex: '#003087', pantone: 'Pantone 280 C', usage: 'Middle stripe — the seas and rivers' },
      { name: 'Red',    hex: '#CE1126', pantone: 'Pantone 186 C', usage: 'Bottom stripe — blood of patriots' },
    ],
    svg: `<rect x="0" y="0" width="900" height="300" fill="#FCD116"/>
        <rect x="0" y="300" width="900" height="150" fill="#003087"/>
        <rect x="0" y="450" width="900" height="150" fill="#CE1126"/>`,
    design: {
      name: 'Colombia',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#FCD116', weight: 2 },
        { color: '#003087', weight: 1 },
        { color: '#CE1126', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Colombia\'s flag has three horizontal stripes: yellow at the top (half the flag\'s height), then equal-height stripes of blue and red below. The yellow stripe is twice as tall as each of the other two.',
      'Yellow symbolises Colombia\'s gold, sovereignty, and the country\'s rich natural resources. Blue represents the Pacific Ocean, Caribbean Sea, and the country\'s rivers. Red represents the blood of those who fought for independence.',
    ],
    history: [
      'The design originates from Francisco de Miranda\'s flag for Gran Colombia (1806), a federation that included modern Colombia, Venezuela, Ecuador, and Panama. Miranda reportedly chose yellow, blue, and red to represent "the riches of our land separated from Spain by the ocean, washed in the blood of patriots."',
      'Colombia formally adopted the flag in 1861 with the unequal stripe proportions that distinguish it from Venezuela and Ecuador, which use the same colours in equal stripes.',
    ],
    ctaHeadline: 'Design a Proportional Tricolour',
    ctaBody: 'Remix Colombia\'s flag with its distinctive unequal stripes, or build your own proportional tricolour design.',
  },

  {
    slug: 'chile',
    isoCode: 'cl',
    name: 'Chile',
    officialName: 'La Bandera de Chile',
    category: 'Country Flag',
    continent: 'Americas',
    proportion: '2:3',
    adopted: '1817',
    designType: 'Horizontal Bicolour with Canton',
    metaDescription: 'Chile flag — official red, white and blue hex codes, the lone star, and the history of La Bandera de Chile.',
    keywords: 'Chile flag, Chilean flag, red white blue star, Bandera de Chile, La Estrella Solitaria, Chilean flag history',
    colors: [
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Top right panel' },
      { name: 'Red',   hex: '#D52B1E', pantone: 'Pantone 485 C', usage: 'Bottom panel' },
      { name: 'Blue',  hex: '#0039A6', pantone: 'Pantone 286 C', usage: 'Canton (top hoist)' },
    ],
    svg: `<rect x="0" y="0" width="900" height="300" fill="#FFFFFF"/>
        <rect x="0" y="300" width="900" height="300" fill="#D52B1E"/>
        <rect x="0" y="0" width="300" height="300" fill="#0039A6"/>
        <text x="150" y="195" font-size="190" text-anchor="middle" fill="#FFFFFF">★</text>`,
    design: {
      name: 'Chile',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
          { color: '#FFFFFF', weight: 1 },
          { color: '#D52B1E', weight: 1 },
        ]},
        { id: 'l2', type: 'overlay', visible: true, expanded: false, shape: 'canton', color: '#0039A6', opacity: 100, params: { width: 33, height: 50 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'Chile\'s flag has two horizontal halves — white (top) and red (bottom) — with a blue canton in the upper hoist containing a white five-pointed star. The star is known as <em>La Estrella Solitaria</em> (The Lone Star), representing honour and progress.',
      'The colours represent: white — the snow of the Andes; blue — the sky and the Pacific; red — the blood of patriots. The proportions are 2:3.',
    ],
    history: [
      'Chile declared independence from Spain in 1818. The flag was designed by Spanish-born Royalist officer Gregorio de Andía y Varela (who then joined the independence cause) and was formalised that same year.',
      'The design draws on Mapuche cultural symbols — the blue and white echoing the flag of the Araucanía region. The current design has remained essentially unchanged since 1817, making it one of the most enduring flags in the Americas.',
    ],
    ctaHeadline: 'Design a Canton Flag',
    ctaBody: 'Start from Chile\'s red, white and blue canton design and build your own star-canton flag in the editor.',
  },

  {
    slug: 'jamaica',
    isoCode: 'jm',
    name: 'Jamaica',
    officialName: 'Flag of Jamaica',
    category: 'Country Flag',
    continent: 'Americas',
    proportion: '1:2',
    adopted: '1962',
    designType: 'Diagonal Cross (Saltire)',
    metaDescription: 'Jamaica flag — official black, yellow and green hex codes, the saltire design, and history of the Jamaican flag from independence.',
    keywords: 'Jamaica flag, Jamaican flag, black yellow green, saltire flag, Jamaican flag history, Caribbean flag',
    colors: [
      { name: 'Black',  hex: '#000000', pantone: '',              usage: 'Two triangles (top and bottom)' },
      { name: 'Yellow', hex: '#FED100', pantone: 'Pantone 116 C', usage: 'Diagonal cross (saltire)' },
      { name: 'Green',  hex: '#007B40', pantone: 'Pantone 348 C', usage: 'Two triangles (hoist and fly)' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#000000"/>
        <polygon points="0,0 900,0 450,300" fill="#000000"/>
        <polygon points="0,600 900,600 450,300" fill="#000000"/>
        <polygon points="0,0 0,600 450,300" fill="#007B40"/>
        <polygon points="900,0 900,600 450,300" fill="#007B40"/>
        <line x1="0" y1="0" x2="900" y2="600" stroke="#FED100" stroke-width="90"/>
        <line x1="0" y1="600" x2="900" y2="0" stroke="#FED100" stroke-width="90"/>`,
    design: {
      name: 'Jamaica',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#007B40', weight: 1 }] },
        { id: 'l2', type: 'overlay',  visible: true, expanded: false, shape: 'saltire', color: '#000000', opacity: 100, params: { thickness: 28 } },
        { id: 'l3', type: 'overlay',  visible: true, expanded: false, shape: 'saltire', color: '#FED100', opacity: 100, params: { thickness: 15 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2', 'l3'],
    },
    breakdown: [
      'Jamaica\'s flag features a yellow diagonal cross (saltire) on a field divided into four triangles — black at top and bottom, green at hoist and fly. It is one of the few national flags with no red, white, or blue.',
      'The motto "Hardships there are but the land is green and the sun shineth" is reflected in the design: black for hardships, gold for the sunshine, green for the land.',
    ],
    history: [
      'Jamaica became independent from Britain on 6 August 1962, and the flag was designed specifically for independence. A national competition resulted in 367 entries; the design committee then created a final version, formally adopting the saltire design.',
      'The original design had horizontal black stripes but was changed to the diagonal cross to ensure it could not be confused with any existing national flag. It has remained unchanged since independence.',
    ],
    ctaHeadline: 'Design a Saltire Flag',
    ctaBody: 'Remix Jamaica\'s bold diagonal cross design — change colours, adjust the saltire thickness, and export your own flag.',
  },

  {
    slug: 'cuba',
    isoCode: 'cu',
    name: 'Cuba',
    officialName: 'La Bandera de Cuba',
    category: 'Country Flag',
    continent: 'Americas',
    proportion: '1:2',
    adopted: '1902',
    designType: 'Striped Flag with Triangle',
    metaDescription: 'Cuba flag — official blue, white and red hex codes, the lone star, and the history of La Bandera de Cuba.',
    keywords: 'Cuba flag, Cuban flag, blue white red stripes triangle, Bandera de Cuba, Cuban flag history, Caribbean flag',
    colors: [
      { name: 'Cobalt Blue', hex: '#002A8F', pantone: 'Pantone 286 C', usage: 'Three blue stripes' },
      { name: 'White',       hex: '#FFFFFF', pantone: '',              usage: 'Two white stripes' },
      { name: 'Red',         hex: '#CF142B', pantone: 'Pantone 186 C', usage: 'Hoist triangle' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#002A8F"/>
        <rect x="0" y="120" width="900" height="120" fill="#FFFFFF"/>
        <rect x="0" y="360" width="900" height="120" fill="#FFFFFF"/>
        <polygon points="0,0 360,300 0,600" fill="#CF142B"/>
        <text x="120" y="335" font-size="150" text-anchor="middle" fill="#FFFFFF">★</text>`,
    design: {
      name: 'Cuba',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
          { color: '#002A8F', weight: 1 },
          { color: '#FFFFFF', weight: 1 },
          { color: '#002A8F', weight: 1 },
          { color: '#FFFFFF', weight: 1 },
          { color: '#002A8F', weight: 1 },
        ]},
        { id: 'l2', type: 'overlay', visible: true, expanded: false, shape: 'triangle', color: '#CF142B', opacity: 100, params: { depth: 40, side: 0 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'Cuba\'s flag has five equal horizontal stripes of alternating blue and white (three blue, two white), with an equilateral red triangle at the hoist bearing a single white five-pointed star.',
      'The three blue stripes represent the three original administrative regions of Cuba. The two white stripes stand for the purity of the independence movement. The red triangle represents the blood shed for liberty, equality, and fraternity. The lone star represents the new independent state.',
    ],
    history: [
      'The flag was designed in 1849 by poet Miguel Teurbe Tolón and General Narciso López, who planned an independence expedition. It was first raised in Cuban soil in 1850 at Cárdenas.',
      'Cuba remained a Spanish colony until 1898; during the wars of independence, the flag flew among rebel forces. It became the official national flag on 20 May 1902 when Cuba achieved formal independence, and has remained unchanged ever since.',
    ],
    ctaHeadline: 'Design a Stripe and Triangle Flag',
    ctaBody: 'Remix Cuba\'s classic five-stripe and red triangle design, or create your own in the Quick Flags editor.',
  },

  {
    slug: 'peru',
    isoCode: 'pe',
    name: 'Peru',
    officialName: 'La Bandera de Perú',
    category: 'Country Flag',
    continent: 'Americas',
    proportion: '2:3',
    adopted: '1825',
    designType: 'Vertical Tricolour',
    metaDescription: 'Peru flag — official red and white hex codes, and the history of La Bandera de Perú from San Martín to the modern republic.',
    keywords: 'Peru flag, Peruvian flag, red white red, Bandera de Perú, Peruvian flag history, South American flag',
    colors: [
      { name: 'Red',   hex: '#D91023', pantone: 'Pantone 186 C', usage: 'Hoist and fly stripes' },
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Centre stripe' },
    ],
    svg: `<rect x="0" y="0" width="300" height="600" fill="#D91023"/>
        <rect x="300" y="0" width="300" height="600" fill="#FFFFFF"/>
        <rect x="600" y="0" width="300" height="600" fill="#D91023"/>`,
    design: {
      name: 'Peru',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'vstripes', visible: true, expanded: false, bands: [
        { color: '#D91023', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#D91023', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Peru\'s flag is three equal vertical stripes: red, white, and red. The civil flag uses only the bicolour triband. The state flag adds the Peruvian coat of arms to the white stripe, featuring a vicuña, a cinchona tree, and a cornucopia of coins.',
      'Red symbolises the blood shed for independence; white represents peace and honour. The proportions are 2:3.',
    ],
    history: [
      'General José de San Martín, the liberator of Peru, reportedly designed the flag after seeing a flock of flamingos (red and white) take flight over Paracas beach in 1820 — a legend that captures the flag\'s visual inspiration even if the historical facts are debated.',
      'Peru declared independence on 28 July 1821. The current vertical triband was confirmed in 1825 and has remained unchanged. 7 June is celebrated as Flag Day (Día de la Bandera) in Peru.',
    ],
    ctaHeadline: 'Remix the Peruvian Tricolour',
    ctaBody: 'Build on Peru\'s bold red and white vertical stripes, or create your own symmetric vertical triband.',
  },


  // ── ASIA ─────────────────────────────────────────────────────────────────────

  {
    slug: 'japan',
    isoCode: 'jp',
    name: 'Japan',
    officialName: '日本の国旗 — Nisshōki',
    category: 'Country Flag',
    continent: 'Asia',
    proportion: '2:3',
    adopted: '1999',
    designType: 'Red Disc on White Field',
    metaDescription: 'Japan flag — official white and red hex codes, the Nisshōki rising sun disc, and the long history of the Japanese national flag.',
    keywords: 'Japan flag, Japanese flag, Nisshoki, Hinomaru, red disc white, Japanese flag history',
    colors: [
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Field' },
      { name: 'Crimson', hex: '#BC002D', pantone: 'Pantone 1795 C', usage: 'Central disc' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#FFFFFF"/>
        <circle cx="450" cy="300" r="180" fill="#BC002D"/>`,
    design: {
      name: 'Japan',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#FFFFFF', weight: 1 }] }],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Japan\'s flag — the <strong>Nisshōki</strong> or <strong>Hinomaru</strong> (Circle of the Sun) — is one of the world\'s simplest and most recognisable designs: a crimson-red disc centred on a white field.',
      'The disc represents the sun. The official crimson shade is a deep, slightly blue-tinged red (traditionally called <em>beni</em>), specified as Pantone 1795 C since the 1999 Law Concerning the National Flag and Anthem.',
    ],
    history: [
      'The sun has been a symbol of Japan since ancient times; early Japanese emperors were considered descendants of the sun goddess Amaterasu. The Hinomaru appears on samurai battle fans from the 12th century and was used by feudal clans for centuries.',
      'The Daijō-kan proclamation of 1870 standardised the flag for merchant ships. Its use as the national flag was formalised by law in 1999, codifying the exact size of the disc (three-fifths of the flag\'s shorter side) and the official shade of red.',
    ],
    ctaHeadline: 'Design a Minimalist Flag',
    ctaBody: 'Remix Japan\'s iconic sun disc design, change colours, or build your own bold minimalist flag in the Quick Flags editor.',
  },

  {
    slug: 'china',
    isoCode: 'cn',
    name: 'China',
    officialName: '中华人民共和国国旗',
    category: 'Country Flag',
    continent: 'Asia',
    proportion: '2:3',
    adopted: '1949',
    designType: 'Red Field with Stars',
    metaDescription: 'China flag — official red and yellow hex codes, the five-star design, and the history of the Chinese national flag since 1949.',
    keywords: 'China flag, Chinese flag, five stars red, PRC flag, Chinese flag history, red yellow flag',
    colors: [
      { name: 'China Red',   hex: '#DE2910', pantone: 'Pantone 186 C', usage: 'Field' },
      { name: 'China Yellow', hex: '#FFDE00', pantone: 'Pantone 116 C', usage: 'Five stars' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#DE2910"/>
        <text x="160" y="200" font-size="160" fill="#FFDE00">★</text>
        <text x="290" y="120" font-size="80" fill="#FFDE00">★</text>
        <text x="370" y="175" font-size="80" fill="#FFDE00">★</text>
        <text x="360" y="265" font-size="80" fill="#FFDE00">★</text>
        <text x="295" y="330" font-size="80" fill="#FFDE00">★</text>`,
    design: {
      name: 'China',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#DE2910', weight: 1 }] }],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'China\'s flag has a red field with one large yellow five-pointed star and four smaller stars arranged in a curved arc in the upper hoist. The large star represents the Communist Party of China; the four smaller stars represent the four social classes (working class, peasantry, urban petty bourgeoisie, and national bourgeoisie).',
      'Red symbolises the communist revolution and the blood of those who died for it. Yellow represents the golden future. The five stars together symbolise the unity of the Chinese people under the Party.',
    ],
    history: [
      'Economist Zeng Liansong submitted the winning design for the People\'s Republic of China\'s flag shortly before the proclamation of the PRC on 1 October 1949. The flag was raised for the first time at Tiananmen Square by Mao Zedong on that date.',
      'The design went through several revisions — an early version included a horizontal yellow stripe — before settling on the five-star arrangement. The proportions and star sizes are precisely specified in national standards.',
    ],
    ctaHeadline: 'Design a Star Canton Flag',
    ctaBody: 'Remix China\'s bold red and gold design, or create your own star-field flag from scratch.',
  },

  {
    slug: 'india',
    isoCode: 'in',
    name: 'India',
    officialName: 'भारत का राष्ट्रीय ध्वज — Tiraṅgā',
    category: 'Country Flag',
    continent: 'Asia',
    proportion: '2:3',
    adopted: '1947',
    designType: 'Horizontal Tricolour with Wheel',
    metaDescription: 'India flag — official saffron, white and green hex codes, the Ashoka Chakra, and history of the Tiranga.',
    keywords: 'India flag, Indian flag, Tiranga, saffron white green, Ashoka Chakra, Indian flag history, tricolor India',
    colors: [
      { name: 'India Saffron', hex: '#FF9933', pantone: 'Pantone 1495 C', usage: 'Top stripe — courage and sacrifice' },
      { name: 'White',         hex: '#FFFFFF', pantone: '',               usage: 'Middle stripe — peace and truth' },
      { name: 'India Green',   hex: '#138808', pantone: 'Pantone 362 C',  usage: 'Bottom stripe — faith and chivalry' },
      { name: 'Navy Blue',     hex: '#000080', pantone: 'Pantone 281 C',  usage: 'Ashoka Chakra (24-spoke wheel)' },
    ],
    svg: `<rect x="0" y="0" width="900" height="200" fill="#FF9933"/>
        <rect x="0" y="200" width="900" height="200" fill="#FFFFFF"/>
        <rect x="0" y="400" width="900" height="200" fill="#138808"/>
        <circle cx="450" cy="300" r="70" fill="none" stroke="#000080" stroke-width="10"/>
        <circle cx="450" cy="300" r="12" fill="#000080"/>`,
    design: {
      name: 'India',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#FF9933', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#138808', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'India\'s Tiranga (tricolour) has three equal horizontal bands: saffron (top), white (middle), and green (bottom). At the centre of the white stripe is the <strong>Ashoka Chakra</strong> — a navy blue 24-spoked wheel representing the eternal wheel of law (dharma).',
      'The Chakra is taken from the Lion Capital of Ashoka, a 3rd-century BC pillar erected by Emperor Ashoka. It is identical to the wheel on the national emblem, symbolising the principle of "movement in virtue."',
    ],
    history: [
      'Pingali Venkayya designed the prototype for the Indian National Congress flag in 1921. The saffron-white-green scheme replaced earlier Congress designs, and the spinning wheel (charkha) — Mahatma Gandhi\'s symbol of self-reliance — was the original centre symbol.',
      'Upon independence on 15 August 1947, the spinning wheel was replaced by the Ashoka Chakra to represent the nation\'s ancient heritage rather than a partisan political symbol. The flag was officially adopted on 22 July 1947.',
    ],
    ctaHeadline: 'Design a Tricolour with Emblem',
    ctaBody: 'Remix India\'s saffron, white and green tricolour — add your own central emblem and export your design.',
  },

  {
    slug: 'south-korea',
    isoCode: 'kr',
    name: 'South Korea',
    officialName: '대한민국 국기 — Taegukgi',
    category: 'Country Flag',
    continent: 'Asia',
    proportion: '2:3',
    adopted: '1949',
    designType: 'White Field with Yin-Yang and Trigrams',
    metaDescription: 'South Korea flag — official colors, the Taegukgi design with yin-yang symbol and trigrams, and Korean flag history.',
    keywords: 'South Korea flag, Korean flag, Taegukgi, yin yang flag, Korean flag colors, Korean trigrams',
    colors: [
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Field — purity and peace' },
      { name: 'Red',   hex: '#CD2E3A', pantone: 'Pantone 186 C', usage: 'Upper Taeguk half' },
      { name: 'Blue',  hex: '#0047A0', pantone: 'Pantone 286 C', usage: 'Lower Taeguk half' },
      { name: 'Black', hex: '#000000', pantone: '',              usage: 'Four corner trigrams' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#FFFFFF"/>
        <circle cx="450" cy="300" r="130" fill="#CD2E3A"/>
        <circle cx="450" cy="235" r="65" fill="#0047A0"/>
        <circle cx="450" cy="365" r="65" fill="#CD2E3A"/>
        <path d="M450,170 A130,130 0 0,0 450,430 A65,65 0 0,1 450,300 A65,65 0 0,0 450,170Z" fill="#0047A0"/>`,
    design: {
      name: 'South Korea',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#FFFFFF', weight: 1 }] }],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'The Taegukgi features a white field, a central Taeguk (yin-yang) symbol in red and blue, and four black trigrams from the I Ching in each corner. The Taeguk represents balance between opposing cosmic forces.',
      'The four trigrams (geon, gon, gam, ri) at the corners represent sky, earth, water, and fire respectively. White symbolises purity; the red-blue balance represents continual movement and balance in the universe.',
    ],
    history: [
      'The Taegukgi was first introduced in 1882 by Joseon diplomat Park Yeong-hyo, who raised it on a visit to Japan. The design was officially adopted by the Korean Empire and continued by the Republic of Korea after 1945.',
      'The current standard was established in 1949 after independence from Japan. Several revisions have refined the exact proportions and trigram arrangement. The flag is deeply rooted in Confucian and Taoist philosophical traditions.',
    ],
    ctaHeadline: 'Design a Philosophical Flag',
    ctaBody: 'Explore the symbolism of the Taegukgi and build your own emblem-centred flag design in Quick Flags.',
  },

  {
    slug: 'thailand',
    isoCode: 'th',
    name: 'Thailand',
    officialName: 'ธงไตรรงค์ — Thong Trairong',
    category: 'Country Flag',
    continent: 'Asia',
    proportion: '2:3',
    adopted: '1917',
    designType: 'Horizontal Stripes',
    metaDescription: 'Thailand flag — official red, white and blue hex codes, and the history of the Thai Tricolour flag from Rama VI.',
    keywords: 'Thailand flag, Thai flag, red white blue stripes, Thong Trairong, Thai flag history, Thai tricolor',
    colors: [
      { name: 'Thai Red',  hex: '#A51931', pantone: 'Pantone 193 C', usage: 'Top and bottom outer stripes' },
      { name: 'White',     hex: '#FFFFFF', pantone: '',              usage: 'Second and fourth stripes' },
      { name: 'Thai Blue', hex: '#2D2A4A', pantone: 'Pantone 2766 C', usage: 'Centre stripe (double height)' },
    ],
    svg: `<rect x="0" y="0" width="900" height="100" fill="#A51931"/>
        <rect x="0" y="100" width="900" height="100" fill="#FFFFFF"/>
        <rect x="0" y="200" width="900" height="200" fill="#2D2A4A"/>
        <rect x="0" y="400" width="900" height="100" fill="#FFFFFF"/>
        <rect x="0" y="500" width="900" height="100" fill="#A51931"/>`,
    design: {
      name: 'Thailand',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#A51931', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#2D2A4A', weight: 2 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#A51931', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Thailand\'s flag has five horizontal stripes: red, white, blue (double width), white, red. The proportions of the stripes are 1:1:2:1:1 from top to bottom, creating a symmetric design with the wider blue centre.',
      'Red represents the nation; white represents the purity of Buddhism; blue represents the monarchy. The three colours together symbolise Nation, Religion, and King — the Thai national ideology.',
    ],
    history: [
      'Thailand (then Siam) used a plain red flag until the early 20th century. White elephants were added for various purposes. In 1917, during World War I, King Rama VI replaced the elephant emblem with the current five-stripe design — reportedly after seeing an elephant-emblem flag accidentally flown upside-down.',
      'The blue stripe was made double-width to give visual weight to the centre and align the flag\'s symbolism with Allied nations (France, UK) who also used red, white, and blue. Thailand has never been colonised.',
    ],
    ctaHeadline: 'Design a Symmetric Stripe Flag',
    ctaBody: 'Remix Thailand\'s five-stripe tricolour with its wide central band, or create your own proportional stripe design.',
  },

  {
    slug: 'indonesia',
    isoCode: 'id',
    name: 'Indonesia',
    officialName: 'Sang Merah Putih',
    category: 'Country Flag',
    continent: 'Asia',
    proportion: '2:3',
    adopted: '1945',
    designType: 'Horizontal Bicolour',
    metaDescription: 'Indonesia flag — official red and white hex codes and the history of Sang Merah Putih from the Majapahit Empire to independence.',
    keywords: 'Indonesia flag, Indonesian flag, red white flag, Sang Merah Putih, Indonesian flag history, Majapahit flag',
    colors: [
      { name: 'Red',   hex: '#CE1126', pantone: 'Pantone 186 C', usage: 'Top stripe — courage' },
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Bottom stripe — purity' },
    ],
    svg: `<rect x="0" y="0" width="900" height="300" fill="#CE1126"/>
        <rect x="0" y="300" width="900" height="300" fill="#FFFFFF"/>`,
    design: {
      name: 'Indonesia',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#CE1126', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Indonesia\'s flag — Sang Merah Putih (The Red and White) — is two equal horizontal stripes: red on top and white below. It is visually identical to Monaco\'s flag but different in proportion (Indonesia 2:3, Monaco 4:5).',
      'Red symbolises courage and the human body; white represents purity and the human spirit. Together they represent the completeness of the Indonesian people.',
    ],
    history: [
      'The red-and-white colour scheme derives from the Majapahit Empire (13th–15th centuries), which flew a red-and-white banner. The colours reappeared in the 1928 Youth Pledge of Indonesian nationalists and were raised at Sukarno\'s proclamation of independence on 17 August 1945.',
      'The proclamation flag was sewn by Fatmawati, Sukarno\'s wife, from cloth given by a Japanese officer. It was raised the morning of independence and is still preserved as a national relic. The constitution adopted it as the national flag.',
    ],
    ctaHeadline: 'Design a Bicolour Flag',
    ctaBody: 'Start from Indonesia\'s bold red and white bicolour and create your own two-stripe horizontal flag.',
  },

  {
    slug: 'philippines',
    isoCode: 'ph',
    name: 'Philippines',
    officialName: 'Watawat ng Pilipinas',
    category: 'Country Flag',
    continent: 'Asia',
    proportion: '1:2',
    adopted: '1898',
    designType: 'Horizontal Bicolour with Triangle',
    metaDescription: 'Philippines flag — official blue, red and white hex codes, the sun and stars, and the history of the Philippine flag.',
    keywords: 'Philippines flag, Philippine flag, blue red white, Watawat ng Pilipinas, Philippine flag history, sun three stars',
    colors: [
      { name: 'Philippine Blue', hex: '#0038A8', pantone: 'Pantone 286 C', usage: 'Top stripe — peace and justice' },
      { name: 'Philippine Red',  hex: '#CE1126', pantone: 'Pantone 186 C', usage: 'Bottom stripe — patriotism' },
      { name: 'White',           hex: '#FFFFFF', pantone: '',              usage: 'Equilateral triangle at hoist' },
      { name: 'Gold',            hex: '#FCD116', pantone: 'Pantone 116 C', usage: 'Sun rays and three stars' },
    ],
    svg: `<rect x="0" y="0" width="900" height="300" fill="#0038A8"/>
        <rect x="0" y="300" width="900" height="300" fill="#CE1126"/>
        <polygon points="0,0 360,300 0,600" fill="#FFFFFF"/>
        <circle cx="120" cy="300" r="60" fill="#FCD116"/>
        <text x="60" y="120" font-size="65" fill="#FCD116">★</text>
        <text x="175" y="120" font-size="65" fill="#FCD116">★</text>
        <text x="120" y="490" font-size="65" fill="#FCD116">★</text>`,
    design: {
      name: 'Philippines',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
          { color: '#0038A8', weight: 1 },
          { color: '#CE1126', weight: 1 },
        ]},
        { id: 'l2', type: 'overlay', visible: true, expanded: false, shape: 'triangle', color: '#FFFFFF', opacity: 100, params: { depth: 40, side: 0 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'The Philippine flag has equal horizontal bands of blue (top) and red (bottom), with a white equilateral triangle at the hoist. Inside the triangle is a golden sun with eight rays — representing the eight provinces that first revolted against Spain — and a golden five-pointed star at each triangle corner representing Luzon, Visayas, and Mindanao.',
      'Uniquely, the flag is flown with red on top during wartime. In peacetime, blue is on top.',
    ],
    history: [
      'Emilio Aguinaldo designed the flag in 1897 while in exile in Hong Kong, and it was first displayed on 28 May 1898 during the Battle of Alapan in the Philippine Revolution. It became the official flag when independence was proclaimed on 12 June 1898.',
      'The flag was banned during American colonial rule (1901–1919) and Japanese occupation (1941–1944). It was restored at full independence on 4 July 1946. The current specifications were standardised by the Flag and Heraldic Code of 1998.',
    ],
    ctaHeadline: 'Design a Triangle Hoist Flag',
    ctaBody: 'Remix the Philippine flag\'s blue-red bicolour with white triangle, or build your own unique canton design.',
  },

  {
    slug: 'vietnam',
    isoCode: 'vn',
    name: 'Vietnam',
    officialName: 'Cờ đỏ sao vàng',
    category: 'Country Flag',
    continent: 'Asia',
    proportion: '2:3',
    adopted: '1955',
    designType: 'Red Field with Star',
    metaDescription: 'Vietnam flag — official red and gold hex codes, the single yellow star, and history of the Vietnamese national flag.',
    keywords: 'Vietnam flag, Vietnamese flag, red gold star, Cờ đỏ sao vàng, Vietnamese flag history, red flag star',
    colors: [
      { name: 'Vietnamese Red',  hex: '#DA251D', pantone: 'Pantone 485 C', usage: 'Field — revolution and blood' },
      { name: 'Vietnamese Gold', hex: '#FFFF00', pantone: 'Pantone 102 C', usage: 'Central five-pointed star' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#DA251D"/>
        <text x="450" y="380" font-size="320" text-anchor="middle" fill="#FFFF00">★</text>`,
    design: {
      name: 'Vietnam',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#DA251D', weight: 1 }] }],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Vietnam\'s flag is a large yellow five-pointed star centred on a red field. The red represents revolution and the blood of those who fought for independence; the yellow star represents the five main classes of Vietnamese society — workers, peasants, intellectuals, traders, and soldiers.',
      'The star\'s five points each represent one group. The proportions are 2:3, and the star should span three-fifths of the flag\'s height.',
    ],
    history: [
      'The red flag with yellow star was designed by Nguyễn Hữu Tiến in 1940 for the Nam Kỳ Uprising against French colonial rule. It was adopted by the Việt Minh (the independence movement led by Hồ Chí Minh) and first raised after Japan\'s defeat in 1945.',
      'North Vietnam used the flag from 1945. After reunification in 1976, it became the flag of the unified Socialist Republic of Vietnam, with the star slightly refined. It remains one of the world\'s most recognisable revolutionary-era flag designs.',
    ],
    ctaHeadline: 'Design a Bold Single-Star Flag',
    ctaBody: 'Remix Vietnam\'s powerful red and gold design, or create your own centred-emblem flag from scratch.',
  },

  {
    slug: 'malaysia',
    isoCode: 'my',
    name: 'Malaysia',
    officialName: 'Jalur Gemilang',
    category: 'Country Flag',
    continent: 'Asia',
    proportion: '1:2',
    adopted: '1963',
    designType: 'Horizontal Stripes with Canton',
    metaDescription: 'Malaysia flag — official red, white and blue hex codes, the Jalur Gemilang stripes, crescent and star.',
    keywords: 'Malaysia flag, Malaysian flag, Jalur Gemilang, red white stripes, crescent star, Malaysian flag history',
    colors: [
      { name: 'Red',    hex: '#CC0001', pantone: 'Pantone 186 C', usage: '7 red horizontal stripes' },
      { name: 'White',  hex: '#FFFFFF', pantone: '',              usage: '7 white horizontal stripes' },
      { name: 'Blue',   hex: '#010066', pantone: 'Pantone 280 C', usage: 'Canton (top-left rectangle)' },
      { name: 'Yellow', hex: '#FFCC00', pantone: 'Pantone 116 C', usage: 'Crescent and 14-pointed star' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#CC0001"/>
        ${Array.from({length:6}, (_,i) => `<rect x="0" y="${i*80+80}" width="900" height="${i%2===0?40:40}" fill="${i%2===0?'#FFFFFF':'#CC0001'}"/>`).join('')}
        <rect x="0" y="0" width="450" height="340" fill="#010066"/>
        <circle cx="195" cy="170" r="85" fill="#FFCC00"/>
        <circle cx="225" cy="155" r="68" fill="#010066"/>
        <text x="335" y="200" font-size="100" text-anchor="middle" fill="#FFCC00">✦</text>`,
    design: {
      name: 'Malaysia',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: Array.from({length:14}, (_,i) => ({ color: i%2===0 ? '#CC0001' : '#FFFFFF', weight: 1 })) },
        { id: 'l2', type: 'overlay', visible: true, expanded: false, shape: 'canton', color: '#010066', opacity: 100, params: { width: 50, height: 57 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'Malaysia\'s flag — Jalur Gemilang (Stripes of Glory) — has 14 alternating red and white horizontal stripes representing the 13 states and the federal territories. A blue canton in the upper hoist holds a yellow crescent and a 14-pointed star (Bintang Persekutuan).',
      'The crescent represents Islam as the national religion. The yellow reflects the colour of the Yang di-Pertuan Agong (Malaysian monarch). The 14-pointed star represents the unity of the 13 states and federal government.',
    ],
    history: [
      'The design is closely related to the United States flag in its stripe layout — both were influenced by the same colonial-era flag tradition. Malaysia\'s flag was first hoisted on 31 August 1957 at independence from Britain.',
      'The current 14-stripe version was adopted in 1963 when Sabah, Sarawak, and Singapore joined the federation (Singapore left in 1965, but the stripes remained 14). The flag was named Jalur Gemilang by Prime Minister Mahathir in 1997.',
    ],
    ctaHeadline: 'Design a Multi-Stripe Flag with Canton',
    ctaBody: 'Remix Malaysia\'s Jalur Gemilang or build your own striped flag with a distinctive canton design.',
  },

  {
    slug: 'singapore',
    isoCode: 'sg',
    name: 'Singapore',
    officialName: 'Flag of Singapore',
    category: 'Country Flag',
    continent: 'Asia',
    proportion: '2:3',
    adopted: '1959',
    designType: 'Horizontal Bicolour with Crescent and Stars',
    metaDescription: 'Singapore flag — official red and white hex codes, the crescent moon and five stars, and history of Singapore\'s national flag.',
    keywords: 'Singapore flag, Singaporean flag, red white crescent stars, Singapore flag history, five stars Singapore',
    colors: [
      { name: 'Red',   hex: '#EF3340', pantone: 'Pantone 032 C', usage: 'Top half — brotherhood and equality' },
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Bottom half — purity and virtue' },
    ],
    svg: `<rect x="0" y="0" width="900" height="300" fill="#EF3340"/>
        <rect x="0" y="300" width="900" height="300" fill="#FFFFFF"/>
        <circle cx="220" cy="150" r="85" fill="#FFFFFF"/>
        <circle cx="270" cy="138" r="68" fill="#EF3340"/>
        <text x="410" y="100" font-size="65" text-anchor="middle" fill="#FFFFFF">★</text>
        <text x="490" y="165" font-size="65" text-anchor="middle" fill="#FFFFFF">★</text>
        <text x="450" y="230" font-size="65" text-anchor="middle" fill="#FFFFFF">★</text>
        <text x="330" y="230" font-size="65" text-anchor="middle" fill="#FFFFFF">★</text>
        <text x="305" y="115" font-size="65" text-anchor="middle" fill="#FFFFFF">★</text>`,
    design: {
      name: 'Singapore',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#EF3340', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Singapore\'s flag has two equal horizontal halves — red on top and white below. In the upper hoist is a white crescent moon and five small white five-pointed stars arranged in a circle.',
      'The crescent represents Singapore as a young nation on the rise. The five stars stand for the nation\'s ideals: democracy, peace, progress, justice, and equality.',
    ],
    history: [
      'The flag was designed by a State Council committee and first raised on 3 December 1959 when Singapore attained self-governance from Britain. Encik Yusof Ishak (later Singapore\'s first President) chaired the committee.',
      'When Singapore briefly joined Malaysia (1963–1965), the flag was retained as the state flag. At full independence on 9 August 1965, it became the national flag. 9 August (National Day) features the flag prominently at celebrations.',
    ],
    ctaHeadline: 'Design a Crescent and Star Flag',
    ctaBody: 'Remix Singapore\'s clean red and white bicolour, or add your own crescent and star emblem in Quick Flags.',
  },

  // ── MIDDLE EAST ───────────────────────────────────────────────────────────────

  {
    slug: 'turkey',
    isoCode: 'tr',
    name: 'Turkey',
    officialName: 'Türk Bayrağı — Ay Yıldız',
    category: 'Country Flag',
    continent: 'Middle East',
    proportion: '2:3',
    adopted: '1844',
    designType: 'Red Field with Crescent and Star',
    metaDescription: 'Turkey flag — official red and white hex codes, the crescent and star, and history of the Türk Bayrağı.',
    keywords: 'Turkey flag, Turkish flag, red crescent star, Türk bayrağı, Ay Yıldız, Turkish flag history',
    colors: [
      { name: 'Turkish Red', hex: '#E30A17', pantone: 'Pantone 032 C', usage: 'Field' },
      { name: 'White',       hex: '#FFFFFF', pantone: '',              usage: 'Crescent and star' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#E30A17"/>
        <circle cx="378" cy="300" r="135" fill="#FFFFFF"/>
        <circle cx="423" cy="285" r="108" fill="#E30A17"/>
        <text x="540" y="330" font-size="110" text-anchor="middle" fill="#FFFFFF">★</text>`,
    design: {
      name: 'Turkey',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#E30A17', weight: 1 }] }],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Turkey\'s flag is a white crescent and a white five-pointed star on a red field. The crescent is slightly offset from centre toward the hoist, with a circle cut from the crescent\'s concave side creating the characteristic crescent shape.',
      'The crescent and star are ancient symbols of Islam and of the Ottoman Empire. The current proportions and exact positioning were codified by law in 1844 under Sultan Abdülmecid I and refined under the Turkish Republic.',
    ],
    history: [
      'The crescent was associated with Constantinople long before Islam — it appeared on Byzantine coins. The Ottoman Empire used a crescent-and-star symbol extensively, and it became widely associated with Islam through Ottoman influence.',
      'After the fall of the Ottoman Empire, Mustafa Kemal Atatürk\'s Turkish Republic (founded 1923) retained the flag unchanged, representing continuity of territory if not of political system. The current precise specifications were standardised in 1936.',
    ],
    ctaHeadline: 'Design a Crescent Flag',
    ctaBody: 'Remix Turkey\'s iconic red crescent and star design, or create your own crescent-emblem flag in Quick Flags.',
  },

  {
    slug: 'israel',
    isoCode: 'il',
    name: 'Israel',
    officialName: 'דגל ישראל — Degel Yisra\'el',
    category: 'Country Flag',
    continent: 'Middle East',
    proportion: '8:11',
    adopted: '1948',
    designType: 'White Field with Blue Stripes and Star of David',
    metaDescription: 'Israel flag — official blue and white hex codes, the Star of David, and history of the Israeli national flag.',
    keywords: 'Israel flag, Israeli flag, Star of David, blue white flag, Degel Yisrael, Israeli flag history',
    colors: [
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Field and central band' },
      { name: 'Blue',  hex: '#0038B8', pantone: 'Pantone 286 C', usage: 'Two horizontal stripes and Star of David' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#FFFFFF"/>
        <rect x="0" y="120" width="900" height="90" fill="#0038B8"/>
        <rect x="0" y="390" width="900" height="90" fill="#0038B8"/>
        <text x="450" y="360" font-size="220" text-anchor="middle" fill="#0038B8">✡</text>`,
    design: {
      name: 'Israel',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#FFFFFF', weight: 1 }] },
        { id: 'l2', type: 'overlay',  visible: true, expanded: false, shape: 'border', color: '#0038B8', opacity: 100, params: { thickness: 15 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'Israel\'s flag has a white field with two horizontal blue stripes (near the top and bottom edges) and a blue Star of David (Magen David) centred between them. The stripe pattern is based on the traditional Jewish prayer shawl (tallit).',
      'The Star of David has been a symbol of Jewish identity since the 17th century and became the emblem of the Zionist movement in the late 19th century. The two-triangle hexagram represents the shield of King David.',
    ],
    history: [
      'The design was proposed by the First Zionist Congress in 1897, based on designs by David Wolffsohn. It was inspired by the colours and stripes of the tallit, combined with the Magen David symbol already associated with Zionism.',
      'Israel declared independence on 14 May 1948 and adopted the flag the same year. The blue shade has been officially specified as Pantone 286 C since a 2004 government decision, ending decades of slight colour variation.',
    ],
    ctaHeadline: 'Design a Symbol-Centred Flag',
    ctaBody: 'Start from Israel\'s blue and white design, add your own central emblem, and export a clean, minimal flag.',
  },

  {
    slug: 'uae',
    isoCode: 'ae',
    name: 'UAE',
    officialName: 'علم الإمارات — ʿAlam al-ʾImārāt',
    category: 'Country Flag',
    continent: 'Middle East',
    proportion: '1:2',
    adopted: '1971',
    designType: 'Horizontal Tricolour with Hoist Stripe',
    metaDescription: 'UAE flag — official green, white, black and red hex codes, the Pan-Arab colours, and the history of the United Arab Emirates flag.',
    keywords: 'UAE flag, United Arab Emirates flag, green white black red, Pan-Arab flag, UAE flag history',
    colors: [
      { name: 'Green', hex: '#009A44', pantone: 'Pantone 355 C', usage: 'Top horizontal stripe' },
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Middle horizontal stripe' },
      { name: 'Black', hex: '#000000', pantone: '',              usage: 'Bottom horizontal stripe' },
      { name: 'Red',   hex: '#FF0000', pantone: 'Pantone 485 C', usage: 'Vertical hoist stripe' },
    ],
    svg: `<rect x="0" y="0" width="900" height="200" fill="#009A44"/>
        <rect x="0" y="200" width="900" height="200" fill="#FFFFFF"/>
        <rect x="0" y="400" width="900" height="200" fill="#000000"/>
        <rect x="0" y="0" width="225" height="600" fill="#FF0000"/>`,
    design: {
      name: 'UAE',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
          { color: '#009A44', weight: 1 },
          { color: '#FFFFFF', weight: 1 },
          { color: '#000000', weight: 1 },
        ]},
        { id: 'l2', type: 'overlay', visible: true, expanded: false, shape: 'canton', color: '#FF0000', opacity: 100, params: { width: 25, height: 100 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'The UAE flag has three horizontal stripes — green (top), white (middle), black (bottom) — crossed by a vertical red stripe on the hoist. The red stripe spans the full height of the flag at one-quarter of its width.',
      'The four Pan-Arab colours — red, green, white, and black — appear in dozens of Arab national flags. They derive from 13th-century Arabic poetry: "White are our deeds, black our battles, green our fields, red our swords."',
    ],
    history: [
      'The UAE was formed on 2 December 1971 from seven Trucial States that had been British protectorates. The flag was designed by 19-year-old Emirati student Abdullah Mohammed Al Maainah, who won a national competition to create the flag for the new federation.',
      'The design uses the Pan-Arab colours that appeared in the flags of the Arab Revolt (1916) and have since been adopted by many Arab states, representing shared heritage and aspirations for Arab unity.',
    ],
    ctaHeadline: 'Design a Pan-Arab Colours Flag',
    ctaBody: 'Remix the UAE\'s bold four-colour design or experiment with your own combination of Pan-Arab stripe colours.',
  },

  {
    slug: 'saudi-arabia',
    isoCode: 'sa',
    name: 'Saudi Arabia',
    officialName: 'علم المملكة العربية السعودية',
    category: 'Country Flag',
    continent: 'Middle East',
    proportion: '2:3',
    adopted: '1973',
    designType: 'Green Field with Script and Sword',
    metaDescription: 'Saudi Arabia flag — official green and white hex codes, the Shahada inscription, and the history of the Saudi national flag.',
    keywords: 'Saudi Arabia flag, Saudi flag, green white flag, Shahada flag, Saudi flag history, Islamic declaration flag',
    colors: [
      { name: 'Islamic Green', hex: '#006C35', pantone: 'Pantone 349 C', usage: 'Field' },
      { name: 'White',         hex: '#FFFFFF', pantone: '',              usage: 'Shahada text and sword' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#006C35"/>
        <text x="450" y="280" font-size="78" text-anchor="middle" fill="#FFFFFF" font-family="serif">لَا إِلَٰهَ إِلَّا ٱللَّٰهُ</text>
        <text x="450" y="360" font-size="60" text-anchor="middle" fill="#FFFFFF" font-family="serif">مُحَمَّدٌ رَسُولُ ٱللَّٰهِ</text>
        <rect x="300" y="400" width="300" height="25" rx="12" fill="#FFFFFF"/>
        <polygon points="560,400 600,412 560,425" fill="#FFFFFF"/>`,
    design: {
      name: 'Saudi Arabia',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#006C35', weight: 1 }] }],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Saudi Arabia\'s flag is a dark green field bearing the Shahada — the Islamic declaration of faith ("There is no god but God; Muhammad is the messenger of God") in white Arabic calligraphy — and beneath it a white Arabian sword pointing to the left (hoist side).',
      'Green is the traditional colour of Islam; the Shahada and sword represent faith and military strength respectively. Due to the religious text, the flag is never flown at half-staff, and great care is taken in its manufacture and disposal.',
    ],
    history: [
      'The green-and-white colour scheme with Arabic script dates to the Wahhabi reform movement in the 18th century. King Abdulaziz ibn Saud unified the Arabian Peninsula between 1902 and 1932, and the Shahada flag became the banner of the new Saudi state.',
      'The current precise design — including the proportions, exact calligraphy style, and sword shape — was standardised in 1973. The Shahada must be written correctly in all reproductions; a reversed or misprinted flag would be considered deeply disrespectful.',
    ],
    ctaHeadline: 'Design a Calligraphy Flag',
    ctaBody: 'Explore Saudi Arabia\'s distinctive green and white design, or create your own symbol-on-field flag in Quick Flags.',
  },

  // ── AFRICA ────────────────────────────────────────────────────────────────────

  {
    slug: 'south-africa',
    isoCode: 'za',
    name: 'South Africa',
    officialName: 'Flag of South Africa',
    category: 'Country Flag',
    continent: 'Africa',
    proportion: '2:3',
    adopted: '1994',
    designType: 'Pall Design — Six Colours',
    metaDescription: 'South Africa flag — official six-colour design, the Y-shape pall, and history of the post-apartheid South African flag.',
    keywords: 'South Africa flag, South African flag, six colors, rainbow flag, post-apartheid flag, South African flag history',
    colors: [
      { name: 'Green',  hex: '#007A4D', pantone: 'Pantone 348 C', usage: 'Y-shape horizontal band' },
      { name: 'Gold',   hex: '#FFB612', pantone: 'Pantone 1235 C', usage: 'Upper Y outline' },
      { name: 'Black',  hex: '#000000', pantone: '',              usage: 'Top left triangle' },
      { name: 'White',  hex: '#FFFFFF', pantone: '',              usage: 'Lower Y outline' },
      { name: 'Red',    hex: '#DE3831', pantone: 'Pantone 485 C', usage: 'Top right stripe' },
      { name: 'Blue',   hex: '#002395', pantone: 'Pantone 280 C', usage: 'Bottom right stripe' },
    ],
    svg: `<rect x="0" y="0" width="900" height="300" fill="#DE3831"/>
        <rect x="0" y="300" width="900" height="300" fill="#002395"/>
        <polygon points="0,0 0,600 450,300" fill="#000000"/>
        <polygon points="0,0 480,300 0,600" fill="#FFB612"/>
        <polygon points="0,0 420,300 0,600" fill="#007A4D"/>
        <polygon points="0,20 400,300 0,580" fill="#007A4D"/>
        <polygon points="0,40 360,300 0,560" fill="#FFFFFF"/>
        <polygon points="420,300 900,200 900,0 0,0 0,40" fill="#DE3831"/>
        <polygon points="420,300 900,400 900,600 0,600 0,560" fill="#002395"/>
        <polygon points="0,0 480,300 0,600" fill="#FFB612" opacity="1"/>
        <polygon points="0,30 440,300 0,570" fill="#007A4D"/>`,
    design: {
      name: 'South Africa',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
          { color: '#DE3831', weight: 1 },
          { color: '#002395', weight: 1 },
        ]},
        { id: 'l2', type: 'overlay', visible: true, expanded: false, shape: 'triangle', color: '#007A4D', opacity: 100, params: { depth: 60, side: 0 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'South Africa\'s flag is a unique six-colour design featuring a green Y-shape (or pall), outlined in gold and white, on a field of red (top), blue (bottom), and black triangle at the hoist. No official symbolic meaning was assigned to individual colours to avoid privileging any one cultural tradition.',
      'The green Y-shape is read as a convergence — representing the coming together of diverse elements of South African society. The six colours draw from the ANC, the Boer Republics\' flags, and the Union of South Africa, weaving multiple histories into one design.',
    ],
    history: [
      'The flag was designed by state herald Fred Brownell and adopted on 27 April 1994 — the day of South Africa\'s first fully democratic election following the end of apartheid. It was initially intended as a temporary flag but proved so popular it was retained permanently.',
      'No flag in history had previously used six colours without repetition. Brownell designed it in one weekend to meet a deadline. It is widely known as the "rainbow nation" flag, reflecting Archbishop Desmond Tutu\'s description of the new South Africa.',
    ],
    ctaHeadline: 'Design a Multi-Colour Convergence Flag',
    ctaBody: 'Take inspiration from South Africa\'s six-colour pall design and build your own convergence flag in Quick Flags.',
  },

  {
    slug: 'egypt',
    isoCode: 'eg',
    name: 'Egypt',
    officialName: 'علم مصر — ʿAlam Miṣr',
    category: 'Country Flag',
    continent: 'Africa',
    proportion: '2:3',
    adopted: '1984',
    designType: 'Horizontal Tricolour with Eagle Emblem',
    metaDescription: 'Egypt flag — official red, white and black hex codes, the Eagle of Saladin, and history of the Egyptian national flag.',
    keywords: 'Egypt flag, Egyptian flag, red white black, Eagle of Saladin, Egyptian flag history, Pan-Arab flag',
    colors: [
      { name: 'Red',   hex: '#CE1126', pantone: 'Pantone 186 C', usage: 'Top stripe — revolution' },
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Middle stripe — peace' },
      { name: 'Black', hex: '#000000', pantone: '',              usage: 'Bottom stripe — oppression ended' },
      { name: 'Gold',  hex: '#C09300', pantone: 'Pantone 124 C', usage: 'Eagle of Saladin emblem' },
    ],
    svg: `<rect x="0" y="0" width="900" height="200" fill="#CE1126"/>
        <rect x="0" y="200" width="900" height="200" fill="#FFFFFF"/>
        <rect x="0" y="400" width="900" height="200" fill="#000000"/>
        <text x="450" y="330" font-size="160" text-anchor="middle" fill="#C09300">🦅</text>`,
    design: {
      name: 'Egypt',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#CE1126', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#000000', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Egypt\'s flag has three equal horizontal stripes of red, white, and black — the Pan-Arab colours — with a golden Eagle of Saladin centred on the white stripe. The eagle holds a scroll with the country\'s official name in Arabic.',
      'The Pan-Arab tricolour of Egypt, Syria, Iraq, and Yemen all share these same three colours. Egypt\'s version is distinguished by the gold eagle emblem.',
    ],
    history: [
      'Egypt has had many flags. The current red-white-black scheme was introduced after the 1952 revolution that overthrew King Farouk. The Eagle of Saladin replaced the Hawk of Quraish in 1984 during President Mubarak\'s administration.',
      'Saladin (Ṣalāḥ ad-Dīn al-Ayyūbī) was the 12th-century Kurdish sultan who ruled Egypt and famously recaptured Jerusalem — making the eagle a symbol of Arab strength and historical pride.',
    ],
    ctaHeadline: 'Design a Pan-Arab Tricolour',
    ctaBody: 'Remix Egypt\'s red, white and black tricolour and add your own central emblem in the Quick Flags editor.',
  },

  {
    slug: 'nigeria',
    isoCode: 'ng',
    name: 'Nigeria',
    officialName: 'Flag of Nigeria',
    category: 'Country Flag',
    continent: 'Africa',
    proportion: '1:2',
    adopted: '1960',
    designType: 'Vertical Tricolour',
    metaDescription: 'Nigeria flag — official green and white hex codes, and the history of the Nigerian national flag from independence in 1960.',
    keywords: 'Nigeria flag, Nigerian flag, green white green, Nigerian flag history, West Africa flag',
    colors: [
      { name: 'Green', hex: '#008751', pantone: 'Pantone 347 C', usage: 'Hoist and fly stripes — agriculture' },
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Centre stripe — peace and unity' },
    ],
    svg: `<rect x="0" y="0" width="300" height="600" fill="#008751"/>
        <rect x="300" y="0" width="300" height="600" fill="#FFFFFF"/>
        <rect x="600" y="0" width="300" height="600" fill="#008751"/>`,
    design: {
      name: 'Nigeria',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'vstripes', visible: true, expanded: false, bands: [
        { color: '#008751', weight: 1 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#008751', weight: 1 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Nigeria\'s flag has three equal vertical stripes: green, white, green. The design is one of the simplest on the African continent — no emblem, no additional colours. Green represents Nigeria\'s rich forests and agricultural wealth; white represents peace and unity.',
      'The proportions are 1:2. The absence of any coat of arms or emblem reflects the desire for a clean, unambiguous national symbol at independence.',
    ],
    history: [
      'The flag was designed by Michael Taiwo Akinkunmi, a 23-year-old Nigerian student studying in London, who submitted it to a competition held by the colonial government ahead of independence. His design was chosen from over 2,500 entries but with the original red sun emblem in the centre removed.',
      'Nigeria gained independence from Britain on 1 October 1960, and the green-white-green flag was raised for the first time. It remains unchanged today, making it one of Africa\'s most enduring flag designs.',
    ],
    ctaHeadline: 'Design a Vertical Tricolour',
    ctaBody: 'Start from Nigeria\'s clean green and white vertical tricolour and build your own symmetrical stripe flag.',
  },

  {
    slug: 'kenya',
    isoCode: 'ke',
    name: 'Kenya',
    officialName: 'Bendera ya Kenya',
    category: 'Country Flag',
    continent: 'Africa',
    proportion: '2:3',
    adopted: '1963',
    designType: 'Horizontal Tricolour with Maasai Shield',
    metaDescription: 'Kenya flag — official black, red and green hex codes, the Maasai shield, and history of Bendera ya Kenya.',
    keywords: 'Kenya flag, Kenyan flag, black red green, Maasai shield, Bendera ya Kenya, Kenyan flag history',
    colors: [
      { name: 'Black', hex: '#000000', pantone: '',              usage: 'Top stripe — the people' },
      { name: 'Red',   hex: '#BB0000', pantone: 'Pantone 186 C', usage: 'Middle stripe — blood shed for freedom' },
      { name: 'Green', hex: '#006600', pantone: 'Pantone 349 C', usage: 'Bottom stripe — the land' },
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Thin borders between stripes' },
    ],
    svg: `<rect x="0" y="0" width="900" height="167" fill="#000000"/>
        <rect x="0" y="167" width="900" height="20" fill="#FFFFFF"/>
        <rect x="0" y="187" width="900" height="226" fill="#BB0000"/>
        <rect x="0" y="413" width="900" height="20" fill="#FFFFFF"/>
        <rect x="0" y="433" width="900" height="167" fill="#006600"/>
        <ellipse cx="450" cy="300" rx="60" ry="120" fill="#BB0000" stroke="#FFFFFF" stroke-width="8"/>
        <line x1="450" y1="160" x2="450" y2="440" stroke="#FFFFFF" stroke-width="10"/>`,
    design: {
      name: 'Kenya',
      flagShape: 'rect32',
      layers: [{ id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [
        { color: '#000000', weight: 3 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#BB0000', weight: 4 },
        { color: '#FFFFFF', weight: 1 },
        { color: '#006600', weight: 3 },
      ]}],
      emblems: [],
      stackOrder: ['l1'],
    },
    breakdown: [
      'Kenya\'s flag has three horizontal stripes — black (top), red (middle), green (bottom) — separated by thin white borders. At the centre is a traditional Maasai warrior\'s shield and two crossed spears in red, black, and white.',
      'Black represents the Kenyan people; red the blood shed for independence; green the land; white peace. The Maasai shield and spears represent the defence of freedom and national heritage.',
    ],
    history: [
      'The flag derives from the banner of the Kenya African National Union (KANU), the party that led Kenya to independence. It was adopted on 12 December 1963 when Kenya became independent from Britain.',
      'The Maasai shield was added to the KANU tricolour to distinguish the national flag from a plain black-red-green banner. The design has remained unchanged since independence, and 12 December (Jamhuri Day) remains Kenya\'s primary national holiday.',
    ],
    ctaHeadline: 'Design an African Tricolour',
    ctaBody: 'Remix Kenya\'s striking black, red and green flag with the Maasai shield, or build your own African-inspired design.',
  },

  // ── OCEANIA ───────────────────────────────────────────────────────────────────

  {
    slug: 'australia',
    isoCode: 'au',
    name: 'Australia',
    officialName: 'Australian National Flag',
    category: 'Country Flag',
    continent: 'Oceania',
    proportion: '1:2',
    adopted: '1954',
    designType: 'Blue Ensign with Union Jack, Stars and Southern Cross',
    metaDescription: 'Australia flag — official blue, red and white hex codes, the Southern Cross and Commonwealth Star, and history of the Australian National Flag.',
    keywords: 'Australia flag, Australian flag, Southern Cross, Union Jack, blue ensign, Australian flag history',
    colors: [
      { name: 'Commonwealth Blue', hex: '#00008B', pantone: 'Pantone 281 C', usage: 'Blue ensign field' },
      { name: 'Red',               hex: '#FF0000', pantone: 'Pantone 485 C', usage: 'Union Jack crosses' },
      { name: 'White',             hex: '#FFFFFF', pantone: '',              usage: 'Stars and cross borders' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#00008B"/>
        <rect x="0" y="0" width="450" height="300" fill="#00008B"/>
        <line x1="0" y1="0" x2="450" y2="300" stroke="#FFFFFF" stroke-width="50"/>
        <line x1="450" y1="0" x2="0" y2="300" stroke="#FFFFFF" stroke-width="50"/>
        <line x1="0" y1="0" x2="450" y2="300" stroke="#FF0000" stroke-width="30"/>
        <line x1="450" y1="0" x2="0" y2="300" stroke="#FF0000" stroke-width="30"/>
        <rect x="0" y="130" width="450" height="40" fill="#FFFFFF"/>
        <rect x="205" y="0" width="40" height="300" fill="#FFFFFF"/>
        <rect x="0" y="140" width="450" height="20" fill="#FF0000"/>
        <rect x="215" y="0" width="20" height="300" fill="#FF0000"/>
        <text x="160" y="500" font-size="110" text-anchor="middle" fill="#FFFFFF">★</text>
        <text x="680" y="200" font-size="70" text-anchor="middle" fill="#FFFFFF">★</text>
        <text x="750" y="360" font-size="50" text-anchor="middle" fill="#FFFFFF">★</text>
        <text x="640" y="430" font-size="50" text-anchor="middle" fill="#FFFFFF">★</text>
        <text x="590" y="300" font-size="40" text-anchor="middle" fill="#FFFFFF">★</text>`,
    design: {
      name: 'Australia',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#00008B', weight: 1 }] },
        { id: 'l2', type: 'overlay',  visible: true, expanded: false, shape: 'canton', color: '#00008B', opacity: 100, params: { width: 50, height: 50 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'Australia\'s flag is a Blue Ensign with three main elements: the Union Jack in the upper hoist (representing historical ties to Britain), a large seven-pointed Commonwealth Star below (six points for the six states, one for the territories), and five stars of the Southern Cross constellation on the fly.',
      'The Southern Cross is visible only from the Southern Hemisphere and has been a navigational symbol for Australians and Pacific peoples for millennia. The flag\'s proportions are 1:2.',
    ],
    history: [
      'Australia became a federation in 1901. A public competition attracted 32,823 entries; five people independently submitted nearly identical designs and shared the prize. The flag was first flown on 3 September 1901.',
      'The Stars and Stripes-style connection to the Crown has made the flag periodically controversial — periodic campaigns since the 1990s have called for a new design without the Union Jack. The current flag was formally recognised by the Flags Act 1953.',
    ],
    ctaHeadline: 'Design a Southern Cross Flag',
    ctaBody: 'Remix Australia\'s Blue Ensign, change the field colour, add your own constellation, and export a unique Southern Hemisphere flag.',
  },

  {
    slug: 'new-zealand',
    isoCode: 'nz',
    name: 'New Zealand',
    officialName: 'Flag of New Zealand',
    category: 'Country Flag',
    continent: 'Oceania',
    proportion: '1:2',
    adopted: '1902',
    designType: 'Blue Ensign with Union Jack and Southern Cross',
    metaDescription: 'New Zealand flag — official blue, red and white hex codes, the Southern Cross design, and history of the New Zealand national flag.',
    keywords: 'New Zealand flag, NZ flag, Southern Cross, Union Jack, blue ensign, New Zealand flag history, Kiwi flag',
    colors: [
      { name: 'Blue',  hex: '#00247D', pantone: 'Pantone 280 C', usage: 'Blue ensign field' },
      { name: 'Red',   hex: '#CC142B', pantone: 'Pantone 186 C', usage: 'Union Jack and Southern Cross stars' },
      { name: 'White', hex: '#FFFFFF', pantone: '',              usage: 'Star outlines and cross borders' },
    ],
    svg: `<rect x="0" y="0" width="900" height="600" fill="#00247D"/>
        <rect x="0" y="0" width="450" height="300" fill="#00247D"/>
        <line x1="0" y1="0" x2="450" y2="300" stroke="#FFFFFF" stroke-width="50"/>
        <line x1="450" y1="0" x2="0" y2="300" stroke="#FFFFFF" stroke-width="50"/>
        <line x1="0" y1="0" x2="450" y2="300" stroke="#CC142B" stroke-width="30"/>
        <line x1="450" y1="0" x2="0" y2="300" stroke="#CC142B" stroke-width="30"/>
        <rect x="0" y="130" width="450" height="40" fill="#FFFFFF"/>
        <rect x="205" y="0" width="40" height="300" fill="#FFFFFF"/>
        <rect x="0" y="140" width="450" height="20" fill="#CC142B"/>
        <rect x="215" y="0" width="20" height="300" fill="#CC142B"/>
        <text x="680" y="190" font-size="80" text-anchor="middle" fill="#CC142B" stroke="#FFFFFF" stroke-width="8">★</text>
        <text x="770" y="350" font-size="60" text-anchor="middle" fill="#CC142B" stroke="#FFFFFF" stroke-width="7">★</text>
        <text x="620" y="420" font-size="60" text-anchor="middle" fill="#CC142B" stroke="#FFFFFF" stroke-width="7">★</text>
        <text x="590" y="260" font-size="50" text-anchor="middle" fill="#CC142B" stroke="#FFFFFF" stroke-width="6">★</text>`,
    design: {
      name: 'New Zealand',
      flagShape: 'rect32',
      layers: [
        { id: 'l1', type: 'hstripes', visible: true, expanded: false, bands: [{ color: '#00247D', weight: 1 }] },
        { id: 'l2', type: 'overlay',  visible: true, expanded: false, shape: 'canton', color: '#00247D', opacity: 100, params: { width: 50, height: 50 } },
      ],
      emblems: [],
      stackOrder: ['l1', 'l2'],
    },
    breakdown: [
      'New Zealand\'s flag is a Blue Ensign with the Union Jack in the upper hoist and four red stars with white borders on the fly, forming the Southern Cross constellation. New Zealand\'s Southern Cross uses only four of the five most prominent stars (unlike Australia\'s five-star version).',
      'The stars are proportionally larger and the shade of blue slightly darker than Australia\'s flag, though the two are often confused. The proportions are 1:2.',
    ],
    history: [
      'New Zealand adopted its Blue Ensign as the national flag in 1902. A 2015–2016 national referendum offered New Zealanders the chance to replace it with a new design (the Koru/Silver Fern design was the main alternative), but 57% voted to retain the existing flag.',
      'The vote reignited debate about New Zealand\'s national identity and relationship with Britain and Australia. Advocates for change argued the flag too closely resembles Australia\'s; supporters of the current design cited historical continuity.',
    ],
    ctaHeadline: 'Design a Southern Cross Flag',
    ctaBody: 'Take New Zealand\'s Southern Cross design as your starting point and build your own unique Pacific flag.',
  },

];
