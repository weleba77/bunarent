import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma.js";
import multer from "multer";
import path from "path";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "buna-rent-secret-key";

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Ensure uploads directory exists
import fs from "fs";
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

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

// --- Socket.io Logic ---
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// --- Auth Routes ---
// ... existing auth routes ...
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

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, fullName: true, avatar: true }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// --- Property Routes ---
app.post("/api/upload", authenticate, upload.single("image"), (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

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
      include: { images: true, owner: { select: { id: true, fullName: true, avatar: true, phoneNumber: true } } },
    });
    
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Increment views asynchronously
    prisma.property.update({
      where: { id: req.params.id },
      data: { views: { increment: 1 } }
    }).catch(e => console.error("Failed to increment views", e));

    res.json(property);
  } catch (err) {
    console.error("Error fetching property:", err);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

app.post("/api/properties", authenticate, async (req: any, res) => {
  if (req.user.role !== "OWNER" && req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Only owners can list properties" });
  }

  const { address, city, bedrooms, bathrooms, sqft, price, availabilityDate, amenities, description, imageUrls, status, propertyType } = req.body;

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
        status: status || "Available",
        propertyType: propertyType || "Apartment",
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

app.put("/api/properties/:id", authenticate, async (req: any, res) => {
  const { id } = req.params;
  const { address, city, bedrooms, bathrooms, sqft, price, availabilityDate, amenities, description, imageUrls, status, propertyType } = req.body;

  try {
    // Check ownership
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Property not found" });
    if (existing.ownerId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const property = await prisma.property.update({
      where: { id },
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
        status,
        propertyType,
        images: {
          deleteMany: {},
          create: imageUrls?.map((url: string) => ({ url })) || [],
        },
      },
      include: { images: true },
    });
    res.json(property);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to update property" });
  }
});

app.delete("/api/properties/:id", authenticate, async (req: any, res) => {
  const { id } = req.params;
  try {
    // Check ownership
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Property not found" });
    if (existing.ownerId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.property.delete({ where: { id } });
    res.json({ message: "Property deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: "Failed to delete property" });
  }
});

// --- Chat Routes ---
app.get("/api/messages/conversations", authenticate, async (req: any, res) => {
  try {
    const userId = req.user.id;
    // Get unique users the current user has messaged or received messages from
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, fullName: true, avatar: true } },
        receiver: { select: { id: true, fullName: true, avatar: true } },
        property: { select: { id: true, address: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by conversation partner
    const conversationsMap = new Map();
    messages.forEach((msg) => {
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!conversationsMap.has(partner.id)) {
        conversationsMap.set(partner.id, {
          partner,
          lastMessage: msg,
        });
      }
    });

    res.json(Array.from(conversationsMap.values()));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

app.get("/api/messages/:partnerId", authenticate, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      include: {
        sender: { select: { id: true, fullName: true, avatar: true } },
        receiver: { select: { id: true, fullName: true, avatar: true } },
        property: { select: { id: true, address: true, city: true, price: true, images: { take: 1 } } },
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post("/api/messages", authenticate, async (req: any, res) => {
  const { receiverId, content, propertyId } = req.body;
  const senderId = req.user.id;

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        propertyId,
      },
      include: {
        sender: { select: { id: true, fullName: true, avatar: true } },
        receiver: { select: { id: true, fullName: true, avatar: true } },
        property: { select: { id: true, address: true, city: true, price: true, images: { take: 1 } } },
      },
    });

    // Emit via socket
    io.to(receiverId).emit("message", message);
    io.to(senderId).emit("message", message);

    res.json(message);
  } catch (err) {
    res.status(400).json({ error: "Failed to send message" });
  }
});

// --- Wishlist Routes ---
app.get("/api/wishlist", authenticate, async (req: any, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: {
        property: {
          include: { images: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(wishlist.map(w => w.property));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

app.get("/api/wishlist/:propertyId/status", authenticate, async (req: any, res) => {
  const { propertyId } = req.params;
  try {
    const saved = await prisma.wishlist.findUnique({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId
        }
      }
    });
    res.json({ saved: !!saved });
  } catch (err) {
    res.status(500).json({ error: "Failed to check wishlist status" });
  }
});

app.post("/api/wishlist/:propertyId", authenticate, async (req: any, res) => {
  const { propertyId } = req.params;
  try {
    const wishlist = await prisma.wishlist.create({
      data: {
        userId: req.user.id,
        propertyId
      }
    });
    res.json(wishlist);
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: "Property already in wishlist" });
    }
    res.status(400).json({ error: "Failed to add to wishlist" });
  }
});

app.delete("/api/wishlist/:propertyId", authenticate, async (req: any, res) => {
  const { propertyId } = req.params;
  try {
    await prisma.wishlist.delete({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId
        }
      }
    });
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(400).json({ error: "Failed to remove from wishlist" });
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

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
