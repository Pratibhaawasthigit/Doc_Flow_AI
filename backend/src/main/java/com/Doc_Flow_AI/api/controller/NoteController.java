package com.Doc_Flow_AI.api.controller;

import com.Doc_Flow_AI.api.model.Note;
import com.Doc_Flow_AI.api.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @GetMapping
    public List<Note> getNotes(@RequestParam(required = false, defaultValue = "admin@docflow.ai") String email) {
        return noteService.getNotesByUserEmail(email);
    }

    @GetMapping("/folder/{folderId}")
    public List<Note> getNotesByFolder(@PathVariable Long folderId) {
        return noteService.getNotesByFolderId(folderId);
    }

    @PostMapping
    public Note createNote(@RequestBody Note note) {
        if (note.getUserEmail() == null) {
            note.setUserEmail("admin@docflow.ai");
        }
        return noteService.saveNote(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
        try {
            return ResponseEntity.ok(noteService.updateNote(id, noteDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok().build();
    }
}
