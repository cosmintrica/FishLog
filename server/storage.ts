import { type User, type InsertUser, type FishingRecord, type InsertFishingRecord, type FishingLocation, type InsertFishingLocation } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Fishing Records
  getFishingRecord(id: string): Promise<FishingRecord | undefined>;
  getFishingRecords(): Promise<FishingRecord[]>;
  getFishingRecordsByUser(userId: string): Promise<FishingRecord[]>;
  createFishingRecord(record: InsertFishingRecord): Promise<FishingRecord>;
  verifyRecord(id: string): Promise<void>;
  deleteRecord(id: string): Promise<void>;
  
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
    
    // Initialize with data
    this.initializeDatabase();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = uuidv4();
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
    const id = uuidv4();
    const record: FishingRecord = {
      ...insertRecord,
      id,
      verified: false,
      createdAt: new Date()
    };
    this.fishingRecords.set(id, record);
    return record;
  }

  async verifyRecord(id: string): Promise<void> {
    const record = this.fishingRecords.get(id);
    if (record) {
      record.verified = true;
      this.fishingRecords.set(id, record);
    }
  }

  async deleteRecord(id: string): Promise<void> {
    this.fishingRecords.delete(id);
  }

  // Fishing Locations methods
  async getFishingLocation(id: string): Promise<FishingLocation | undefined> {
    return this.fishingLocations.get(id);
  }

  async getFishingLocations(): Promise<FishingLocation[]> {
    return Array.from(this.fishingLocations.values());
  }

  async createFishingLocation(insertLocation: InsertFishingLocation): Promise<FishingLocation> {
    const id = uuidv4();
    const location: FishingLocation = {
      ...insertLocation,
      id
    };
    this.fishingLocations.set(id, location);
    return location;
  }

  private async initializeDatabase() {
    await this.initializeUsers();
    await this.initializeFishingLocations();
    await this.initializeRecords();
  }

  private async initializeUsers() {
    // Admin account
    const adminId = uuidv4();
    this.users.set(adminId, {
      id: adminId,
      username: "cosmin_admin",
      email: "cosmin.trica@outlook.com",
      password: await bcrypt.hash("admin2024", 10),
      firstName: "Cosmin",
      lastName: "Trica",
      createdAt: new Date("2024-01-01")
    });

    // Demo users
    const demoUsers = [
      { username: "ion_pescar", email: "ion@example.com", firstName: "Ion", lastName: "Marinescu" },
      { username: "ana_maria", email: "ana@example.com", firstName: "Ana", lastName: "Popescu" },
      { username: "mihai_pro", email: "mihai@example.com", firstName: "Mihai", lastName: "Georgescu" },
      { username: "stefan_dunarea", email: "stefan@example.com", firstName: "Stefan", lastName: "Dumitrescu" },
      { username: "elena_fisher", email: "elena@example.com", firstName: "Elena", lastName: "Ionescu" },
      { username: "alexandru_crap", email: "alex@example.com", firstName: "Alexandru", lastName: "Popa" },
      { username: "maria_stiuca", email: "maria@example.com", firstName: "Maria", lastName: "Stoica" },
      { username: "dragos_somnn", email: "dragos@example.com", firstName: "Dragoș", lastName: "Radu" }
    ];

    for (const userData of demoUsers) {
      const userId = uuidv4();
      this.users.set(userId, {
        ...userData,
        id: userId,
        password: await bcrypt.hash("parola123", 10),
        createdAt: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1)
      });
    }
  }

  private initializeFishingLocations() {
    const locations: Omit<FishingLocation, 'id'>[] = [
      // === DUNĂREA - 20 locații ===
      { name: "Dunărea - Baziaș", latitude: "44.8167", longitude: "21.3833", type: "river", county: "CS", fishSpecies: ["somn", "Crap", "Știucă"], description: "Intrarea Dunării în România" },
      { name: "Dunărea - Moldova Nouă", latitude: "44.7333", longitude: "21.6667", type: "river", county: "CS", fishSpecies: ["somn", "Crap", "Șalău"], description: "Zonă cu apă adâncă" },
      { name: "Dunărea - Orșova", latitude: "44.7167", longitude: "22.4000", type: "river", county: "MH", fishSpecies: ["somn", "Crap", "Știucă", "Avat"], description: "Aval de baraj" },
      { name: "Dunărea - Drobeta", latitude: "44.6306", longitude: "22.6564", type: "river", county: "MH", fishSpecies: ["somn", "Crap", "Știucă"], description: "Porțile de Fier" },
      { name: "Dunărea - Gruia", latitude: "44.2167", longitude: "22.6500", type: "river", county: "MH", fishSpecies: ["somn", "Crap", "Biban"], description: "Zonă cu golfuri" },
      { name: "Dunărea - Calafat", latitude: "43.9833", longitude: "22.9333", type: "river", county: "DJ", fishSpecies: ["somn", "Crap", "Știucă"], description: "Mal cu vegetație bogată" },
      { name: "Dunărea - Bechet", latitude: "43.7833", longitude: "23.9500", type: "river", county: "DJ", fishSpecies: ["somn", "Crap", "Șalău"], description: "Zonă largă cu adâncimi" },
      { name: "Dunărea - Corabia", latitude: "43.7667", longitude: "24.5000", type: "river", county: "OT", fishSpecies: ["somn", "Crap", "Știucă"], description: "Port dunărean" },
      { name: "Dunărea - Turnu Măgurele", latitude: "43.7500", longitude: "24.8667", type: "river", county: "TR", fishSpecies: ["somn", "Crap", "Biban"], description: "Zonă cu brațe" },
      { name: "Dunărea - Zimnicea", latitude: "43.6667", longitude: "25.3667", type: "river", county: "TR", fishSpecies: ["somn", "Crap", "Știucă"], description: "Mal înalt" },
      { name: "Dunărea - Giurgiu", latitude: "43.9037", longitude: "25.9699", type: "river", county: "GR", fishSpecies: ["somn", "Crap", "Știucă"], description: "Zonă portuară" },
      { name: "Dunărea - Oltenița", latitude: "44.0833", longitude: "26.6333", type: "river", county: "CL", fishSpecies: ["somn", "Crap", "Știucă"], description: "Confluență cu Argeș" },
      { name: "Dunărea - Călărași", latitude: "44.2058", longitude: "27.3306", type: "river", county: "CL", fishSpecies: ["somn", "Crap", "Știucă", "Șalău"], description: "Braț principal" },
      { name: "Dunărea - Fetești", latitude: "44.3833", longitude: "27.8333", type: "river", county: "IL", fishSpecies: ["somn", "Crap", "Biban"], description: "Balta Ialomiței" },
      { name: "Dunărea - Cernavodă", latitude: "44.3333", longitude: "28.0333", type: "river", county: "CT", fishSpecies: ["somn", "Crap", "Știucă"], description: "Zonă cu canale" },
      { name: "Dunărea - Hârșova", latitude: "44.6833", longitude: "27.9500", type: "river", county: "CT", fishSpecies: ["somn", "Crap", "Șalău"], description: "Cotul Dunării" },
      { name: "Dunărea - Brăila", latitude: "45.2692", longitude: "27.9575", type: "river", county: "BR", fishSpecies: ["somn", "Crap", "Știucă"], description: "Port principal" },
      { name: "Dunărea - Galați", latitude: "45.4353", longitude: "28.0080", type: "river", county: "GL", fishSpecies: ["somn", "Crap", "Biban", "Șalău"], description: "Confluență cu Siret" },
      { name: "Dunărea - Tulcea", latitude: "45.1667", longitude: "28.8000", type: "river", county: "TL", fishSpecies: ["somn", "Crap", "Știucă", "Roșioară"], description: "Începutul Deltei" },
      { name: "Dunărea - Sulina", latitude: "45.1500", longitude: "29.6500", type: "river", county: "TL", fishSpecies: ["somn", "Crap", "Știucă"], description: "Brațul Sulina" },

      // === MUREȘ - 15 locații ===
      { name: "Mureș - Deva", latitude: "45.8667", longitude: "22.9000", type: "river", county: "HD", fishSpecies: ["Păstrăv", "Lipan", "Biban"], description: "Sector montan" },
      { name: "Mureș - Orăștie", latitude: "45.8333", longitude: "23.2000", type: "river", county: "HD", fishSpecies: ["Crap", "Biban", "Clean"], description: "Zonă colinară" },
      { name: "Mureș - Sebeș", latitude: "45.9500", longitude: "23.5667", type: "river", county: "AB", fishSpecies: ["Crap", "Biban", "Știucă"], description: "Confluență cu Sebeș" },
      { name: "Mureș - Alba Iulia", latitude: "46.0667", longitude: "23.5833", type: "river", county: "AB", fishSpecies: ["Crap", "Știucă", "Biban"], description: "Zonă urbană" },
      { name: "Mureș - Aiud", latitude: "46.3167", longitude: "23.7167", type: "river", county: "AB", fishSpecies: ["Crap", "Biban", "Roșioară"], description: "Meandre largi" },
      { name: "Mureș - Ocna Mureș", latitude: "46.3833", longitude: "23.8500", type: "river", county: "AB", fishSpecies: ["Crap", "Caras", "Biban"], description: "Zonă sărată" },
      { name: "Mureș - Târgu Mureș", latitude: "46.5425", longitude: "24.5579", type: "river", county: "MS", fishSpecies: ["Crap", "Biban", "Roșioară"], description: "Centru urban major" },
      { name: "Mureș - Reghin", latitude: "46.7833", longitude: "24.7000", type: "river", county: "MS", fishSpecies: ["Păstrăv", "Lipan", "Biban"], description: "Zonă montană" },
      { name: "Mureș - Târnăveni", latitude: "46.3333", longitude: "24.2833", type: "river", county: "MS", fishSpecies: ["Crap", "Biban", "Clean"], description: "Confluență cu Târnava" },
      { name: "Mureș - Luduș", latitude: "46.4833", longitude: "24.0833", type: "river", county: "MS", fishSpecies: ["Crap", "Știucă", "Biban"], description: "Zonă lată" },
      { name: "Mureș - Arad", latitude: "46.1866", longitude: "21.3123", type: "river", county: "AR", fishSpecies: ["Știucă", "Biban", "Crap"], description: "Sector inferior" },
      { name: "Mureș - Lipova", latitude: "46.0833", longitude: "21.6833", type: "river", county: "AR", fishSpecies: ["Crap", "somn", "Biban"], description: "Zonă de câmpie" },
      { name: "Mureș - Sântana", latitude: "46.3333", longitude: "21.0333", type: "river", county: "AR", fishSpecies: ["Crap", "Știucă", "Biban"], description: "Aproape de graniță" },
      { name: "Mureș - Pecica", latitude: "46.1667", longitude: "21.0500", type: "river", county: "AR", fishSpecies: ["somn", "Crap", "Știucă"], description: "Meandre mari" },
      { name: "Mureș - Nădlac", latitude: "46.1500", longitude: "20.7500", type: "river", county: "AR", fishSpecies: ["somn", "Crap", "Biban"], description: "Vărsare în Tisa" },

      // === OLT - 15 locații ===
      { name: "Olt - Călimănești", latitude: "45.2333", longitude: "24.3333", type: "river", county: "VL", fishSpecies: ["Păstrăv", "Lipan"], description: "Zonă turistică" },
      { name: "Olt - Râmnicu Vâlcea", latitude: "45.1069", longitude: "24.3692", type: "river", county: "VL", fishSpecies: ["Păstrăv", "Lipan", "Biban"], description: "Râu de munte" },
      { name: "Olt - Drăgășani", latitude: "44.6833", longitude: "24.2667", type: "river", county: "VL", fishSpecies: ["Crap", "Biban", "Clean"], description: "Zonă viticolă" },
      { name: "Olt - Slatina", latitude: "44.4333", longitude: "24.3667", type: "river", county: "OT", fishSpecies: ["Crap", "Știucă", "Biban"], description: "Centru urban" },
      { name: "Olt - Caracal", latitude: "44.1167", longitude: "24.3500", type: "river", county: "OT", fishSpecies: ["Crap", "somn", "Biban"], description: "Zonă largă" },
      { name: "Olt - Corabia", latitude: "43.7667", longitude: "24.5000", type: "river", county: "OT", fishSpecies: ["somn", "Crap", "Știucă"], description: "Aproape de Dunăre" },
      { name: "Olt - Făgăraș", latitude: "45.8500", longitude: "24.9667", type: "river", county: "BV", fishSpecies: ["Păstrăv", "Lipan"], description: "Zonă montană" },
      { name: "Olt - Feldioara", latitude: "45.8333", longitude: "25.5833", type: "river", county: "BV", fishSpecies: ["Păstrăv", "Biban"], description: "Deal-munte" },
      { name: "Olt - Brașov", latitude: "45.6500", longitude: "25.6000", type: "river", county: "BV", fishSpecies: ["Păstrăv", "Lipan", "Biban"], description: "Zonă urbană montană" },
      { name: "Olt - Sfântu Gheorghe", latitude: "45.8667", longitude: "25.7833", type: "river", county: "CV", fishSpecies: ["Păstrăv", "Clean"], description: "Depresiune" },
      { name: "Olt - Miercurea Ciuc", latitude: "46.3500", longitude: "25.8000", type: "river", county: "HR", fishSpecies: ["Păstrăv", "Lipan"], description: "Zonă rece montană" },
      { name: "Olt - Tușnad", latitude: "46.1333", longitude: "25.8667", type: "river", county: "HR", fishSpecies: ["Păstrăv"], description: "Stațiune montană" },
      { name: "Olt - Bălțătești", latitude: "45.0333", longitude: "24.6167", type: "river", county: "VL", fishSpecies: ["Crap", "Biban"], description: "Baraj" },
      { name: "Olt - Izbiceni", latitude: "43.8000", longitude: "24.3500", type: "river", county: "OT", fishSpecies: ["somn", "Crap"], description: "Zonă de câmpie" },
      { name: "Olt - Turnu Roșu", latitude: "45.6333", longitude: "24.3000", type: "river", county: "SB", fishSpecies: ["Păstrăv", "Lipan"], description: "Defileu" },

      // === SIRET - 12 locații ===
      { name: "Siret - Siret", latitude: "47.9500", longitude: "26.0667", type: "river", county: "SV", fishSpecies: ["Păstrăv", "Lipan", "Clean"], description: "Intrare în țară" },
      { name: "Siret - Suceava", latitude: "47.6500", longitude: "26.2500", type: "river", county: "SV", fishSpecies: ["Păstrăv", "Lipan", "Biban"], description: "Zonă urbană" },
      { name: "Siret - Pașcani", latitude: "47.2500", longitude: "26.7167", type: "river", county: "IS", fishSpecies: ["Crap", "Biban", "Clean"], description: "Nod feroviar" },
      { name: "Siret - Roman", latitude: "46.9167", longitude: "26.9167", type: "river", county: "NT", fishSpecies: ["Crap", "Știucă", "Biban"], description: "Centru istoric" },
      { name: "Siret - Bacău", latitude: "46.5670", longitude: "26.9146", type: "river", county: "BC", fishSpecies: ["Știucă", "Biban", "Crap"], description: "Zonă industrială" },
      { name: "Siret - Adjud", latitude: "46.1000", longitude: "27.1833", type: "river", county: "VN", fishSpecies: ["Crap", "Biban", "Roșioară"], description: "Confluență cu Trotuș" },
      { name: "Siret - Mărășești", latitude: "45.8833", longitude: "27.2333", type: "river", county: "VN", fishSpecies: ["Crap", "somn", "Biban"], description: "Zonă istorică" },
      { name: "Siret - Nămoloasa", latitude: "45.5667", longitude: "27.5833", type: "river", county: "GL", fishSpecies: ["somn", "Crap", "Știucă"], description: "Luncă largă" },
      { name: "Siret - Galați", latitude: "45.4500", longitude: "28.0500", type: "river", county: "GL", fishSpecies: ["somn", "Crap", "Știucă"], description: "Vărsare în Dunăre" },
      { name: "Siret - Lungoci", latitude: "46.0000", longitude: "26.7500", type: "river", county: "BC", fishSpecies: ["Crap", "Biban"], description: "Zonă de deal" },
      { name: "Siret - Cosmești", latitude: "45.7000", longitude: "27.1500", type: "river", county: "GL", fishSpecies: ["somn", "Crap"], description: "Meandre" },
      { name: "Siret - Șendreni", latitude: "45.3833", longitude: "27.9667", type: "river", county: "GL", fishSpecies: ["somn", "Crap", "Știucă"], description: "Aproape de vărsare" },

      // === PRUT - 10 locații ===
      { name: "Prut - Rădăuți Prut", latitude: "47.8333", longitude: "26.2500", type: "river", county: "BT", fishSpecies: ["Clean", "Biban", "Roșioară"], description: "Intrare în țară" },
      { name: "Prut - Darabani", latitude: "48.2000", longitude: "26.5833", type: "river", county: "BT", fishSpecies: ["Crap", "Biban"], description: "Zonă de graniță" },
      { name: "Prut - Dorohoi", latitude: "47.9667", longitude: "26.4000", type: "river", county: "BT", fishSpecies: ["Crap", "Caras", "Biban"], description: "Centru urban" },
      { name: "Prut - Stânca", latitude: "48.0667", longitude: "26.7000", type: "river", county: "BT", fishSpecies: ["Crap", "somn", "Știucă"], description: "Lac de acumulare" },
      { name: "Prut - Iași", latitude: "47.1585", longitude: "27.6014", type: "river", county: "IS", fishSpecies: ["Crap", "Biban", "Roșioară"], description: "Capitală regională" },
      { name: "Prut - Ungheni", latitude: "47.2000", longitude: "27.8000", type: "river", county: "IS", fishSpecies: ["Crap", "Știucă", "Biban"], description: "Pod frontalier" },
      { name: "Prut - Huși", latitude: "46.6667", longitude: "28.0500", type: "river", county: "VS", fishSpecies: ["Crap", "somn", "Biban"], description: "Centru viticol" },
      { name: "Prut - Vaslui", latitude: "46.6333", longitude: "27.7333", type: "river", county: "VS", fishSpecies: ["Crap", "Biban", "Roșioară"], description: "Capitală de județ" },
      { name: "Prut - Galați", latitude: "45.4333", longitude: "28.0333", type: "river", county: "GL", fishSpecies: ["somn", "Crap", "Știucă"], description: "Vărsare în Dunăre" },
      { name: "Prut - Oancea", latitude: "45.8833", longitude: "27.5667", type: "river", county: "GL", fishSpecies: ["Crap", "somn"], description: "Zonă de luncă" },

      // === LACURI MARI - 25 locații ===
      { name: "Lacul Vidraru", latitude: "45.3539", longitude: "24.6367", type: "lake", county: "AG", fishSpecies: ["Păstrăv", "Crap", "Biban"], description: "Lac de acumulare montan" },
      { name: "Lacul Bicaz", latitude: "46.9167", longitude: "25.9333", type: "lake", county: "NT", fishSpecies: ["Păstrăv", "Lipan", "Biban"], description: "Cel mai mare lac montan" },
      { name: "Lacul Snagov", latitude: "44.7031", longitude: "26.1858", type: "lake", county: "IF", fishSpecies: ["Crap", "somn", "Știucă", "Biban"], description: "Lac natural istoric" },
      { name: "Lacul Cernica", latitude: "44.4500", longitude: "26.2667", type: "lake", county: "IF", fishSpecies: ["Crap", "Caras", "Biban"], description: "Complex de lacuri" },
      { name: "Lacul Morii", latitude: "44.4262", longitude: "26.0155", type: "lake", county: "B", fishSpecies: ["somn", "Crap", "Știucă"], description: "Cel mai mare lac din București" },
      { name: "Lacul Herăstrău", latitude: "44.4795", longitude: "26.0834", type: "lake", county: "B", fishSpecies: ["Crap", "Caras", "Roșioară"], description: "Lac urban amenajat" },
      { name: "Lacul Floreasca", latitude: "44.4833", longitude: "26.1000", type: "lake", county: "B", fishSpecies: ["Crap", "Biban", "Roșioară"], description: "Parte din salba de lacuri" },
      { name: "Lacul Tei", latitude: "44.4667", longitude: "26.1167", type: "lake", county: "B", fishSpecies: ["Crap", "Caras", "Biban"], description: "Lac urban pescuit sportiv" },
      { name: "Lacul Plumbuita", latitude: "44.4500", longitude: "26.1333", type: "lake", county: "B", fishSpecies: ["Crap", "Biban", "Roșioară"], description: "Lac cu vegetație bogată" },
      { name: "Lacul Fundeni", latitude: "44.4333", longitude: "26.1500", type: "lake", county: "B", fishSpecies: ["Crap", "Caras"], description: "Lac de agrement" },
      { name: "Lacul Pantelimon", latitude: "44.4167", longitude: "26.1667", type: "lake", county: "B", fishSpecies: ["Crap", "Biban"], description: "Zonă rezidențială" },
      { name: "Lacul Grozăvești", latitude: "44.4333", longitude: "26.0667", type: "lake", county: "B", fishSpecies: ["Caras", "Roșioară"], description: "Lac mic urban" },
      { name: "Lacul Colentina", latitude: "44.4583", longitude: "26.1250", type: "lake", county: "B", fishSpecies: ["Crap", "Biban"], description: "Pescuit sportiv" },
      { name: "Lacul Fundeni", latitude: "44.4300", longitude: "26.1550", type: "lake", county: "B", fishSpecies: ["Crap", "Caras"], description: "Parc IOR" },
      { name: "Lacul Titan", latitude: "44.4217", longitude: "26.1533", type: "lake", county: "B", fishSpecies: ["Crap", "Biban", "Roșioară"], description: "Parc Titan" },
      { name: "Lacul Văcărești", latitude: "44.4000", longitude: "26.1333", type: "lake", county: "B", fishSpecies: ["Crap", "Știucă", "Biban"], description: "Delta urbană" },
      { name: "Lacul Buftea", latitude: "44.5667", longitude: "25.9500", type: "lake", county: "IF", fishSpecies: ["Crap", "Caras", "Biban"], description: "Lac de agrement" },
      { name: "Lacul Căldărușani", latitude: "44.6167", longitude: "26.3333", type: "lake", county: "IF", fishSpecies: ["Crap", "somn", "Știucă"], description: "Mănăstire istorică" },
      { name: "Lacul Pasărea", latitude: "44.3500", longitude: "26.2333", type: "lake", county: "IF", fishSpecies: ["Crap", "Biban"], description: "Zonă protejată" },
      { name: "Lacul Brănești", latitude: "44.4667", longitude: "26.3333", type: "lake", county: "IF", fishSpecies: ["Crap", "Caras"], description: "Pescuit sportiv" },
      { name: "Lacul Dridu", latitude: "44.7000", longitude: "26.4000", type: "lake", county: "IL", fishSpecies: ["Crap", "somn", "Știucă"], description: "Lac de acumulare mare" },
      { name: "Lacul Amara", latitude: "44.6000", longitude: "26.7000", type: "lake", county: "IL", fishSpecies: ["Crap", "Caras"], description: "Lac sărat terapeutic" },
      { name: "Lacul Fundata", latitude: "44.4833", longitude: "27.5667", type: "lake", county: "IL", fishSpecies: ["Crap", "Biban"], description: "Lac de câmpie" },
      { name: "Lacul Strachina", latitude: "44.5167", longitude: "27.0833", type: "lake", county: "IL", fishSpecies: ["Crap", "somn"], description: "Pescuit comercial" },
      { name: "Lacul Sărățuica", latitude: "44.5500", longitude: "27.2000", type: "lake", county: "IL", fishSpecies: ["Crap", "Caras"], description: "Lac sărat" },

      // === LACURI DE MUNTE - 20 locații ===
      { name: "Lacul Bâlea", latitude: "45.6064", longitude: "24.6208", type: "lake", county: "SB", fishSpecies: ["Păstrăv"], description: "Lac glaciar 2034m altitudine" },
      { name: "Lacul Roșu", latitude: "46.7833", longitude: "25.7833", type: "lake", county: "HR", fishSpecies: ["Păstrăv", "Lipan"], description: "Lac natural de baraj" },
      { name: "Lacul Sfânta Ana", latitude: "46.1250", longitude: "25.8900", type: "lake", county: "HR", fishSpecies: ["Păstrăv"], description: "Singurul lac vulcanic" },
      { name: "Lacul Oașa", latitude: "45.3667", longitude: "23.4833", type: "lake", county: "AB", fishSpecies: ["Păstrăv", "Lipan"], description: "Lac de acumulare la 1255m" },
      { name: "Lacul Vidra", latitude: "45.4333", longitude: "23.1667", type: "lake", county: "AB", fishSpecies: ["Păstrăv"], description: "Lac glaciar în Șureanu" },
      { name: "Lacul Gâlcescu", latitude: "45.3833", longitude: "24.6333", type: "lake", county: "AB", fishSpecies: ["Păstrăv"], description: "Lac alpin în Parâng" },
      { name: "Lacul Bucura", latitude: "45.3667", longitude: "22.9667", type: "lake", county: "HD", fishSpecies: ["Păstrăv"], description: "Cel mai mare lac glaciar" },
      { name: "Lacul Zănoaga", latitude: "45.3500", longitude: "22.9500", type: "lake", county: "HD", fishSpecies: ["Păstrăv"], description: "Lac glaciar Retezat" },
      { name: "Lacul Gemenele", latitude: "45.3833", longitude: "22.8833", type: "lake", county: "HD", fishSpecies: ["Păstrăv"], description: "Lacuri gemene glaciare" },
      { name: "Lacul Tăul Negru", latitude: "45.3500", longitude: "22.9000", type: "lake", county: "HD", fishSpecies: ["Păstrăv"], description: "Lac glaciar întunecat" },
      { name: "Lacul Peleaga", latitude: "45.3667", longitude: "22.9000", type: "lake", county: "HD", fishSpecies: ["Păstrăv"], description: "Lac glaciar Retezat" },
      { name: "Lacul Lia", latitude: "45.3333", longitude: "22.9167", type: "lake", county: "HD", fishSpecies: ["Păstrăv"], description: "Lac mic glaciar" },
      { name: "Lacul Ana", latitude: "45.3500", longitude: "22.8667", type: "lake", county: "HD", fishSpecies: ["Păstrăv"], description: "Lac glaciar rotund" },
      { name: "Lacul Viorica", latitude: "45.3333", longitude: "22.8500", type: "lake", county: "HD", fishSpecies: ["Păstrăv"], description: "Lac glaciar mic" },
      { name: "Lacul Capra", latitude: "45.4500", longitude: "24.6333", type: "lake", county: "AG", fishSpecies: ["Păstrăv"], description: "Lac glaciar Făgăraș" },
      { name: "Lacul Podragu", latitude: "45.4333", longitude: "24.6000", type: "lake", county: "AG", fishSpecies: ["Păstrăv"], description: "Lac glaciar adânc" },
      { name: "Lacul Călțun", latitude: "45.4167", longitude: "24.5833", type: "lake", county: "AG", fishSpecies: ["Păstrăv"], description: "Lac glaciar ascuns" },
      { name: "Lacul Urlea", latitude: "45.4000", longitude: "24.5667", type: "lake", county: "AG", fishSpecies: ["Păstrăv"], description: "Lac glaciar mare" },

      // === BĂLȚI ȘI ZONE UMEDE - 30 locații ===
      { name: "Balta Comana", latitude: "44.1736", longitude: "26.1531", type: "pond", county: "GR", fishSpecies: ["Crap", "somn", "Caras"], description: "Rezervație naturală" },
      { name: "Balta Greaca", latitude: "44.0500", longitude: "26.5000", type: "pond", county: "GR", fishSpecies: ["Crap", "somn", "Știucă"], description: "Zonă protejată" },
      { name: "Balta Ialomiței", latitude: "44.5347", longitude: "27.3806", type: "pond", county: "IL", fishSpecies: ["somn", "Crap", "Știucă"], description: "Complex de bălți" },
      { name: "Balta Brăilei", latitude: "45.2692", longitude: "27.9575", type: "pond", county: "BR", fishSpecies: ["somn", "Crap", "Știucă"], description: "Insulă mare" },
      { name: "Balta Mică a Brăilei", latitude: "45.2000", longitude: "27.8000", type: "pond", county: "BR", fishSpecies: ["somn", "Crap"], description: "Rezervație" },
      { name: "Balta Albă", latitude: "45.1667", longitude: "29.3333", type: "pond", county: "TL", fishSpecies: ["somn", "Crap", "Știucă"], description: "Delta Dunării" },
      { name: "Balta Râioasa", latitude: "45.1500", longitude: "29.4000", type: "pond", county: "TL", fishSpecies: ["somn", "Crap"], description: "Delta sălbatică" },
      { name: "Balta Matița", latitude: "45.3000", longitude: "29.0000", type: "pond", county: "TL", fishSpecies: ["somn", "Crap", "Știucă"], description: "Complex deltaic" },
      { name: "Balta Merhei", latitude: "45.2500", longitude: "29.1000", type: "pond", county: "TL", fishSpecies: ["somn", "Crap"], description: "Zonă pescărească" },
      { name: "Balta Babina", latitude: "45.3500", longitude: "29.0500", type: "pond", county: "TL", fishSpecies: ["somn", "Crap", "Știucă"], description: "Rezervație strictă" },
      { name: "Balta Cernica", latitude: "44.1833", longitude: "29.6000", type: "pond", county: "TL", fishSpecies: ["Crap", "somn"], description: "Complex pescăresc" },
      { name: "Balta Zaghen", latitude: "45.0500", longitude: "28.9500", type: "pond", county: "TL", fishSpecies: ["somn", "Crap"], description: "Zonă tradițională" },
      { name: "Balta Tătaru", latitude: "44.8333", longitude: "28.2000", type: "pond", county: "CT", fishSpecies: ["Crap", "Caras"], description: "Baltă salmastră" },
      { name: "Balta Hergheliei", latitude: "44.7500", longitude: "26.8500", type: "pond", county: "IL", fishSpecies: ["Crap", "somn"], description: "Zonă istorică" },
      { name: "Balta Jilavei", latitude: "44.3000", longitude: "26.5500", type: "pond", county: "IL", fishSpecies: ["Crap", "Biban"], description: "Pescuit sportiv" },
      { name: "Balta Dorobanțu", latitude: "44.4000", longitude: "27.0000", type: "pond", county: "CL", fishSpecies: ["Crap", "somn"], description: "Complex pescăresc" },
      { name: "Balta Rasa", latitude: "44.3500", longitude: "27.1500", type: "pond", county: "CL", fishSpecies: ["Crap", "Biban"], description: "Pescuit comercial" },
      { name: "Balta Iezer", latitude: "44.2500", longitude: "27.2000", type: "pond", county: "CL", fishSpecies: ["somn", "Crap"], description: "Baltă mare naturală" },
      { name: "Balta Călărași", latitude: "44.2000", longitude: "27.3000", type: "pond", county: "CL", fishSpecies: ["Crap", "somn", "Știucă"], description: "Complex urban" },
      { name: "Balta Sticleanu", latitude: "44.8000", longitude: "27.2500", type: "pond", county: "BZ", fishSpecies: ["Crap", "Biban"], description: "Baltă de deal" },
      { name: "Balta Amara", latitude: "44.9500", longitude: "26.3500", type: "pond", county: "BZ", fishSpecies: ["Crap", "Caras"], description: "Apă salmastră" },
      { name: "Balta Balta", latitude: "45.0000", longitude: "26.4000", type: "pond", county: "BZ", fishSpecies: ["Crap", "somn"], description: "Nume tradițional" },
      { name: "Balta Nicolești", latitude: "44.7000", longitude: "26.2000", type: "pond", county: "IF", fishSpecies: ["Crap", "Biban"], description: "Pescărie privată" },
      { name: "Balta Cornetu", latitude: "44.4500", longitude: "26.0000", type: "pond", county: "IF", fishSpecies: ["Crap", "Caras"], description: "Pescuit la feeder" },
      { name: "Balta Domnești", latitude: "44.4000", longitude: "25.9500", type: "pond", county: "IF", fishSpecies: ["Crap", "somn"], description: "Complex privat" },
      { name: "Balta 1 Decembrie", latitude: "44.4200", longitude: "25.9800", type: "pond", county: "IF", fishSpecies: ["Crap", "Știucă"], description: "Pescuit sportiv" },
      { name: "Balta Clinceni", latitude: "44.3800", longitude: "25.9200", type: "pond", county: "IF", fishSpecies: ["Crap", "Biban"], description: "Pescuit de weekend" },
      { name: "Balta Măgurele", latitude: "44.3500", longitude: "25.9000", type: "pond", county: "IF", fishSpecies: ["Crap", "Caras"], description: "Zonă liniștită" },
      { name: "Balta Jilava", latitude: "44.3300", longitude: "26.0800", type: "pond", county: "IF", fishSpecies: ["Crap", "Biban"], description: "Pescuit urban" },
      { name: "Balta Vidra", latitude: "44.3000", longitude: "26.1500", type: "pond", county: "IF", fishSpecies: ["Crap", "somn"], description: "Complex mare" },

      // === BĂLȚI PRIVATE - 25 locații ===
      { name: "Complex Șnagov Sat", latitude: "44.6833", longitude: "26.1667", type: "private_pond", county: "IF", fishSpecies: ["Crap", "somn", "Sturion"], description: "Facilități premium" },
      { name: "Paradis Delta", latitude: "44.6167", longitude: "26.1000", type: "private_pond", county: "IF", fishSpecies: ["Crap", "somn", "Știucă"], description: "Complex exclusivist" },
      { name: "Pescărușul Albastru", latitude: "44.5000", longitude: "26.1667", type: "private_pond", county: "IF", fishSpecies: ["Crap", "somn", "Amur"], description: "Pescuit nocturn" },
      { name: "Lebăda Resort", latitude: "44.7333", longitude: "26.2333", type: "private_pond", county: "IF", fishSpecies: ["Crap", "somn"], description: "Resort pescuit" },
      { name: "Crap Arena", latitude: "44.5500", longitude: "26.0500", type: "private_pond", county: "IF", fishSpecies: ["Crap", "Amur", "somn"], description: "Concursuri crap" },
      { name: "Sălcioara Lake", latitude: "44.6000", longitude: "26.2000", type: "private_pond", county: "IF", fishSpecies: ["Crap", "somn"], description: "Pescuit familial" },
      { name: "Tărâța Complex", latitude: "44.4833", longitude: "26.3333", type: "private_pond", county: "IF", fishSpecies: ["Crap", "Știucă"], description: "Multiple bazine" },
      { name: "Mega Carp", latitude: "44.5167", longitude: "25.9833", type: "private_pond", county: "IF", fishSpecies: ["Crap", "somn"], description: "Exemplare mari" },
      { name: "Fish Paradise", latitude: "44.4500", longitude: "26.0333", type: "private_pond", county: "IF", fishSpecies: ["Crap", "Amur"], description: "Pescuit sportiv" },
      { name: "Royal Fish", latitude: "44.7000", longitude: "26.1500", type: "private_pond", county: "IF", fishSpecies: ["Crap", "somn", "Sturion"], description: "Lux și pescuit" },
      { name: "Carp Zone", latitude: "44.5333", longitude: "26.1167", type: "private_pond", county: "IF", fishSpecies: ["Crap", "Amur"], description: "Specializat crap" },
      { name: "Fish & Relax", latitude: "44.6500", longitude: "26.0833", type: "private_pond", county: "IF", fishSpecies: ["Crap", "somn"], description: "Camping și pescuit" },
      { name: "Big Fish Arena", latitude: "44.4667", longitude: "26.2500", type: "private_pond", county: "IF", fishSpecies: ["somn", "Crap"], description: "Pești trofeу" },
      { name: "Green Lake", latitude: "44.5833", longitude: "26.1333", type: "private_pond", county: "IF", fishSpecies: ["Crap", "Știucă"], description: "Mediu natural" },
      { name: "Sunset Fishing", latitude: "44.4333", longitude: "25.9667", type: "private_pond", county: "IF", fishSpecies: ["Crap", "somn"], description: "Pescuit seară" },
      { name: "Crystal Waters", latitude: "44.6667", longitude: "26.2167", type: "private_pond", county: "IF", fishSpecies: ["Păstrăv", "Crap"], description: "Apă cristalină" },
      { name: "Fisherman's Dream", latitude: "44.5000", longitude: "26.0667", type: "private_pond", county: "IF", fishSpecies: ["Crap", "somn", "Amur"], description: "Complex modern" },
      { name: "Carp Masters", latitude: "44.5500", longitude: "26.2833", type: "private_pond", county: "IF", fishSpecies: ["Crap"], description: "Doar crap" },
      { name: "Blue Waters", latitude: "44.4167", longitude: "26.1000", type: "private_pond", county: "IF", fishSpecies: ["Crap", "somn"], description: "Ape adânci" },
      { name: "Lucky Fish", latitude: "44.6333", longitude: "26.1833", type: "private_pond", county: "IF", fishSpecies: ["Crap", "Știucă"], description: "Noroc garantat" },
      { name: "Premium Carp", latitude: "44.4833", longitude: "26.0167", type: "private_pond", county: "IF", fishSpecies: ["Crap", "somn"], description: "Servicii premium" },
      { name: "Nature Fish", latitude: "44.5667", longitude: "26.2333", type: "private_pond", county: "IF", fishSpecies: ["Crap", "Biban"], description: "Cadru natural" },
      { name: "Trophy Lake", latitude: "44.4000", longitude: "26.0500", type: "private_pond", county: "IF", fishSpecies: ["somn", "Crap"], description: "Pești trofeu" },
      { name: "Relax Fishing", latitude: "44.6833", longitude: "26.1333", type: "private_pond", county: "IF", fishSpecies: ["Crap", "Caras"], description: "Relaxare totală" },
      { name: "Wild Carp", latitude: "44.5333", longitude: "25.9500", type: "private_pond", county: "IF", fishSpecies: ["Crap"], description: "Crap sălbatic" }
    ];

    locations.forEach(location => {
      const id = uuidv4();
      this.fishingLocations.set(id, { 
        ...location, 
        id,
        description: location.description || null,
        fishSpecies: location.fishSpecies || null
      });
    });
  }

  private async initializeRecords() {
    const users = Array.from(this.users.values());
    const locations = Array.from(this.fishingLocations.values());
    
    // Creează recorduri demo pentru fiecare user
    const recordsData = [
      // Recorduri verificate
      { species: "somn", weight: "45.5", length: 180, verified: true },
      { species: "Crap", weight: "22.3", length: 95, verified: true },
      { species: "Știucă", weight: "12.8", length: 110, verified: true },
      { species: "Șalău", weight: "8.5", length: 75, verified: true },
      { species: "Biban", weight: "2.1", length: 35, verified: true },
      { species: "Păstrăv", weight: "3.5", length: 45, verified: true },
      { species: "Lipan", weight: "2.8", length: 42, verified: true },
      { species: "Crap", weight: "18.7", length: 88, verified: true },
      { species: "somn", weight: "32.0", length: 155, verified: true },
      { species: "Știucă", weight: "9.2", length: 92, verified: true },
      { species: "Crap", weight: "15.5", length: 78, verified: true },
      { species: "Roșioară", weight: "0.8", length: 25, verified: true },
      { species: "Caras", weight: "1.5", length: 32, verified: true },
      { species: "Clean", weight: "1.2", length: 28, verified: true },
      { species: "Avat", weight: "4.5", length: 58, verified: true },
      
      // Recorduri neverificate (pentru admin panel)
      { species: "somn", weight: "55.2", length: 195, verified: false },
      { species: "Crap", weight: "28.5", length: 105, verified: false },
      { species: "Știucă", weight: "15.0", length: 120, verified: false },
      { species: "Păstrăv", weight: "5.2", length: 55, verified: false },
      { species: "Crap", weight: "19.8", length: 90, verified: false }
    ];

    recordsData.forEach((data, index) => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomLocation = locations.filter(l => 
        l.fishSpecies?.includes(data.species)
      )[Math.floor(Math.random() * locations.filter(l => l.fishSpecies?.includes(data.species)).length)];

      if (randomUser && randomLocation) {
        const recordId = uuidv4();
        const daysAgo = Math.floor(Math.random() * 90);
        
        this.fishingRecords.set(recordId, {
          id: recordId,
          userId: randomUser.id,
          species: data.species,
          weight: data.weight,
          length: data.length,
          location: randomLocation.name,
          county: randomLocation.county,
          waterType: randomLocation.type as any,
          latitude: randomLocation.latitude,
          longitude: randomLocation.longitude,
          dateCaught: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
          description: `Record capturat la ${randomLocation.name}`,
          photos: [],
          verified: data.verified,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        });
      }
    });
  }
}

export const storage = new MemStorage();
