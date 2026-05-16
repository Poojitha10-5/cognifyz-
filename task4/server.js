const express = require("express");
const app = express();
const PORT = 3003;

// Setup
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Only ONE route needed — this is a Single Page App
// All navigation happens in the browser using JavaScript
app.get("/", (req, res) => {
  res.render("index");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Task 4 running at http://localhost:${PORT}`);
});
