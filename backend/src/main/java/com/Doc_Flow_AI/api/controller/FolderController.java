package com.Doc_Flow_AI.api.controller;

import com.Doc_Flow_AI.api.model.Folder;
import com.Doc_Flow_AI.api.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FolderController {

    @Autowired
    private FolderService folderService;

    @GetMapping
    public List<Folder> getFolders(@RequestParam(required = false, defaultValue = "admin@docflow.ai") String email) {
        return folderService.getFoldersByEmail(email);
    }

    @PostMapping
    public Folder createFolder(@RequestBody Folder folder) {
        if (folder.getUserEmail() == null) {
            folder.setUserEmail("admin@docflow.ai");
        }
        return folderService.saveFolder(folder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Folder> updateFolder(@PathVariable Long id, @RequestBody Folder folderDetails) {
        try {
            return ResponseEntity.ok(folderService.updateFolder(id, folderDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable Long id) {
        folderService.deleteFolder(id);
        return ResponseEntity.ok().build();
    }
}
