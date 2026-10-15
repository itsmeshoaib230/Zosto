const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Zosto backend is running successfully!",
  });
});

// Sample products API
app.get("/api/products", (req, res) => {
  res.json([
    { id: 1, name: "Rice 25 kg", price: 1400 },
    { id: 2, name: "Pens Box", price: 120 },
    { id: 3, name: "Notebook Pack", price: 180 },
  ]);
});

app.listen(PORT, () => {
  console.log(`Zosto backend running at http://localhost:${PORT}`);
});
