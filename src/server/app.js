import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/users", (req, res) => {
  const filePath = path.join(__dirname, "users.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users.json:", err);
      return res.status(500).json({ error: "Could not read users.json" });
    }
    try {
      const users = JSON.parse(data);
      res.json(users);
    } catch (parseErr) {
      console.error("Error parsing users.json:", parseErr);
      res.status(500).json({ error: "Invalid JSON in users.json" });
    }
  });
});

app.post("/users/:id", (req, res) => {
  const filePath = path.join(__dirname, "users.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users.json:", err);
      return res.status(500).json({ error: "Could not read users.json" });
    }
    let users;
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing users.json:", parseErr);
      return res.status(500).json({ error: "Invalid JSON in users.json" });
    }

    const index = users.findIndex((u) => u.id === req.params.id);

    if (index === -1) return res.status(404).json({ error: "User not found" });

    users[index] = { ...users[index], ...req.body };
    fs.writeFile(
      filePath,
      JSON.stringify(users, null, 2),
      "utf8",
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing users.json:", writeErr);
          return res.status(500).json({ error: "Could not write users.json" });
        }
        res.json(users[index]);
      },
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
