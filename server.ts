import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma.js";
import multer from "multer";
import path from "path";

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "buna-rent-secret-key";

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --- Auth Routes ---
app.post("/api/auth/register", async (req, res) => {
  const { email, password, fullName, role, phoneNumber } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: role || "TENANT",
        phoneNumber,
      },
    });
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName }, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName }, token });
  } catch (err: any) {
    res.status(400).json({ error: "Login failed" });
  }
});

app.get("/api/auth/me", authenticate, (req: any, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
});

// --- Property Routes ---
app.get("/api/properties", async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: { images: true, owner: { select: { fullName: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

app.get("/api/properties/:id", async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: { images: true, owner: { select: { fullName: true, avatar: true, phoneNumber: true } } },
    });
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

app.post("/api/properties", authenticate, async (req: any, res) => {
  if (req.user.role !== "OWNER" && req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Only owners can list properties" });
  }

  const { address, city, bedrooms, bathrooms, sqft, price, availabilityDate, amenities, description, imageUrls } = req.body;

  try {
    const property = await prisma.property.create({
      data: {
        address,
        city,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        sqft: parseFloat(sqft),
        price: parseFloat(price),
        availabilityDate: new Date(availabilityDate),
        amenities,
        description,
        ownerId: req.user.id,
        images: {
          create: imageUrls?.map((url: string) => ({ url })) || [],
        },
      },
      include: { images: true },
    });
    res.json(property);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to create property" });
  }
});

// --- Vite Middleware ---
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static("dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("dist/index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
