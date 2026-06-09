package com.Doc_Flow_AI.api.service;

import com.Doc_Flow_AI.api.model.ActivityLog;
import com.Doc_Flow_AI.api.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    public ActivityLog logActivity(String userEmail, String type, String title, String description) {
        ActivityLog log = new ActivityLog(userEmail, type, title, description);
        return activityLogRepository.save(log);
    }

    public List<ActivityLog> getRecentActivities(String userEmail, int limit) {
        return activityLogRepository.findByUserEmailOrderByCreatedAtDesc(userEmail, PageRequest.of(0, limit));
    }

    public List<ActivityLog> getAllActivities(String userEmail) {
        return activityLogRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }

    public Map<String, Long> getActivityCounts(String userEmail) {
        Map<String, Long> counts = new HashMap<>();
        counts.put("DOCUMENT", activityLogRepository.countByUserEmailAndType(userEmail, "DOCUMENT"));
        counts.put("QUIZ", activityLogRepository.countByUserEmailAndType(userEmail, "QUIZ"));
        counts.put("SUMMARY", activityLogRepository.countByUserEmailAndType(userEmail, "SUMMARY"));
        return counts;
    }
}
