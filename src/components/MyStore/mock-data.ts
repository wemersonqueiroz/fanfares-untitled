// ── Public types ──────────────────────────────────────────────────────────────

export type StoreItemType =
  | "article"
  | "video"
  | "podcast"
  | "audiobook"
  | "book"
  | "song"
  | "album"

export type StoreItem = {
  id: string
  type: StoreItemType
  title: string
  creator: string
  thumbnailUrl?: string
}

export type StoreCollection = {
  id: string
  title: string
  items: StoreItem[]
}

// Picsum helpers — deterministic images by seed
const sq   = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`
const wide = (seed: string) => `https://picsum.photos/seed/${seed}/640/360`
const book = (seed: string) => `https://picsum.photos/seed/${seed}/240/300`

function thumb(type: StoreItemType, seed: string) {
  if (type === "book") return book(seed)
  if (type === "article" || type === "video" || type === "podcast") return wide(seed)
  return sq(seed)
}

function item(
  id: string,
  type: StoreItemType,
  title: string,
  creator: string,
  seed: string
): StoreItem {
  return { id, type, title, creator, thumbnailUrl: thumb(type, seed) }
}

// ── Mock data ─────────────────────────────────────────────────────────────────

export const MOCK_STORE_COLLECTIONS: StoreCollection[] = [
  {
    id: "col-1",
    title: "Homesteading for Beginners",
    items: [
      item("i-1-1", "song",      "Country Roots",                "Wilder Banks",    "country-roots"),
      item("i-1-2", "book",      "The Backyard Homestead",       "Carleen Madigan", "backyard-homestead"),
      item("i-1-3", "article",   "Starting Your First Garden",   "Mara Winters",    "first-garden"),
      item("i-1-4", "audiobook", "Modern Self-Sufficiency",      "Felix Osei",      "modern-self-suff"),
      item("i-1-5", "album",     "Sunrise on the Farm",          "Petra Sol",       "sunrise-farm"),
      item("i-1-6", "podcast",   "Beginner Homesteaders",        "Land & Loaf",     "beginner-homestead"),
    ],
  },
  {
    id: "col-2",
    title: "Become Energy Independent",
    items: [
      item("i-2-1", "video",     "Solar Setup Walkthrough",      "Off-Grid Hub",      "solar-setup"),
      item("i-2-2", "article",   "Sizing Your Battery Bank",     "Naomi Park",        "battery-bank"),
      item("i-2-3", "audiobook", "The Off-Grid Handbook",        "Dr. Arjun Mehta",   "offgrid-handbook"),
      item("i-2-4", "book",      "Power From the Wind",          "Selena Holt",       "power-wind"),
      item("i-2-5", "song",      "Voltage Drift",                "Neon Drifter",      "voltage-drift"),
    ],
  },
  {
    id: "col-3",
    title: "Catch It, Kill It, Cook It",
    items: [
      item("i-3-1", "podcast",   "Field to Table Stories",       "The Hunt Cast",     "field-table"),
      item("i-3-2", "book",      "The Hunter's Cookbook",        "Steven Rinella",    "hunters-cookbook"),
      item("i-3-3", "video",     "Butchering a Whole Deer",      "Wild Kitchen",      "butcher-deer"),
      item("i-3-4", "song",      "Smoke and Embers",             "Kael Frost",        "smoke-embers"),
      item("i-3-5", "album",     "Campfire Sessions",            "The Fades",         "campfire-sessions"),
    ],
  },
  {
    id: "col-4",
    title: "Grow Your Own Food",
    items: [
      item("i-4-1", "article",   "Companion Planting 101",       "Yara Molina",       "companion-plant"),
      item("i-4-2", "audiobook", "The Vegetable Gardener's Bible","Edward C. Smith",  "veg-bible"),
      item("i-4-3", "song",      "Garden Hymn",                  "Lyra Voss",         "garden-hymn"),
      item("i-4-4", "book",      "Seed to Harvest",              "Cora Delaney",      "seed-harvest"),
      item("i-4-5", "podcast",   "Permaculture in Practice",     "Greenline Radio",   "permaculture"),
    ],
  },
  {
    id: "col-5",
    title: "Homemade Weapons",
    items: [
      item("i-5-1", "song",      "Forged in Steel",              "Blaine Xu",         "forged-steel"),
      item("i-5-2", "book",      "The Bowyer's Bible",           "Jim Hamm",          "bowyers-bible"),
      item("i-5-3", "article",   "Knife-Making Fundamentals",    "Remy St. Claire",   "knife-making"),
      item("i-5-4", "audiobook", "Bushcraft Tools & Techniques", "Mors Kochanski",    "bushcraft-tools"),
      item("i-5-5", "album",     "Workshop Tape",                "Mirror Coast",      "workshop-tape"),
    ],
  },
  {
    id: "col-6",
    title: "Music for the Revolution",
    items: [
      item("i-6-1", "song",      "Rise Together",                "Cosmo Wave",        "rise-together"),
      item("i-6-2", "book",      "Songs of Resistance",          "Dina Vance",        "songs-resistance"),
      item("i-6-3", "article",   "The Protest Anthem Returns",   "Luke Braxton",      "protest-anthem"),
      item("i-6-4", "audiobook", "The Folk Tradition",           "Pete Seeger Estate","folk-tradition"),
      item("i-6-5", "album",     "Streets on Fire",              "Lyra Voss",         "streets-fire"),
    ],
  },
]
