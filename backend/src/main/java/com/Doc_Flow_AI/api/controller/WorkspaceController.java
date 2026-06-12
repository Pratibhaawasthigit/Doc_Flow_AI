package com.Doc_Flow_AI.api.controller;

import com.Doc_Flow_AI.api.model.Workspace;
import com.Doc_Flow_AI.api.service.WorkspaceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workspace")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @GetMapping
    public Workspace getWorkspace(@RequestParam(required = false, defaultValue = "admin@docflow.ai") String email) {
        return workspaceService.getOrCreateWorkspace(email);
    }

    @PostMapping("/increment/docs")
    public Workspace incrementDocs(@RequestParam(required = false, defaultValue = "admin@docflow.ai") String email) {
        return workspaceService.incrementDocs(email);
    }

    @PostMapping("/increment/quizzes")
    public Workspace incrementQuizzes(@RequestParam(required = false, defaultValue = "admin@docflow.ai") String email) {
        return workspaceService.incrementQuizzes(email);
    }

    @PostMapping("/increment/summaries")
    public Workspace incrementSummaries(@RequestParam(required = false, defaultValue = "admin@docflow.ai") String email) {
        return workspaceService.incrementSummaries(email);
    }
}
