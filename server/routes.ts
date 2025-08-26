import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertFishingRecordSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Login failed", error });
    }
  });

  // Fishing locations routes
  app.get("/api/fishing-locations", async (req, res) => {
    try {
      const locations = await storage.getFishingLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations", error });
    }
  });

  app.get("/api/fishing-locations/:id", async (req, res) => {
    try {
      const location = await storage.getFishingLocation(req.params.id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch location", error });
    }
  });

  // Fishing records routes
  app.get("/api/fishing-records", async (req, res) => {
    try {
      const records = await storage.getFishingRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch records", error });
    }
  });

  app.get("/api/fishing-records/user/:userId", async (req, res) => {
    try {
      const records = await storage.getFishingRecordsByUser(req.params.userId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user records", error });
    }
  });

  app.post("/api/fishing-records", async (req, res) => {
    try {
      const recordData = insertFishingRecordSchema.parse(req.body);
      const record = await storage.createFishingRecord(recordData);
      res.json(record);
    } catch (error) {
      res.status(400).json({ message: "Invalid record data", error });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboards/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const { species, county, waterType } = req.query;
      
      let records = await storage.getFishingRecords();
      
      // Filter by species if specified
      if (species && species !== 'all') {
        records = records.filter(record => record.species === species);
      }
      
      // Filter by county if specified
      if (county && county !== 'all') {
        records = records.filter(record => record.county === county);
      }
      
      // Filter by water type if specified
      if (waterType && waterType !== 'all') {
        records = records.filter(record => record.waterType === waterType);
      }
      
      // Sort by weight (descending)
      records.sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
      
      // Get top 10 records
      const topRecords = records.slice(0, 10);
      
      // Get user information for each record
      const leaderboard = await Promise.all(
        topRecords.map(async (record, index) => {
          const user = await storage.getUser(record.userId);
          return {
            position: index + 1,
            record,
            user: user ? { id: user.id, username: user.username, firstName: user.firstName, lastName: user.lastName } : null
          };
        })
      );
      
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard", error });
    }
  });

  // User profile route
  app.get("/api/users/:userId/profile", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userRecords = await storage.getFishingRecordsByUser(userId);
      const allRecords = await storage.getFishingRecords();
      
      // Calculate user stats
      const totalRecords = userRecords.length;
      const personalBests = userRecords.reduce((bests: any, record) => {
        const species = record.species;
        if (!bests[species] || parseFloat(record.weight) > parseFloat(bests[species].weight)) {
          bests[species] = record;
        }
        return bests;
      }, {});
      
      // Calculate position in various leaderboards
      const allRecordsByWeight = allRecords.sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
      const userBestRecord = userRecords.sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight))[0];
      const nationalPosition = userBestRecord ? allRecordsByWeight.findIndex(r => r.id === userBestRecord.id) + 1 : null;
      
      // County leaderboard position
      const countyRecords = allRecords.filter(r => r.county === user.firstName); // Temporary logic
      const countyPosition = userBestRecord ? countyRecords.findIndex(r => r.id === userBestRecord.id) + 1 : null;
      
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        user: userWithoutPassword,
        stats: {
          totalRecords,
          personalBests: Object.values(personalBests),
          positions: {
            national: nationalPosition,
            county: countyPosition
          }
        },
        recentRecords: userRecords.slice(0, 5)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile", error });
    }
  });

  // Stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const locations = await storage.getFishingLocations();
      const records = await storage.getFishingRecords();
      const users = Array.from((storage as any).users.values());
      
      res.json({
        totalLocations: locations.length,
        totalRecords: records.length,
        activeUsers: users.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
