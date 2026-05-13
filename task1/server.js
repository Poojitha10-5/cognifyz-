const express = require("express");
const app = express();
const PORT = 3000;

// Tell Express to use EJS for HTML pages
app.set("view engine", "ejs");

// Allow Express to read form data
app.use(express.urlencoded({ extended: true }));

// Allow Express to serve CSS files
app.use(express.static("public"));

// ROUTE 1: When user visits the website, show the form
app.get("/", (req, res) => {
  res.render("index"); // renders views/index.ejs
});

// ROUTE 2: When user submits the form, handle it here
app.post("/submit", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  // Send data to result page
  res.render("result", { name, email, message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running! Open http://localhost:${PORT}`);
});
