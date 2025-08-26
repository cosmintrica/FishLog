export interface FishingLocationData {
  name: string;
  latitude: number;
  longitude: number;
  type: 'river' | 'lake' | 'pond';
  county: string;
  fishSpecies: string[];
  description?: string;
}

export const fishingLocations: FishingLocationData[] = [
  // Major Rivers
  { 
    name: "Dunărea - Sector Călărași", 
    latitude: 44.2058, 
    longitude: 27.3306, 
    type: "river", 
    county: "CL", 
    fishSpecies: ["Som", "Crap", "Știucă"],
    description: "Sector principal al Dunării cu peștisori mari"
  },
  { 
    name: "Dunărea - Sector Galați", 
    latitude: 45.4353, 
    longitude: 28.0080, 
    type: "river", 
    county: "GL", 
    fishSpecies: ["Som", "Crap", "Biban"],
    description: "Zonă cu apă adâncă și curenți moderați"
  },
  { 
    name: "Mureșul - Sector Arad", 
    latitude: 46.1866, 
    longitude: 21.3123, 
    type: "river", 
    county: "AR", 
    fishSpecies: ["Știucă", "Biban", "Crap"],
    description: "Râu cu multiple adâncimi și vegetație bogată"
  },
  { 
    name: "Oltul - Sector Râmnicu Vâlcea", 
    latitude: 45.1069, 
    longitude: 24.3692, 
    type: "river", 
    county: "VL", 
    fishSpecies: ["Păstrăv", "Lipan", "Biban"],
    description: "Râu de munte cu apă curată și rece"
  },
  { 
    name: "Argeșul - Sector Pitești", 
    latitude: 44.8565, 
    longitude: 24.8692, 
    type: "river", 
    county: "AG", 
    fishSpecies: ["Crap", "Roșioară", "Biban"],
    description: "Zonă cu maluri înalte și vegetație densă"
  },
  { 
    name: "Siretul - Sector Bacău", 
    latitude: 46.5670, 
    longitude: 26.9146, 
    type: "river", 
    county: "BC", 
    fishSpecies: ["Știucă", "Biban", "Rutilus"],
    description: "Râu larg cu multe cotloane și adâncimi"
  },
  { 
    name: "Someșul Mare - Cluj", 
    latitude: 46.7712, 
    longitude: 23.6236, 
    type: "river", 
    county: "CJ", 
    fishSpecies: ["Păstrăv", "Lipan", "Biban"],
    description: "Râu de munte cu apă cristalină"
  },

  // Major Lakes
  { 
    name: "Lacul Snagov", 
    latitude: 44.7031, 
    longitude: 26.1858, 
    type: "lake", 
    county: "IF", 
    fishSpecies: ["Crap", "Som", "Știucă", "Biban"],
    description: "Lac natural cu fond nisipos și vegetație bogată"
  },
  { 
    name: "Lacul Herastrau", 
    latitude: 44.4795, 
    longitude: 26.0834, 
    type: "lake", 
    county: "B", 
    fishSpecies: ["Crap", "Caras", "Roșioară"],
    description: "Lac urban cu facilități pentru pescuit sportiv"
  },
  { 
    name: "Lacul Morii", 
    latitude: 44.4262, 
    longitude: 26.0155, 
    type: "lake", 
    county: "B", 
    fishSpecies: ["Som", "Crap", "Știucă"],
    description: "Lac artificial cu adâncimi mari"
  },
  { 
    name: "Lacul Vidraru", 
    latitude: 45.3539, 
    longitude: 24.6367, 
    type: "lake", 
    county: "AG", 
    fishSpecies: ["Păstrăv", "Lipan", "Crap"],
    description: "Lac de acumulare în peisaj montan"
  },
  { 
    name: "Lacul Bicaz", 
    latitude: 46.9167, 
    longitude: 25.9333, 
    type: "lake", 
    county: "NT", 
    fishSpecies: ["Păstrăv", "Lipan", "Biban"],
    description: "Lac de munte cu apă foarte curată"
  },
  { 
    name: "Lacul Izvorul Muntelui", 
    latitude: 46.9167, 
    longitude: 25.9333, 
    type: "lake", 
    county: "NT", 
    fishSpecies: ["Crap", "Som", "Știucă"],
    description: "Cel mai mare lac artificial din România"
  },
  { 
    name: "Lacul Siutghiol", 
    latitude: 44.0833, 
    longitude: 28.6167, 
    type: "lake", 
    county: "CT", 
    fishSpecies: ["Crap", "Som", "Biban"],
    description: "Lac de apă dulce lângă Marea Neagră"
  },

  // Fishing Ponds
  { 
    name: "Balta Comana", 
    latitude: 44.1736, 
    longitude: 26.1531, 
    type: "pond", 
    county: "GR", 
    fishSpecies: ["Crap", "Som", "Caras"],
    description: "Baltă naturală cu vegetație abundentă"
  },
  { 
    name: "Balta Ialomiței", 
    latitude: 44.5347, 
    longitude: 27.3806, 
    type: "pond", 
    county: "IL", 
    fishSpecies: ["Som", "Crap", "Știucă"],
    description: "Zonă de luncă cu ape liniștite"
  },
  { 
    name: "Delta Dunării - Mila 23", 
    latitude: 45.0833, 
    longitude: 29.3833, 
    type: "pond", 
    county: "TL", 
    fishSpecies: ["Som", "Crap", "Știucă", "Roșioară"],
    description: "Zonă sălbatică cu biodiversitate excepțională"
  },
  { 
    name: "Balta Brăilei", 
    latitude: 45.2692, 
    longitude: 27.9575, 
    type: "pond", 
    county: "BR", 
    fishSpecies: ["Som", "Crap", "Biban"],
    description: "Zonă de luncă cu canale naturale"
  },

  // Mountain Lakes
  { 
    name: "Lacul Balea", 
    latitude: 45.6064, 
    longitude: 24.6208, 
    type: "lake", 
    county: "SB", 
    fishSpecies: ["Păstrăv", "Lipan"],
    description: "Lac glaciar la altitudine mare"
  },
  { 
    name: "Lacul Oasa", 
    latitude: 45.3667, 
    longitude: 25.4833, 
    type: "lake", 
    county: "BV", 
    fishSpecies: ["Păstrăv", "Lipan"],
    description: "Lac de munte cu apă foarte rece"
  },
  { 
    name: "Lacul Roșu", 
    latitude: 46.6833, 
    longitude: 25.9500, 
    type: "lake", 
    county: "HR", 
    fishSpecies: ["Păstrăv", "Lipan"],
    description: "Lac natural format din alunecări de teren"
  },

  // Additional locations
  { 
    name: "Lacul Tarnița", 
    latitude: 46.6833, 
    longitude: 23.7833, 
    type: "lake", 
    county: "CJ", 
    fishSpecies: ["Crap", "Biban", "Știucă"],
    description: "Lac de acumulare cu maluri înalte"
  },
  { 
    name: "Lacul Gilău", 
    latitude: 46.7333, 
    longitude: 23.4167, 
    type: "lake", 
    county: "CJ", 
    fishSpecies: ["Crap", "Biban"],
    description: "Lac artificial în zona colinară"
  },
  { 
    name: "Prutul - Sector Iași", 
    latitude: 47.1585, 
    longitude: 27.6014, 
    type: "river", 
    county: "IS", 
    fishSpecies: ["Crap", "Rutilus", "Biban"],
    description: "Râu de frontieră cu ape liniștite"
  }
];
