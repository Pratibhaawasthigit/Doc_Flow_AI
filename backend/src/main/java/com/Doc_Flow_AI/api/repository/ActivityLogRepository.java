package com.Doc_Flow_AI.api.repository;

import com.Doc_Flow_AI.api.model.ActivityLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUserEmailOrderByCreatedAtDesc(String userEmail, Pageable pageable);
    long countByUserEmailAndType(String userEmail, String type);
    List<ActivityLog> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
