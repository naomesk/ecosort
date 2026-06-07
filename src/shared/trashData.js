/**
 * shared/trashData.js
 *
 * CATEGORIES — all possible bin types.
 *   hasImage: true  → loads /assets/images/bins/<key>-bin-closed/open.png
 *   hasImage: false → rendered as a glowing colored rectangle
 *
 * LEVEL_BIN_KEYS — which bins appear per level.
 *   Level 1: recyclable · general · organic          (3 bins — easy)
 *   Level 2: paper · plastic · general · organic     (4 bins — medium)
 *   Level 3: paper · plastic · metal · general · organic · hazardous  (6 bins — hard)
 *
 * TRASH_ITEMS — each item's `category` must be a key in CATEGORIES.
 *   `id`    → filename in /assets/images/trash/<id>.png
 *   `level` → which level pool this item belongs to
 *   `hint`  → feedback shown after classification
 */

export const CATEGORIES = {
  recyclable: { label: 'Recyclable', color: '#43a047', icon: '♻️',  hasImage: false },
  paper:      { label: 'Paper',      color: '#ffb74d', icon: '📄',  hasImage: true  },
  plastic:    { label: 'Plastic',    color: '#29b6f6', icon: '🧴',  hasImage: true  },
  metal:      { label: 'Metal',      color: '#90a4ae', icon: '🥫',  hasImage: true  },
  general:    { label: 'General',    color: '#78909c', icon: '🗑️', hasImage: true  },
  organic:    { label: 'Organic',    color: '#66bb6a', icon: '🍃',  hasImage: true  },
  hazardous:  { label: 'Hazardous',  color: '#ffee58', icon: '☣️',  hasImage: false },
};

/** Bin keys shown in each level, in left-to-right order. */
export const LEVEL_BIN_KEYS = {
  1: ['recyclable', 'general', 'organic'],
  2: ['paper', 'plastic', 'general', 'organic'],
  3: ['paper', 'plastic', 'metal', 'general', 'organic', 'hazardous'],
};

