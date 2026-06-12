package com.Doc_Flow_AI.api.repository;

import com.Doc_Flow_AI.api.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByUserEmail(String userEmail);
}
