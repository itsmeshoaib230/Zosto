const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();


// const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const renderSecretPath = "/etc/secrets/firebase-service-account.json";

const serviceAccountPath = fs.existsSync(renderSecretPath)
  ? renderSecretPath
  : path.join(__dirname, "firebase-service-account.json");

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);



initializeApp({
  credential: cert(serviceAccount),
});



async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please log in to continue.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.authUser = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired login session. Please log in again.",
    });
  }
}


const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "https://zosto.netlify.app",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Zosto backend is running successfully!",
  });
});

// Signup details API
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, role, storeName, storeLocation, firebaseUid } =
      req.body;

    if (!name || !email || !role || !firebaseUid) {
      return res.status(400).json({
        message: "Name, email, role, and Firebase UID are required.",
      });
    }

    if (!["shopkeeper", "deliveryAgent"].includes(role)) {
      return res.status(400).json({
        message: "Invalid account type.",
      });
    }

    if (
      role === "shopkeeper" &&
      (!storeName?.trim() || !storeLocation?.trim())
    ) {
      return res.status(400).json({
        message: "Store name and location are required for shopkeepers.",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { firebaseUid },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "This account is already registered.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      firebaseUid,
      ...(role === "shopkeeper"
        ? {
          storeName: storeName.trim(),
          storeLocation: storeLocation.trim(),
        }
        : {}),
    });

    return res.status(201).json({
      message: "Signup details saved successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeName: user.storeName,
        storeLocation: user.storeLocation,
      },
    });
  } catch (error) {
    console.error("Signup API error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "This account is already registered.",
      });
    }

    return res.status(500).json({
      message: "Unable to save signup details.",
    });
  }
});



app.patch("/api/users/:firebaseUid/location", verifyFirebaseToken,
  async (req, res) => {
    try {
      if (req.authUser.uid !== req.params.firebaseUid) {
        return res.status(403).json({
          message: "You cannot update another user's location.",
        });
      }
      const { storeLocation } = req.body;

      if (!storeLocation || !storeLocation.trim()) {
        return res.status(400).json({
          message: "Please enter a valid store location.",
        });
      }

      const user = await User.findOne({
        firebaseUid: req.params.firebaseUid,
      });

      if (!user) {
        return res.status(404).json({
          message: "User profile not found.",
        });
      }

      if (user.role !== "shopkeeper") {
        return res.status(403).json({
          message: "Only shopkeepers can change store location.",
        });
      }

      user.storeLocation = storeLocation.trim();
      await user.save();

      return res.json({
        message: "Store location updated successfully.",
        storeLocation: user.storeLocation,
      });
    } catch (error) {
      console.error("Update location error:", error.message);

      return res.status(500).json({
        message: "Unable to update store location.",
      });
    }
  });


// Start server after connecting to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully!");

    app.listen(PORT, () => {
      console.log(`Zosto backend running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
