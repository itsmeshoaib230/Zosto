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

app.listen(PORT, () => {
  console.log(`Zosto backend running at http://localhost:${PORT}`);
});
