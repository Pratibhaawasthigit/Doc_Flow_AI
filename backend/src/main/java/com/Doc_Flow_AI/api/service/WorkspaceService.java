package com.Doc_Flow_AI.api.service;

import com.Doc_Flow_AI.api.model.Workspace;
import com.Doc_Flow_AI.api.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class WorkspaceService {

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private ActivityLogService activityLogService;

    public Workspace getOrCreateWorkspace(String email) {
        return workspaceRepository.findByUserEmail(email)
                .orElseGet(() -> {
                    Workspace newWorkspace = new Workspace(email);
                    return workspaceRepository.save(newWorkspace);
                });
    }

    public Workspace incrementDocs(String email) {
        Workspace ws = getOrCreateWorkspace(email);
        ws.setDocsProcessed(ws.getDocsProcessed() + 1);
        activityLogService.logActivity(email, "DOCUMENT", "Document Processed", "A new document was uploaded and processed.");
        return workspaceRepository.save(ws);
    }

    public Workspace incrementQuizzes(String email) {
        Workspace ws = getOrCreateWorkspace(email);
        ws.setQuizzesGenerated(ws.getQuizzesGenerated() + 1);
        activityLogService.logActivity(email, "QUIZ", "Quiz Generated", "A quiz was automatically generated from your document.");
        return workspaceRepository.save(ws);
    }

    public Workspace incrementSummaries(String email) {
        Workspace ws = getOrCreateWorkspace(email);
        ws.setSummariesCreated(ws.getSummariesCreated() + 1);
        activityLogService.logActivity(email, "SUMMARY", "Summary Created", "An AI-powered summary was generated.");
        return workspaceRepository.save(ws);
    }
}
