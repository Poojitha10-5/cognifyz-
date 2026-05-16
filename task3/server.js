const express = require("express");
const app = express();
const PORT = 3002;

// Setup
app.set("view engine", "ejs");
app.use(express.static("public"));

// ── ROUTE: Home page ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.render("index", {
    title: "Cognifyz Web Tasks",
    activePage: "home",
  });
});

// ── ROUTE: About page ─────────────────────────────────────────
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Us",
    activePage: "about",
  });
});

// ── ROUTE: Contact page ───────────────────────────────────────
app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Us",
    activePage: "contact",
  });
});

// ── START SERVER ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Task 3 running at http://localhost:${PORT}`);
});