export const TRASH_ITEMS = [
  // ── Level 1  (bins: recyclable · general · organic) ──────────────────────
  { id: 'newspaper',        label: 'Newspaper',         category: 'recyclable', level: 1, hint: 'Paper is recyclable — give it a second life!' },
  { id: 'carton',           label: 'Carton',            category: 'recyclable', level: 1, hint: 'Rinse and flatten cartons before recycling.' },
  { id: 'milk-carton',      label: 'Milk Carton',       category: 'recyclable', level: 1, hint: 'Rinse out the milk first, then recycle.' },
  { id: 'plastic-bottle',   label: 'Plastic Bottle',    category: 'recyclable', level: 1, hint: 'Empty and rinse plastic bottles before recycling.' },
  { id: 'glass-jar',        label: 'Glass Jar',         category: 'recyclable', level: 1, hint: 'Glass can be recycled endlessly — rinse it first.' },
  { id: 'chopsticks',       label: 'Chopsticks',        category: 'general',    level: 1, hint: 'Wooden chopsticks cannot be recycled or composted easily.' },
  { id: 'ceramic-mug',      label: 'Ceramic Mug',       category: 'general',    level: 1, hint: 'Ceramics break recycling machinery — general bin.' },
  { id: 'styrofoam',        label: 'Styrofoam',         category: 'general',    level: 1, hint: 'Most styrofoam is not recyclable — general waste.' },
  { id: 'tupperware',       label: 'Tupperware',        category: 'general',    level: 1, hint: 'Old food containers contaminated with residue go in general.' },
  { id: 'banana-peel',      label: 'Banana Peel',       category: 'organic',    level: 1, hint: 'Banana peels are organic — compost them!' },
  { id: 'vegetable-scraps', label: 'Vegetable Scraps',  category: 'organic',    level: 1, hint: 'Vegetable scraps are great compost material.' },

  // ── Level 2  (bins: paper · plastic · general · organic) ─────────────────
  { id: 'newspaper',        label: 'Newspaper',         category: 'paper',      level: 2, hint: 'Newspaper is a clean paper product — recycle it.' },
  { id: 'notebook',         label: 'Notebook',          category: 'paper',      level: 2, hint: 'Remove the wire binding, then recycle the paper.' },
  { id: 'paper-bag',        label: 'Paper Bag',         category: 'paper',      level: 2, hint: 'Paper bags are recyclable if dry and uncontaminated.' },
  { id: 'milk-carton',      label: 'Milk Carton',       category: 'paper',      level: 2, hint: 'Milk cartons are paperboard — rinse and recycle.' },
  { id: 'carton',           label: 'Carton',            category: 'paper',      level: 2, hint: 'Juice/food cartons are recyclable paper products.' },
  { id: 'plastic-bottle',   label: 'Plastic Bottle',    category: 'plastic',    level: 2, hint: 'PET plastic bottles are widely recyclable.' },
  { id: 'plastic-cup',      label: 'Plastic Cup',       category: 'plastic',    level: 2, hint: 'Rinse disposable plastic cups before recycling.' },
  { id: 'plastic-straw',    label: 'Plastic Straw',     category: 'plastic',    level: 2, hint: 'Small plastics often slip through — check local rules.' },
  { id: 'shampoo-bottle',   label: 'Shampoo Bottle',    category: 'plastic',    level: 2, hint: 'Rinse out the shampoo, then recycle the plastic bottle.' },
  { id: 'yoghurt-cup',      label: 'Yoghurt Cup',       category: 'plastic',    level: 2, hint: 'Rinse the yoghurt cup — it is #5 plastic, usually recyclable.' },
  { id: 'tupperware',       label: 'Tupperware',        category: 'general',    level: 2, hint: 'Old stained tupperware is hard to recycle — general bin.' },
  { id: 'ceramic-mug',      label: 'Ceramic Mug',       category: 'general',    level: 2, hint: 'Ceramics damage sorting equipment — general waste.' },
  { id: 'chopsticks',       label: 'Chopsticks',        category: 'general',    level: 2, hint: 'Disposable wooden chopsticks go in general waste.' },
  { id: 'styrofoam',        label: 'Styrofoam',         category: 'general',    level: 2, hint: 'Expanded polystyrene is rarely accepted for recycling.' },
  { id: 'bubble-wrap',      label: 'Bubble Wrap',       category: 'general',    level: 2, hint: 'Flexible plastics like bubble wrap go in general waste.' },
  { id: 'banana-peel',      label: 'Banana Peel',       category: 'organic',    level: 2, hint: 'Organic waste — toss it in the compost bin.' },
  { id: 'vegetable-scraps', label: 'Vegetable Scraps',  category: 'organic',    level: 2, hint: 'All vegetable peelings and scraps are compostable.' },

  // ── Level 3  (bins: paper · plastic · metal · general · organic · hazardous)
  { id: 'newspaper',        label: 'Newspaper',         category: 'paper',      level: 3, hint: 'Paper — keep it dry and uncontaminated.' },
  { id: 'notebook',         label: 'Notebook',          category: 'paper',      level: 3, hint: 'Paper notebook — remove the spiral and recycle.' },
  { id: 'carton',           label: 'Carton',            category: 'paper',      level: 3, hint: 'Rinse and flatten cartons for paper recycling.' },
  { id: 'paper-bag',        label: 'Paper Bag',         category: 'paper',      level: 3, hint: 'Clean, dry paper bags are recyclable.' },
  { id: 'plastic-bottle',   label: 'Plastic Bottle',    category: 'plastic',    level: 3, hint: 'PET plastic is recyclable — rinse first.' },
  { id: 'plastic-cup',      label: 'Plastic Cup',       category: 'plastic',    level: 3, hint: 'Rinse plastic cups before placing in plastic bin.' },
  { id: 'shampoo-bottle',   label: 'Shampoo Bottle',    category: 'plastic',    level: 3, hint: 'HDPE plastic bottles are accepted in most programs.' },
  { id: 'soda-can',         label: 'Soda Can',          category: 'metal',      level: 3, hint: 'Aluminium cans are highly valuable — always recycle!' },
  { id: 'canned-food',      label: 'Canned Food',       category: 'metal',      level: 3, hint: 'Steel food tins are recyclable — give them a quick rinse.' },
  { id: 'aluminum-foil',    label: 'Aluminium Foil',    category: 'metal',      level: 3, hint: 'Scrunch foil into a ball so it does not blow away in sorting.' },
  { id: 'styrofoam',        label: 'Styrofoam',         category: 'general',    level: 3, hint: 'Polystyrene is general waste — not accepted in most recycling.' },
  { id: 'broken-glass',     label: 'Broken Glass',      category: 'general',    level: 3, hint: 'Broken glass is too dangerous for recycling — general bin.' },
  { id: 'ceramic-mug',      label: 'Ceramic Mug',       category: 'general',    level: 3, hint: 'Ceramics cannot be sorted with glass — general waste.' },
  { id: 'banana-peel',      label: 'Banana Peel',       category: 'organic',    level: 3, hint: 'Organic waste — compost it to nourish the soil.' },
  { id: 'vegetable-scraps', label: 'Vegetable Scraps',  category: 'organic',    level: 3, hint: 'Vegetable peels are perfect compost material.' },
  { id: 'battery-removebg-preview', label: 'Battery',   category: 'hazardous',  level: 3, hint: 'Batteries contain toxic chemicals — always dispose safely.' },
  { id: 'spray-can',        label: 'Spray Can',         category: 'hazardous',  level: 3, hint: 'Pressurised aerosols are hazardous — never put in general waste.' },
  { id: 'light-bulb',       label: 'Light Bulb',        category: 'hazardous',  level: 3, hint: 'Fluorescent and CFL bulbs contain mercury — hazardous waste.' },
];

export function getItemsForLevel(level) {
  return TRASH_ITEMS.filter(item => item.level === level);
}

export function getCategory(categoryId) {
  return CATEGORIES[categoryId] ?? null;
}
