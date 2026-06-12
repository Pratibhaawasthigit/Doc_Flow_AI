package com.Doc_Flow_AI.api.controller;

import com.Doc_Flow_AI.api.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generate(
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "email", defaultValue = "admin@docflow.ai") String email,
            @RequestParam(value = "mode", defaultValue = "summary") String mode,
            @RequestParam(value = "prompt", defaultValue = "") String prompt,
            @RequestParam(value = "extractedText", required = false) String extractedText,
            @RequestHeader(value = "X-Gemini-Key", required = false) String customKey) {
        
        String fileName = (file != null) ? file.getOriginalFilename() : "Document_" + System.currentTimeMillis() + ".pdf";
        byte[] fileBytes = null;
        String contentType = null;
        
        if (file != null && !file.isEmpty()) {
            try {
                fileBytes = file.getBytes();
                contentType = file.getContentType();
            } catch (Exception e) {
                System.err.println("Failed to read file bytes: " + e.getMessage());
            }
        }
        
        Map<String, Object> result = aiService.generateContent(email, mode, prompt, fileName, customKey, extractedText, fileBytes, contentType);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/lecture")
    public ResponseEntity<?> lecture(
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "email", defaultValue = "admin@docflow.ai") String email,
            @RequestParam(value = "template", defaultValue = "structured") String template,
            @RequestParam(value = "extractedText", required = false) String extractedText,
            @RequestHeader(value = "X-Gemini-Key", required = false) String customKey) {
        
        String fileName = (file != null) ? file.getOriginalFilename() : "Lecture_" + System.currentTimeMillis() + ".mp3";
        byte[] fileBytes = null;
        String contentType = null;
        
        if (file != null && !file.isEmpty()) {
            try {
                fileBytes = file.getBytes();
                contentType = file.getContentType();
            } catch (Exception e) {
                System.err.println("Failed to read lecture file bytes: " + e.getMessage());
            }
        }
        
        Map<String, Object> result = aiService.extractLectureNotes(email, fileName, template, customKey, extractedText, fileBytes, contentType);
        return ResponseEntity.ok(result);
    }
}
