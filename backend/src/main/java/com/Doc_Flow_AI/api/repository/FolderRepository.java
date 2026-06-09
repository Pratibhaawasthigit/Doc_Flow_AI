package com.Doc_Flow_AI.api.repository;

import com.Doc_Flow_AI.api.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByUserEmail(String userEmail);
}
