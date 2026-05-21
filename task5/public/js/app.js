// ════════════════════════════════════════════════════
//  STATE — keeps track of current app data
// ════════════════════════════════════════════════════
let allNotes = []; // all notes from API
let currentFilter = "all"; // current category filter
let currentSearch = ""; // current search term
let currentSort = "newest"; // current sort order
let editingId = null; // ID of note being edited

// ════════════════════════════════════════════════════
//  ON PAGE LOAD
// ════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  fetchNotes(); // load all notes
  fetchStats(); // load stats
});

// ════════════════════════════════════════════════════
//  SECTION 1: FETCH — GET ALL NOTES
// ════════════════════════════════════════════════════
async function fetchNotes() {
  showLoading(true);

  try {
    // Build URL with query params
    let url = "/api/notes?";
    if (currentFilter !== "all") url += `category=${currentFilter}&`;
    if (currentSearch) url += `search=${currentSearch}`;

    // Call the API
    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      allNotes = result.data;
      renderNotes(allNotes);
    } else {
      showToast("Failed to load notes", "error");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    showToast("Could not connect to server", "error");
  }

  showLoading(false);
}

// ════════════════════════════════════════════════════
//  SECTION 2: FETCH — GET STATS
// ════════════════════════════════════════════════════
async function fetchStats() {
  try {
    const response = await fetch("/api/stats");
    const result = await response.json();

    if (result.success) {
      const s = result.data;
      document.getElementById("statTotal").textContent = s.total;
      document.getElementById("statPersonal").textContent = s.personal;
      document.getElementById("statWork").textContent = s.work;
      document.getElementById("statStudy").textContent = s.study;
    }
  } catch (error) {
    console.error("Stats error:", error);
  }
}

// ════════════════════════════════════════════════════
//  SECTION 3: CREATE NOTE — POST
// ════════════════════════════════════════════════════
async function createNote(title, content, category) {
  try {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // tell server we send JSON
      },
      body: JSON.stringify({ title, content, category }), // convert to JSON string
    });

    const result = await response.json();

    if (result.success) {
      showToast("✅ Note created successfully!", "success");
      resetForm();
      fetchNotes(); // refresh the list
      fetchStats(); // refresh stats
    } else {
      showToast(result.message || "Failed to create note", "error");
    }
  } catch (error) {
    console.error("Create error:", error);
    showToast("Server error. Please try again.", "error");
  }
}

// ════════════════════════════════════════════════════
//  SECTION 4: UPDATE NOTE — PUT
// ════════════════════════════════════════════════════
async function updateNote(id, title, content, category) {
  try {
    const response = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, category }),
    });

    const result = await response.json();

    if (result.success) {
      showToast("✅ Note updated successfully!", "success");
      cancelEdit();
      fetchNotes();
      fetchStats();
    } else {
      showToast(result.message || "Failed to update note", "error");
    }
  } catch (error) {
    console.error("Update error:", error);
    showToast("Server error. Please try again.", "error");
  }
}

// ════════════════════════════════════════════════════
//  SECTION 5: DELETE NOTE — DELETE
// ════════════════════════════════════════════════════
let noteToDelete = null;

function confirmDelete(id) {
  noteToDelete = id;
  document.getElementById("deleteModal").style.display = "flex";
  document.getElementById("confirmDeleteBtn").onclick = () => deleteNote(id);
}

function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
  noteToDelete = null;
}

