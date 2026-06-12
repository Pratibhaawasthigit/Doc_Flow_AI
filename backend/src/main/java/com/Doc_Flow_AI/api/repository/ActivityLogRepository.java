package com.Doc_Flow_AI.api.repository;

import com.Doc_Flow_AI.api.model.ActivityLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUserEmailOrderByCreatedAtDesc(String userEmail, Pageable pageable);
    long countByUserEmailAndType(String userEmail, String type);
    List<ActivityLog> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
