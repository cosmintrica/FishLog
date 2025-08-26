import { type User, type InsertUser, type FishingRecord, type InsertFishingRecord, type FishingLocation, type InsertFishingLocation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Fishing Records
  getFishingRecord(id: string): Promise<FishingRecord | undefined>;
  getFishingRecords(): Promise<FishingRecord[]>;
  getFishingRecordsByUser(userId: string): Promise<FishingRecord[]>;
  createFishingRecord(record: InsertFishingRecord): Promise<FishingRecord>;
  
  // Fishing Locations
  getFishingLocation(id: string): Promise<FishingLocation | undefined>;
  getFishingLocations(): Promise<FishingLocation[]>;
  createFishingLocation(location: InsertFishingLocation): Promise<FishingLocation>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private fishingRecords: Map<string, FishingRecord>;
  private fishingLocations: Map<string, FishingLocation>;

  constructor() {
    this.users = new Map();
    this.fishingRecords = new Map();
    this.fishingLocations = new Map();
    
    // Initialize with Romanian fishing locations
    this.initializeFishingLocations();
    this.initializeMockRecords();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Fishing Records methods
  async getFishingRecord(id: string): Promise<FishingRecord | undefined> {
    return this.fishingRecords.get(id);
  }

  async getFishingRecords(): Promise<FishingRecord[]> {
    return Array.from(this.fishingRecords.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getFishingRecordsByUser(userId: string): Promise<FishingRecord[]> {
    return Array.from(this.fishingRecords.values())
      .filter(record => record.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createFishingRecord(insertRecord: InsertFishingRecord): Promise<FishingRecord> {
    const id = randomUUID();
    const record: FishingRecord = {
      ...insertRecord,
      id,
      verified: false,
      createdAt: new Date()
    };
    this.fishingRecords.set(id, record);
    return record;
  }

  // Fishing Locations methods
  async getFishingLocation(id: string): Promise<FishingLocation | undefined> {
    return this.fishingLocations.get(id);
  }

  async getFishingLocations(): Promise<FishingLocation[]> {
    return Array.from(this.fishingLocations.values());
  }

  async createFishingLocation(insertLocation: InsertFishingLocation): Promise<FishingLocation> {
    const id = randomUUID();
    const location: FishingLocation = {
      ...insertLocation,
      id
    };
    this.fishingLocations.set(id, location);
    return location;
  }

  private initializeFishingLocations() {
    const locations: Omit<FishingLocation, 'id'>[] = [
      // DUNĂREA - Fluviu Principal
      { name: "Dunărea - Sector Călărași", latitude: "44.2058", longitude: "27.3306", type: "river", county: "CL", fishSpecies: ["Som", "Crap", "Știucă", "Șalău"], description: "Sector principal al Dunării cu peștisori mari" },
      { name: "Dunărea - Sector Galați", latitude: "45.4353", longitude: "28.0080", type: "river", county: "GL", fishSpecies: ["Som", "Crap", "Biban", "Șalău"], description: "Zonă cu apă adâncă și curenți moderați" },
      { name: "Dunărea - Sector Giurgiu", latitude: "43.9037", longitude: "25.9699", type: "river", county: "GR", fishSpecies: ["Som", "Crap", "Știucă"], description: "Zonă cu multe cotloane și vegetație" },
      { name: "Dunărea - Sector Tulcea", latitude: "45.1667", longitude: "28.8000", type: "river", county: "TL", fishSpecies: ["Som", "Crap", "Știucă", "Roșioară"], description: "Aproape de Delta Dunării" },
      { name: "Dunărea - Sector Drobeta Turnu Severin", latitude: "44.6306", longitude: "22.6564", type: "river", county: "MH", fishSpecies: ["Som", "Crap", "Știucă"], description: "Zona Porților de Fier" },
      
      // RÂURI MAJORE
      { name: "Mureșul - Sector Arad", latitude: "46.1866", longitude: "21.3123", type: "river", county: "AR", fishSpecies: ["Știucă", "Biban", "Crap"], description: "Râu cu multiple adâncimi și vegetație bogată" },
      { name: "Mureșul - Sector Deva", latitude: "45.8667", longitude: "22.9000", type: "river", county: "HD", fishSpecies: ["Crap", "Biban", "Știucă"], description: "Sector muntos cu ape rapide" },
      { name: "Mureșul - Sector Târgu Mureș", latitude: "46.5425", longitude: "24.5579", type: "river", county: "MS", fishSpecies: ["Crap", "Biban", "Roșioară"], description: "Zonă de câmpie cu ape liniștite" },
      
      { name: "Oltul - Sector Râmnicu Vâlcea", latitude: "45.1069", longitude: "24.3692", type: "river", county: "VL", fishSpecies: ["Păstrăv", "Lipan", "Biban"], description: "Râu de munte cu apă curată și rece" },
      { name: "Oltul - Sector Corabia", latitude: "43.7667", longitude: "24.5000", type: "river", county: "OT", fishSpecies: ["Crap", "Som", "Știucă"], description: "Sectorul inferior cu peștisori mari" },
      
      { name: "Argeșul - Sector Pitești", latitude: "44.8565", longitude: "24.8692", type: "river", county: "AG", fishSpecies: ["Crap", "Roșioară", "Biban"], description: "Zonă cu maluri înalte și vegetație densă" },
      { name: "Argeșul - Sector Oltenița", latitude: "44.0833", longitude: "26.6333", type: "river", county: "CL", fishSpecies: ["Som", "Crap", "Știucă"], description: "Aproape de vărsarea în Dunăre" },
      
      { name: "Siretul - Sector Bacău", latitude: "46.5670", longitude: "26.9146", type: "river", county: "BC", fishSpecies: ["Știucă", "Biban", "Rutilus"], description: "Râu larg cu multe cotloane și adâncimi" },
      { name: "Siretul - Sector Suceava", latitude: "47.6500", longitude: "26.2500", type: "river", county: "SV", fishSpecies: ["Păstrăv", "Lipan", "Biban"], description: "Sectorul superior muntos" },
      { name: "Siretul - Sector Galați", latitude: "45.4500", longitude: "28.0500", type: "river", county: "GL", fishSpecies: ["Som", "Crap", "Știucă"], description: "Zonă de câmpie cu ape adânci" },
      
      { name: "Prutul - Sector Iași", latitude: "47.1585", longitude: "27.6014", type: "river", county: "IS", fishSpecies: ["Crap", "Rutilus", "Biban"], description: "Râu de frontieră cu ape liniștite" },
      { name: "Prutul - Sector Vaslui", latitude: "46.6333", longitude: "27.7333", type: "river", county: "VS", fishSpecies: ["Crap", "Biban", "Roșioară"], description: "Zonă cu vegetație bogată" },
      
      { name: "Someșul Mare - Cluj", latitude: "46.7712", longitude: "23.6236", type: "river", county: "CJ", fishSpecies: ["Păstrăv", "Lipan", "Biban"], description: "Râu de munte cu apă cristalină" },
      { name: "Someșul Mic - Cluj", latitude: "46.7000", longitude: "23.5667", type: "river", county: "CJ", fishSpecies: ["Păstrăv", "Biban", "Lipan"], description: "Afluent muntos cu ape rapide" },
      
      { name: "Jiul - Sector Craiova", latitude: "44.3167", longitude: "23.8000", type: "river", county: "DJ", fishSpecies: ["Crap", "Biban", "Som"], description: "Râu de câmpie cu multe meandre" },
      { name: "Jiul - Sector Petroșani", latitude: "45.4167", longitude: "23.3667", type: "river", county: "HD", fishSpecies: ["Păstrăv", "Lipan"], description: "Sectorul superior muntos" },
      
      { name: "Buzăul - Sector Buzău", latitude: "45.1500", longitude: "26.8167", type: "river", county: "BZ", fishSpecies: ["Crap", "Biban", "Roșioară"], description: "Râu de deal cu ape moderate" },
      { name: "Dâmbovița - Sector București", latitude: "44.4268", longitude: "26.1025", type: "river", county: "B", fishSpecies: ["Crap", "Caras", "Roșioară"], description: "Râu urban cu facilități" },
      
      // LACURI NATURALE ȘI ARTIFICIALE
      { name: "Lacul Snagov", latitude: "44.7031", longitude: "26.1858", type: "lake", county: "IF", fishSpecies: ["Crap", "Som", "Știucă", "Biban"], description: "Lac natural cu fond nisipos și vegetație bogată" },
      { name: "Lacul Herastrau", latitude: "44.4795", longitude: "26.0834", type: "lake", county: "B", fishSpecies: ["Crap", "Caras", "Roșioară"], description: "Lac urban cu facilități pentru pescuit sportiv" },
      { name: "Lacul Morii", latitude: "44.4262", longitude: "26.0155", type: "lake", county: "B", fishSpecies: ["Som", "Crap", "Știucă"], description: "Lac artificial cu adâncimi mari" },
      { name: "Lacul Vidraru", latitude: "45.3539", longitude: "24.6367", type: "lake", county: "AG", fishSpecies: ["Păstrăv", "Lipan", "Crap"], description: "Lac de acumulare în peisaj montan" },
      { name: "Lacul Bicaz", latitude: "46.9167", longitude: "25.9333", type: "lake", county: "NT", fishSpecies: ["Păstrăv", "Lipan", "Biban"], description: "Lac de munte cu apă foarte curată" },
      { name: "Lacul Izvorul Muntelui", latitude: "46.9167", longitude: "25.9333", type: "lake", county: "NT", fishSpecies: ["Crap", "Som", "Știucă"], description: "Cel mai mare lac artificial din România" },
      { name: "Lacul Siutghiol", latitude: "44.0833", longitude: "28.6167", type: "lake", county: "CT", fishSpecies: ["Crap", "Som", "Biban"], description: "Lac de apă dulce lângă Marea Neagră" },
      { name: "Lacul Tarnița", latitude: "46.6833", longitude: "23.7833", type: "lake", county: "CJ", fishSpecies: ["Crap", "Biban", "Știucă"], description: "Lac de acumulare cu maluri înalte" },
      { name: "Lacul Gilău", latitude: "46.7333", longitude: "23.4167", type: "lake", county: "CJ", fishSpecies: ["Crap", "Biban"], description: "Lac artificial în zona colinară" },
      { name: "Lacul Dridu", latitude: "44.7000", longitude: "26.4000", type: "lake", county: "IL", fishSpecies: ["Crap", "Som", "Știucă"], description: "Lac de acumulare pe Ialomița" },
      { name: "Lacul Buftea", latitude: "44.5667", longitude: "25.9500", type: "lake", county: "IF", fishSpecies: ["Crap", "Caras", "Biban"], description: "Lac natural lângă București" },
      { name: "Lacul Amara", latitude: "44.6000", longitude: "26.7000", type: "lake", county: "IL", fishSpecies: ["Crap", "Caras"], description: "Lac sărat cu proprietăți terapeutice" },
      
      // LACURI DE MUNTE
      { name: "Lacul Balea", latitude: "45.6064", longitude: "24.6208", type: "lake", county: "SB", fishSpecies: ["Păstrăv", "Lipan"], description: "Lac glaciar la altitudine mare" },
      { name: "Lacul Oasa", latitude: "45.3667", longitude: "25.4833", type: "lake", county: "BV", fishSpecies: ["Păstrăv", "Lipan"], description: "Lac de munte cu apă foarte rece" },
      { name: "Lacul Roșu", latitude: "46.6833", longitude: "25.9500", type: "lake", county: "HR", fishSpecies: ["Păstrăv", "Lipan"], description: "Lac natural format din alunecări de teren" },
      { name: "Lacul Sfânta Ana", latitude: "46.1167", longitude: "25.8750", type: "lake", county: "HR", fishSpecies: ["Păstrăv"], description: "Lac vulcanic în crater" },
      { name: "Lacul Iezer", latitude: "45.3833", longitude: "25.2500", type: "lake", county: "AG", fishSpecies: ["Păstrăv", "Lipan"], description: "Lac glaciar în Masivul Iezer" },
      
      // BĂLȚI ȘI ZONE UMEDE
      { name: "Balta Comana", latitude: "44.1736", longitude: "26.1531", type: "pond", county: "GR", fishSpecies: ["Crap", "Som", "Caras"], description: "Baltă naturală cu vegetație abundentă" },
      { name: "Balta Ialomiței", latitude: "44.5347", longitude: "27.3806", type: "pond", county: "IL", fishSpecies: ["Som", "Crap", "Știucă"], description: "Zonă de luncă cu ape liniștite" },
      { name: "Delta Dunării - Mila 23", latitude: "45.0833", longitude: "29.3833", type: "pond", county: "TL", fishSpecies: ["Som", "Crap", "Știucă", "Roșioară"], description: "Zonă sălbatică cu biodiversitate excepțională" },
      { name: "Balta Brăilei", latitude: "45.2692", longitude: "27.9575", type: "pond", county: "BR", fishSpecies: ["Som", "Crap", "Biban"], description: "Zonă de luncă cu canale naturale" },
      { name: "Balta Mică a Brăilei", latitude: "45.2000", longitude: "27.8000", type: "pond", county: "BR", fishSpecies: ["Som", "Crap", "Știucă"], description: "Rezervație naturală cu peștisori mari" },
      { name: "Lacul Oltina", latitude: "44.1167", longitude: "27.6333", type: "pond", county: "CT", fishSpecies: ["Crap", "Som", "Biban"], description: "Lac de stepă cu apă salmastră" },
      
      // BĂLȚI PRIVATE DE PESCUIT
      { name: "Balta Pescărușul - Voluntari", latitude: "44.5000", longitude: "26.1667", type: "private_pond", county: "IF", fishSpecies: ["Crap", "Som", "Amur"], description: "Baltă privată cu facilități complete" },
      { name: "Complex Pescuit Sportiv Snagov", latitude: "44.7167", longitude: "26.2000", type: "private_pond", county: "IF", fishSpecies: ["Crap", "Som", "Știucă"], description: "Complex modern cu multiple bazine" },
      { name: "Balta Dragomirești", latitude: "44.4500", longitude: "26.0000", type: "private_pond", county: "IF", fishSpecies: ["Crap", "Amur", "Som"], description: "Baltă amenajată pentru concursuri" },
      { name: "Lacul Paradis - Corbeanca", latitude: "44.6167", longitude: "26.1000", type: "private_pond", county: "IF", fishSpecies: ["Crap", "Som", "Știucă"], description: "Lac privat cu servicii premium" },
      
      // LITORAL MAREA NEAGRĂ
      { name: "Lacul Techirghiol", latitude: "44.0500", longitude: "28.6000", type: "coastal", county: "CT", fishSpecies: ["Crap", "Caras"], description: "Lac sărat cu nămol terapeutic" },
      { name: "Lacul Tașaul", latitude: "44.2833", longitude: "28.6500", type: "coastal", county: "CT", fishSpecies: ["Crap", "Som", "Biban"], description: "Lac de apă dulce la litoral" },
      { name: "Lacul Corbu", latitude: "44.6167", longitude: "28.6833", type: "coastal", county: "CT", fishSpecies: ["Crap", "Roșioară"], description: "Lac în Rezervația Biosferei Delta Dunării" },
      { name: "Lacul Nuntași", latitude: "44.6500", longitude: "28.7000", type: "coastal", county: "CT", fishSpecies: ["Crap", "Caras"], description: "Lac din complexul lagunar" },
      
      // RÂURI MICI ȘI AFLUENȚI
      { name: "Cișmigeul - București", latitude: "44.4378", longitude: "26.0875", type: "river", county: "B", fishSpecies: ["Caras", "Roșioară"], description: "Râu mic urban amenajat" },
      { name: "Colentina - București", latitude: "44.5000", longitude: "26.1500", type: "river", county: "B", fishSpecies: ["Crap", "Caras", "Biban"], description: "Râu cu lacuri de acumulare" },
      { name: "Teleajenul - Ploiești", latitude: "44.9333", longitude: "26.0167", type: "river", county: "PH", fishSpecies: ["Crap", "Biban", "Roșioară"], description: "Râu de deal cu ape moderate" },
      { name: "Vedea - Giurgiu", latitude: "43.9000", longitude: "25.5000", type: "river", county: "GR", fishSpecies: ["Crap", "Som", "Caras"], description: "Afluent al Dunării cu meandre" },
      { name: "Calmatui - Buzău", latitude: "45.0000", longitude: "27.0000", type: "river", county: "BZ", fishSpecies: ["Crap", "Biban"], description: "Râu de câmpie cu vegetație" }
    ];

    locations.forEach(location => {
      const id = randomUUID();
      this.fishingLocations.set(id, { 
        ...location, 
        id,
        description: location.description || null,
        fishSpecies: location.fishSpecies || null
      });
    });
  }

  private initializeMockRecords() {
    // Create some demo users first
    const demoUsers = [
      { username: "ion_marinescu", email: "ion@example.com", password: "password", firstName: "Ion", lastName: "Marinescu" },
      { username: "ana_popescu", email: "ana@example.com", password: "password", firstName: "Ana", lastName: "Popescu" },
      { username: "mihai_georgescu", email: "mihai@example.com", password: "password", firstName: "Mihai", lastName: "Georgescu" }
    ];

    const userIds: string[] = [];
    demoUsers.forEach(userData => {
      const userId = randomUUID();
      const user: User = {
        ...userData,
        id: userId,
        createdAt: new Date()
      };
      this.users.set(userId, user);
      userIds.push(userId);
    });

    // Create some sample records
    const sampleRecords = [
      {
        userId: userIds[0],
        species: "Som",
        weight: "15.2",
        length: 120,
        location: "Dunărea - Sector Călărași",
        county: "CL",
        waterType: "river",
        latitude: "44.2058",
        longitude: "27.3306",
        dateCaught: new Date(2024, 2, 15),
        description: "Capturat cu momeli naturale în zona adâncă"
      },
      {
        userId: userIds[1],
        species: "Crap",
        weight: "9.8",
        length: 65,
        location: "Lacul Snagov",
        county: "IF",
        waterType: "lake",
        latitude: "44.7031",
        longitude: "26.1858",
        dateCaught: new Date(2024, 2, 12),
        description: "Prins cu boilies în apropierea stufului"
      },
      {
        userId: userIds[2],
        species: "Știucă",
        weight: "4.5",
        length: 58,
        location: "Oltul - Sector Râmnicu Vâlcea",
        county: "VL",
        waterType: "river",
        latitude: "45.1069",
        longitude: "24.3692",
        dateCaught: new Date(2024, 2, 10),
        description: "Capturat cu spiner în zona cu curent rapid"
      }
    ];

    sampleRecords.forEach(recordData => {
      const id = randomUUID();
      const record: FishingRecord = {
        ...recordData,
        id,
        photos: [],
        verified: true,
        createdAt: new Date(),
        length: recordData.length || null
      };
      this.fishingRecords.set(id, record);
    });
  }
}

export const storage = new MemStorage();
