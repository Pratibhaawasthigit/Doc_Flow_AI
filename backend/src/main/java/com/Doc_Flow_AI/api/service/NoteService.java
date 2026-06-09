package com.Doc_Flow_AI.api.service;

import com.Doc_Flow_AI.api.model.Note;
import com.Doc_Flow_AI.api.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public List<Note> getNotesByFolderId(Long folderId) {
        return noteRepository.findByFolderId(folderId);
    }

    @SuppressWarnings("null")
    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public List<Note> getNotesByUserEmail(String email) {
        return noteRepository.findByUserEmail(email);
    }

    @SuppressWarnings("null")
    public Note saveNote(Note note) {
        return noteRepository.save(note);
    }

    @SuppressWarnings("null")
    public Note updateNote(Long id, Note noteDetails) {
        return noteRepository.findById(id)
                .map(note -> {
                    note.setLabel(noteDetails.getLabel());
                    note.setIcon(noteDetails.getIcon());
                    note.setMeta(noteDetails.getMeta());
                    note.setTag(noteDetails.getTag());
                    note.setTagBg(noteDetails.getTagBg());
                    note.setTagColor(noteDetails.getTagColor());
                    note.setContent(noteDetails.getContent());
                    note.setSummary(noteDetails.getSummary());
                    note.setFolderId(noteDetails.getFolderId());
                    note.setUserEmail(noteDetails.getUserEmail());
                    return noteRepository.save(note);
                })
                .orElseThrow(() -> new RuntimeException("Note not found"));
    }

    @SuppressWarnings("null")
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }
}
