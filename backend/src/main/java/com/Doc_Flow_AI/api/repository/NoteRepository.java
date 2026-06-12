package com.Doc_Flow_AI.api.repository;

import com.Doc_Flow_AI.api.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserEmail(String userEmail);
    List<Note> findByFolderId(Long folderId);
}
