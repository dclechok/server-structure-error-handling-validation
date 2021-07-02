const express = require("express");
const app = express();

const path = require("path");
const notes = require(path.resolve("src/data/notes-data"));

app.use(express.json());

function validation(req, res, next){
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote) {
    next();
  } else {
    return next({
      message: `Note id not found: ${req.params.noteId}`,
      status: 404
    });
  }
}

app.get("/notes/:noteId", validation, (req, res) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  res.json({ data: foundNote });
});

app.get("/notes", (req, res) => {
  res.json({ data: notes });
});

let lastNoteId = notes.reduce((maxId, note) => Math.max(maxId, note.id), 0);

function validatePostNote(req, res, next){
  const { data: { text } = {} } = req.body;
  // const { data } = req.body;
  // const { text } = data;
  if (text && data != {}) {
    return next();
  }else{
    return next({
      status: 400,
      message: "A 'text' property is required.",
    });
  }
}

app.post("/notes", validatePostNote, (req, res) => {
  const { data: { text } = {} } = req.body;
    const newNote = {
      id: ++lastNoteId, // Increment last id then assign as the current ID
      text,
    };
    notes.push(newNote);
    res.status(201).json({ data: newNote });
});

// Not found handler
app.use((req, res, next) => {
  next({
    status: 404,
    message: `Not found: ${req.originalUrl}`}
    );
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Did something happen?"} = error;
  res.status(status).json({ error: message });
  // res.status(500).send(error); //"Did something happen?"
});

module.exports = app;
