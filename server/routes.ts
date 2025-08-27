import type { Express } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { insertUserSchema, insertFishingRecordSchema } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "pescar-romania-secret-2024";

// Middleware pentru verificare token
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Token lipsă" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

// Middleware pentru admin
const adminMiddleware = (req: any, res: any, next: any) => {
  if (req.userEmail !== 'cosmin.trica@outlook.com') {
    return res.status(403).json({ message: "Acces interzis - doar pentru admin" });
  }
  next();
};

export function registerRoutes(app: Express) {
  // ============= AUTH ROUTES =============
  
  // Înregistrare
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Verifică dacă există deja
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email-ul este deja înregistrat" });
      }
      
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Numele de utilizator este deja luat" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Creează user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Generează token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error: any) {
      console.error('Register error:', error);
      res.status(400).json({ message: error.message || "Eroare la înregistrare" });
    }
  });
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email și parolă obligatorii" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Credențiale invalide" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Credențiale invalide" });
      }
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Eroare la autentificare" });
    }
  });
  
  // Verifică token
  app.get("/api/auth/me", authMiddleware, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ message: "Utilizator negăsit" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Eroare server" });
    }
  });
  
  // ============= FISHING LOCATIONS =============
  
  app.get("/api/fishing-locations", async (req, res) => {
    try {
      const locations = await storage.getFishingLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Eroare la încărcarea locațiilor" });
    }
  });
  
  app.get("/api/fishing-locations/:id", async (req, res) => {
    try {
      const location = await storage.getFishingLocation(req.params.id);
      if (!location) {
        return res.status(404).json({ message: "Locație negăsită" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Eroare server" });
    }
  });
  
  // ============= FISHING RECORDS =============
  
  // Get all records (verificate)
  app.get("/api/fishing-records", async (req, res) => {
    try {
      const records = await storage.getFishingRecords();
      // Returnează doar recordurile verificate pentru public
      const verifiedRecords = records.filter(r => r.verified === true);
      res.json(verifiedRecords);
    } catch (error) {
      res.status(500).json({ message: "Eroare la încărcarea recordurilor" });
    }
  });
  
  // Get user records
  app.get("/api/fishing-records/user/:userId", async (req, res) => {
    try {
      const records = await storage.getFishingRecordsByUser(req.params.userId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Eroare server" });
    }
  });
  
  // Submit new record (necesită auth)
  app.post("/api/fishing-records", authMiddleware, async (req: any, res) => {
    try {
      const recordData = {
        ...req.body,
        userId: req.userId,
        verified: false // Toate recordurile noi sunt neverificate
      };
      
      const record = await storage.createFishingRecord(recordData);
      res.json(record);
    } catch (error: any) {
      console.error('Record submission error:', error);
      res.status(400).json({ message: error.message || "Eroare la înregistrarea recordului" });
    }
  });
  
  // ============= ADMIN ROUTES =============
  
  // Get pending records (doar admin)
  app.get("/api/admin/pending-records", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const records = await storage.getFishingRecords();
      const pendingRecords = records.filter(r => !r.verified);
      
      // Adaugă informații despre user
      const recordsWithUsers = await Promise.all(
        pendingRecords.map(async (record) => {
          const user = await storage.getUser(record.userId);
          return {
            ...record,
            userFirstName: user?.firstName,
            userLastName: user?.lastName,
            userEmail: user?.email
          };
        })
      );
      
      res.json(recordsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Eroare server" });
    }
  });
  
  // Verify record (doar admin)
  app.post("/api/admin/verify-record/:recordId", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { recordId } = req.params;
      const { approved } = req.body;
      
      if (approved) {
        await storage.verifyRecord(recordId);
        res.json({ message: "Record aprobat cu succes" });
      } else {
        await storage.deleteRecord(recordId);
        res.json({ message: "Record respins și șters" });
      }
    } catch (error) {
      res.status(500).json({ message: "Eroare la verificarea recordului" });
    }
  });
  
  // ============= LEADERBOARDS =============
  
  app.get("/api/leaderboards/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const { species, county, waterType, limit = '10' } = req.query;
      
      let records = await storage.getFishingRecords();
      
      // Doar recorduri verificate
      records = records.filter(r => r.verified === true);
      
      // Filtrare
      if (species && species !== 'all') {
        records = records.filter(r => r.species === species);
      }
      
      if (county && county !== 'all') {
        records = records.filter(r => r.county === county);
      }
      
      if (waterType && waterType !== 'all') {
        records = records.filter(r => r.waterType === waterType);
      }
      
      // Sortare după greutate
      records.sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
      
      // Limitare
      const topRecords = records.slice(0, parseInt(limit as string));
      
      // Adaugă informații user
      const leaderboard = await Promise.all(
        topRecords.map(async (record, index) => {
          const user = await storage.getUser(record.userId);
          return {
            position: index + 1,
            record,
            user: user ? {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName
            } : null
          };
        })
      );
      
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Eroare server" });
    }
  });
  
  // ============= USER PROFILE =============
  
  app.get("/api/users/:userId/profile", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Utilizator negăsit" });
      }
      
      const userRecords = await storage.getFishingRecordsByUser(userId);
      const verifiedRecords = userRecords.filter(r => r.verified === true);
      
      // Stats
      const totalRecords = verifiedRecords.length;
      const personalBests: any = {};
      
      verifiedRecords.forEach(record => {
        const species = record.species;
        if (!personalBests[species] || parseFloat(record.weight) > parseFloat(personalBests[species].weight)) {
          personalBests[species] = record;
        }
      });
      
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        user: userWithoutPassword,
        stats: {
          totalRecords,
          personalBests: Object.values(personalBests),
          positions: {
            national: null, // To be calculated
            county: null
          }
        },
        recentRecords: verifiedRecords.slice(0, 5)
      });
    } catch (error) {
      res.status(500).json({ message: "Eroare server" });
    }
  });
  
  // ============= STATS =============
  
  app.get("/api/stats", async (req, res) => {
    try {
      const locations = await storage.getFishingLocations();
      const records = await storage.getFishingRecords();
      const verifiedRecords = records.filter(r => r.verified === true);
      const users = await storage.getAllUsers();
      
      res.json({
        totalLocations: locations.length,
        totalRecords: verifiedRecords.length,
        activeUsers: users.length
      });
    } catch (error) {
      res.status(500).json({ message: "Eroare server" });
    }
  });
}
