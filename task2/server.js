// ─── IMPORTS ─────────────────────────────────────────────────
const express = require("express");
const { body, validationResult } = require("express-validator");

// ─── APP SETUP ───────────────────────────────────────────────
const app = express();
const PORT = 3001; // Different from task1 (which uses 3000)

// ─── TEMPORARY STORAGE ───────────────────────────────────────
// This is an array that stores submitted form data
// NOTE: This clears every time you restart the server
// In Task 6, we will replace this with a real database
const submissionsStore = [];

// ─── MIDDLEWARE ───────────────────────────────────────────────
// Tell Express to use EJS templates
app.set("view engine", "ejs");

// Tell Express to read form data
app.use(express.urlencoded({ extended: true }));

// Tell Express to serve CSS from public folder
app.use(express.static("public"));

// ─── ROUTE 1: Show the form ───────────────────────────────────
app.get("/", (req, res) => {
  // errors = empty array (no errors on first visit)
  // old = empty object (no previous values to show)
  res.render("index", { errors: [], old: {} });
});

// ─── ROUTE 2: View all stored submissions ─────────────────────
app.get("/submissions", (req, res) => {
  res.render("submissions", { submissions: submissionsStore });
});

// ─── ROUTE 3: Handle form submission with validation ──────────
app.post(
  "/submit",

  // VALIDATION RULES (express-validator checks these)
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email cannot be empty")
      .isEmail()
      .withMessage("Please enter a valid email address"),

    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number cannot be empty")
      .matches(/^[0-9]{10}$/)
      .withMessage("Phone must be exactly 10 digits"),

    body("age")
      .notEmpty()
      .withMessage("Age cannot be empty")
      .isInt({ min: 18, max: 100 })
      .withMessage("Age must be between 18 and 100"),

    body("message")
      .trim()
      .notEmpty()
      .withMessage("Message cannot be empty")
      .isLength({ min: 10 })
      .withMessage("Message must be at least 10 characters long"),

    body("agree")
      .notEmpty()
      .withMessage("You must agree to the terms and conditions"),
  ],

  // AFTER VALIDATION: This function runs
  (req, res) => {
    // Check if there are any validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // ❌ There ARE errors
      // Re-render the form with:
      // 1. The error messages
      // 2. The old values so user doesn't retype everything
      return res.render("index", {
        errors: errors.array(),
        old: req.body,
      });
    }

    // ✅ No errors — save the data
    const newSubmission = {
      id: submissionsStore.length + 1,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
      message: req.body.message,
      date: new Date().toLocaleString(),
    };

    // Push into our temporary array storage
    submissionsStore.push(newSubmission);

    console.log("New submission saved:", newSubmission);

    // Show the success page
    res.render("result", { submission: newSubmission });
  },
);

// ─── START SERVER ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Task 2 server running!`);
  console.log(`👉 Open http://localhost:${PORT}`);
});
