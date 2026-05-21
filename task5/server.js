const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3004;

// ─── MIDDLEWARE ───────────────────────────────────────────────
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // lets server read JSON from fetch()
app.use(cors()); // allows cross-origin requests
app.use(express.static("public"));

// ─── TEMPORARY IN-MEMORY DATABASE ────────────────────────────
// In Task 6 we replace this with a real MongoDB database
// For now data lives in these arrays (resets on restart)

let notes = [
  {
    id: 1,
    title: "Welcome Note",
    content: "This is your first note! Edit or delete it.",
    category: "personal",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Task 5 Goals",
    content: "Learn REST APIs, fetch(), CRUD operations.",
    category: "work",
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3; // auto-increment ID counter

// ════════════════════════════════════════════════════
//  PAGE ROUTES — serve HTML
// ════════════════════════════════════════════════════

app.get("/", (req, res) => {
  res.render("index");
});

// ════════════════════════════════════════════════════
//  REST API ROUTES — return JSON
// ════════════════════════════════════════════════════

// ── GET /api/notes ────────────────────────────────
// Returns ALL notes as JSON array
app.get("/api/notes", (req, res) => {
  const { category, search } = req.query;
  let result = [...notes];

  // Filter by category if provided
  if (category && category !== "all") {
    result = result.filter((n) => n.category === category);
  }

  // Filter by search term if provided
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      (n) =>
        n.title.toLowerCase().includes(term) ||
        n.content.toLowerCase().includes(term),
    );
  }

  res.json({
    success: true,
    count: result.length,
    data: result,
  });
});

// ── GET /api/notes/:id ────────────────────────────
// Returns ONE note by ID
app.get("/api/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: `Note with ID ${id} not found`,
    });
  }

  res.json({ success: true, data: note });
});

// ── POST /api/notes ───────────────────────────────
// Creates a NEW note
app.post("/api/notes", (req, res) => {
  const { title, content, category } = req.body;

  // Server-side validation
  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Content is required",
    });
  }

  // Create new note object
  const newNote = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    category: category || "personal",
    createdAt: new Date().toISOString(),
  };

  notes.push(newNote);

  // Return 201 Created with the new note
  res.status(201).json({
    success: true,
    message: "Note created successfully",
    data: newNote,
  });
});

// ── PUT /api/notes/:id ────────────────────────────
// Updates an EXISTING note
app.put("/api/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex((n) => n.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Note with ID ${id} not found`,
    });
  }

  const { title, content, category } = req.body;

  // Validation
  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  // Update the note (keep original id and createdAt)
  notes[index] = {
    ...notes[index], // spread existing fields
    title: title.trim(),
    content: content.trim(),
    category: category || notes[index].category,
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: "Note updated successfully",
    data: notes[index],
  });
});

// ── DELETE /api/notes/:id ─────────────────────────
// Deletes a note
app.delete("/api/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex((n) => n.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Note with ID ${id} not found`,
    });
  }

  const deleted = notes[index];
  notes.splice(index, 1); // remove from array

  res.json({
    success: true,
    message: "Note deleted successfully",
    data: deleted,
  });
});

// ── GET /api/stats ────────────────────────────────
// Returns statistics about the notes
app.get("/api/stats", (req, res) => {
  const stats = {
    total: notes.length,
    personal: notes.filter((n) => n.category === "personal").length,
    work: notes.filter((n) => n.category === "work").length,
    study: notes.filter((n) => n.category === "study").length,
    other: notes.filter((n) => n.category === "other").length,
  };

  res.json({ success: true, data: stats });
});

// ─── START SERVER ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Task 5 running at http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/notes`);
});
