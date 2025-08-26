export interface FishSpecies {
  id: string;
  name: string;
  scientificName: string;
  category: 'freshwater' | 'mountain' | 'large';
  description: string;
}

export const fishSpecies: FishSpecies[] = [
  // Large Fish
  {
    id: 'carp',
    name: 'Crap',
    scientificName: 'Cyprinus carpio',
    category: 'large',
    description: 'Pește de apă dulce foarte popular în pescuitul sportiv'
  },
  {
    id: 'catfish',
    name: 'Som',
    scientificName: 'Silurus glanis',
    category: 'large',
    description: 'Cel mai mare pește de apă dulce din România'
  },
  {
    id: 'pike',
    name: 'Știucă',
    scientificName: 'Esox lucius',
    category: 'large',
    description: 'Prădător agresiv cu dinți ascuțiți'
  },
  {
    id: 'zander',
    name: 'Șalău',
    scientificName: 'Sander lucioperca',
    category: 'large',
    description: 'Prădător de apă dulce cu carne foarte gustoasă'
  },
  {
    id: 'asp',
    name: 'Avat',
    scientificName: 'Leuciscus aspius',
    category: 'large',
    description: 'Prădător de suprafață foarte sportiv'
  },

  // Freshwater Fish
  {
    id: 'perch',
    name: 'Biban',
    scientificName: 'Perca fluviatilis',
    category: 'freshwater',
    description: 'Pește cu dungi verticale și înotătoare spinoase'
  },
  {
    id: 'roach',
    name: 'Rutilus',
    scientificName: 'Rutilus rutilus',
    category: 'freshwater',
    description: 'Pește de bancă foarte comun în apele românești'
  },
  {
    id: 'rudd',
    name: 'Roșioară',
    scientificName: 'Scardinius erythrophthalmus',
    category: 'freshwater',
    description: 'Pește cu înotătoare roșii și corp comprimat lateral'
  },
  {
    id: 'bream',
    name: 'Plătică',
    scientificName: 'Abramis brama',
    category: 'freshwater',
    description: 'Pește de fund cu corpul foarte comprimat lateral'
  },
  {
    id: 'barbel',
    name: 'Morunaș',
    scientificName: 'Barbus barbus',
    category: 'freshwater',
    description: 'Pește de fund cu mustăți caracteristice'
  },
  {
    id: 'chub',
    name: 'Cleanul',
    scientificName: 'Squalius cephalus',
    category: 'freshwater',
    description: 'Pește omnivore cu capul mare și gura lată'
  },
  {
    id: 'crucian',
    name: 'Caras',
    scientificName: 'Carassius carassius',
    category: 'freshwater',
    description: 'Rudă apropiată a crapului, mai rezistent la condiții dificile'
  },
  {
    id: 'tench',
    name: 'Lin',
    scientificName: 'Tinca tinca',
    category: 'freshwater',
    description: 'Pește de fund cu pielea acoperită de mucus'
  },
  {
    id: 'bleak',
    name: 'Oblețel',
    scientificName: 'Alburnus alburnus',
    category: 'freshwater',
    description: 'Pește mic de suprafață cu solzi argintii'
  },
  {
    id: 'dace',
    name: 'Bălțat',
    scientificName: 'Leuciscus leuciscus',
    category: 'freshwater',
    description: 'Pește de apă curată cu corpul fusiform'
  },

  // Mountain Fish
  {
    id: 'trout',
    name: 'Păstrăv',
    scientificName: 'Salmo trutta',
    category: 'mountain',
    description: 'Pește de munte cu pete caracteristice'
  },
  {
    id: 'grayling',
    name: 'Lipan',
    scientificName: 'Thymallus thymallus',
    category: 'mountain',
    description: 'Pește de munte cu înotătoarea dorsală foarte dezvoltată'
  },
  {
    id: 'huchen',
    name: 'Lostrița',
    scientificName: 'Hucho hucho',
    category: 'mountain',
    description: 'Salmonidă mare și rară din apele de munte'
  },
  {
    id: 'char',
    name: 'Păstrăv de lac',
    scientificName: 'Salvelinus alpinus',
    category: 'mountain',
    description: 'Salmonidă de apă rece cu colorație variată'
  },

  // Additional species
  {
    id: 'ide',
    name: 'Jeleu',
    scientificName: 'Leuciscus idus',
    category: 'freshwater',
    description: 'Pește de apă curgătoare cu corpul alungit'
  },
  {
    id: 'vimba',
    name: 'Vimba',
    scientificName: 'Vimba vimba',
    category: 'freshwater',
    description: 'Pește migratoriu cu botul prelungit'
  },
  {
    id: 'nase',
    name: 'Porcușor',
    scientificName: 'Chondrostoma nasus',
    category: 'freshwater',
    description: 'Pește cu botul caracteristic în formă de rîț'
  },
  {
    id: 'gudgeon',
    name: 'Grunduleț',
    scientificName: 'Gobio gobio',
    category: 'freshwater',
    description: 'Pește mic de fund cu două mustăți'
  }
];

export const fishCategories = [
  { id: 'all', name: 'Toate speciile' },
  { id: 'large', name: 'Pești mari' },
  { id: 'freshwater', name: 'Pești de apă dulce' },
  { id: 'mountain', name: 'Pești de munte' }
];

export const romanianCounties = [
  { code: 'AB', name: 'Alba' },
  { code: 'AR', name: 'Arad' },
  { code: 'AG', name: 'Argeș' },
  { code: 'BC', name: 'Bacău' },
  { code: 'BH', name: 'Bihor' },
  { code: 'BN', name: 'Bistrița-Năsăud' },
  { code: 'BT', name: 'Botoșani' },
  { code: 'BV', name: 'Brașov' },
  { code: 'BR', name: 'Brăila' },
  { code: 'B', name: 'București' },
  { code: 'BZ', name: 'Buzău' },
  { code: 'CS', name: 'Caraș-Severin' },
  { code: 'CL', name: 'Călărași' },
  { code: 'CJ', name: 'Cluj' },
  { code: 'CT', name: 'Constanța' },
  { code: 'CV', name: 'Covasna' },
  { code: 'DB', name: 'Dâmbovița' },
  { code: 'DJ', name: 'Dolj' },
  { code: 'GL', name: 'Galați' },
  { code: 'GR', name: 'Giurgiu' },
  { code: 'GJ', name: 'Gorj' },
  { code: 'HR', name: 'Harghita' },
  { code: 'HD', name: 'Hunedoara' },
  { code: 'IL', name: 'Ialomița' },
  { code: 'IS', name: 'Iași' },
  { code: 'IF', name: 'Ilfov' },
  { code: 'MM', name: 'Maramureș' },
  { code: 'MH', name: 'Mehedinți' },
  { code: 'MS', name: 'Mureș' },
  { code: 'NT', name: 'Neamț' },
  { code: 'OT', name: 'Olt' },
  { code: 'PH', name: 'Prahova' },
  { code: 'SM', name: 'Satu Mare' },
  { code: 'SJ', name: 'Sălaj' },
  { code: 'SB', name: 'Sibiu' },
  { code: 'SV', name: 'Suceava' },
  { code: 'TR', name: 'Teleorman' },
  { code: 'TM', name: 'Timiș' },
  { code: 'TL', name: 'Tulcea' },
  { code: 'VS', name: 'Vaslui' },
  { code: 'VL', name: 'Vâlcea' },
  { code: 'VN', name: 'Vrancea' }
];