async function deleteNote(id) {
  closeDeleteModal();

  try {
    const response = await fetch(`/api/notes/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      showToast("🗑️ Note deleted", "info");
      fetchNotes();
      fetchStats();
    } else {
      showToast(result.message || "Failed to delete", "error");
    }
  } catch (error) {
    console.error("Delete error:", error);
    showToast("Server error. Please try again.", "error");
  }
}

// ════════════════════════════════════════════════════
//  SECTION 6: FORM HANDLING
// ════════════════════════════════════════════════════
function handleNoteSubmit() {
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();
  const category = document.getElementById("noteCategory").value;

  // Clear old errors
  document.getElementById("titleError").textContent = "";
  document.getElementById("contentError").textContent = "";

  // Validate
  let isValid = true;

  if (!title) {
    document.getElementById("titleError").textContent = "⚠ Title is required";
    isValid = false;
  } else if (title.length < 2) {
    document.getElementById("titleError").textContent = "⚠ Title too short";
    isValid = false;
  }

  if (!content) {
    document.getElementById("contentError").textContent =
      "⚠ Content is required";
    isValid = false;
  }

  if (!isValid) return;

  // Create or Update based on editingId
  if (editingId) {
    updateNote(editingId, title, content, category);
  } else {
    createNote(title, content, category);
  }
}

// Load note data into form for editing
function startEdit(id) {
  const note = allNotes.find((n) => n.id === id);
  if (!note) return;

  editingId = id;

  // Fill form with note data
  document.getElementById("noteTitle").value = note.title;
  document.getElementById("noteContent").value = note.content;
  document.getElementById("noteCategory").value = note.category;

  // Update form UI to show "Edit" mode
  document.getElementById("formTitle").innerHTML =
    '<i class="bi bi-pencil"></i> Edit Note';
  document.getElementById("submitBtnText").textContent = "Update Note";
  document.getElementById("cancelEditBtn").style.display = "block";

  // Scroll to form on mobile
  document.querySelector(".sidebar").scrollIntoView({ behavior: "smooth" });
}

function cancelEdit() {
  editingId = null;
  resetForm();
}

function resetForm() {
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
  document.getElementById("noteCategory").value = "personal";
  document.getElementById("titleError").textContent = "";
  document.getElementById("contentError").textContent = "";
  document.getElementById("formTitle").innerHTML =
    '<i class="bi bi-plus-circle"></i> New Note';
  document.getElementById("submitBtnText").textContent = "Create Note";
  document.getElementById("cancelEditBtn").style.display = "none";
}

// ════════════════════════════════════════════════════
//  SECTION 7: RENDER NOTES TO DOM
// ════════════════════════════════════════════════════
function renderNotes(notes) {
  const grid = document.getElementById("notesGrid");
  const empty = document.getElementById("emptyState");
  const countEl = document.getElementById("notesCount");

  // Apply sorting
  const sorted = sortNotes([...notes], currentSort);

  countEl.textContent = `${sorted.length} note${sorted.length !== 1 ? "s" : ""} found`;

  if (sorted.length === 0) {
    grid.style.display = "none";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  grid.style.display = "grid";

  // Build HTML for each note card
  grid.innerHTML = sorted.map((note) => createNoteCard(note)).join("");

  // Add animation to each card
  grid.querySelectorAll(".note-card").forEach((card, i) => {
    card.style.animationDelay = `${i * 0.05}s`;
  });
}

// Build a single note card HTML string
function createNoteCard(note) {
  const categoryConfig = {
    personal: { emoji: "🙋", color: "#e91e8c", bg: "#fff0f8" },
    work: { emoji: "💼", color: "#2196f3", bg: "#f0f8ff" },
    study: { emoji: "📚", color: "#ff9800", bg: "#fff8e1" },
    other: { emoji: "📌", color: "#9c27b0", bg: "#f8f0ff" },
  };

  const config = categoryConfig[note.category] || categoryConfig.other;
  const date = new Date(note.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `
    <div class="note-card" id="note-${note.id}">

      <div class="note-card-header" style="background: ${config.bg};">
        <div class="note-category-badge" style="color: ${config.color}; background: white;">
          ${config.emoji} ${note.category}
        </div>
        <div class="note-actions">
          <button
            class="note-action-btn edit-btn"
            onclick="startEdit(${note.id})"
            title="Edit note"
          >
            <i class="bi bi-pencil"></i>
          </button>
          <button
            class="note-action-btn delete-btn"
            onclick="confirmDelete(${note.id})"
            title="Delete note"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <div class="note-card-body">
        <h4 class="note-title">${escapeHtml(note.title)}</h4>
        <p class="note-content">${escapeHtml(note.content)}</p>
      </div>

      <div class="note-card-footer">
        <span class="note-date">
          <i class="bi bi-calendar3"></i>
          ${date}
        </span>
        <span class="note-id">#${note.id}</span>
      </div>

    </div>
  `;
}

// ════════════════════════════════════════════════════
//  SECTION 8: FILTER, SEARCH, SORT
// ════════════════════════════════════════════════════
function filterByCategory(category, btn) {
  currentFilter = category;

  // Update active tab
  document.querySelectorAll(".filter-tab").forEach((t) => {
    t.classList.remove("active");
  });
  btn.classList.add("active");

  fetchNotes(); // fetch from API with filter
}

// Search with debounce (waits 400ms after typing stops)
let searchTimeout;
function handleSearch(value) {
  currentSearch = value;
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchNotes();
  }, 400); // wait 400ms before calling API
}

function handleSort(value) {
  currentSort = value;
  renderNotes(allNotes); // re-render with new sort (no API call needed)
}

function sortNotes(notes, sortBy) {
  switch (sortBy) {
    case "newest":
      return notes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    case "oldest":
      return notes.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    case "title":
      return notes.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return notes;
  }
}

// ════════════════════════════════════════════════════
//  SECTION 9: API TESTER
// ════════════════════════════════════════════════════
async function testAPI(method, url) {
  const responseEl = document.getElementById("apiResponse");
  const bodyEl = document.getElementById("apiResponseBody");
  const methodEl = document.getElementById("apiMethod");
  const statusEl = document.getElementById("apiStatus");

  methodEl.textContent = `${method} ${url}`;
  bodyEl.textContent = "Loading...";
  responseEl.style.display = "block";

  try {
    const response = await fetch(url, { method });
    const data = await response.json();

    statusEl.textContent = `${response.status} ${response.statusText}`;
    statusEl.style.color = response.ok ? "#4caf50" : "#f44336";
    bodyEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    bodyEl.textContent = "Error: " + err.message;
  }
}

// ════════════════════════════════════════════════════
//  SECTION 10: UI HELPERS
// ════════════════════════════════════════════════════

// Show/hide loading spinner
function showLoading(show) {
  document.getElementById("loadingSpinner").style.display = show
    ? "flex"
    : "none";
  document.getElementById("notesGrid").style.display = show ? "none" : "grid";
}

// Show toast notification
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.style.display = "block";

  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
