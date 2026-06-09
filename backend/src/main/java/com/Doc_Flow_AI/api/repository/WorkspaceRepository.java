package com.Doc_Flow_AI.api.repository;

import com.Doc_Flow_AI.api.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    Optional<Workspace> findByUserEmail(String userEmail);
}
