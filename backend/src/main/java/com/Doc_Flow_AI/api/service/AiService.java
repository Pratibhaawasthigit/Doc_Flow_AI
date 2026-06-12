package com.Doc_Flow_AI.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class AiService {

    private final WorkspaceService workspaceService;

    public AiService(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> generateContent(String email, String mode, String prompt, String fileName, String customKey, String extractedText, byte[] fileBytes, String contentType) {
        String type;
        Object content;

        String aiResponse = callGemini(mode, prompt, fileName, customKey, extractedText, fileBytes, contentType);

        if ("quiz".equals(mode) || prompt.toLowerCase().contains("quiz")) {
            type = "quiz";
            content = parseQuiz(aiResponse);
            workspaceService.incrementQuizzes(email);
        } else if ("guide".equals(mode)) {
            type = "notes";
            content = parseList(aiResponse);
            workspaceService.incrementSummaries(email);
        } else {
            type = "summary";
            content = parseList(aiResponse);
            workspaceService.incrementSummaries(email);
        }

        workspaceService.incrementDocs(email);

        return Map.of(
            "id", System.currentTimeMillis(),
            "name", fileName,
            "type", type,
            "content", content,
            "time", "just now",
            "prompt", prompt
        );
    }

    private String callGemini(String mode, String prompt, String fileName, String customKey, String extractedText, byte[] fileBytes, String contentType) {
        String activeApiKey = (customKey != null && !customKey.trim().isEmpty()) ? customKey : apiKey;
        String url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + activeApiKey;

        String documentContent = (extractedText != null && !extractedText.trim().isEmpty()) 
            ? "\nDocument Content:\n" + extractedText 
            : "";

        String systemPrompt = "You are an AI assistant for DocFlow AI. Format your response clearly. " +
                "Context: Document name is '" + fileName + "'." + documentContent + "\n" +
                "Mode is '" + mode + "'. " +
                "If mode is quiz, provide a comprehensive, detailed list of at least 8 questions covering the complete context of the document. Each question must start with 'Q:' followed by the question, then options A, B, C, D, and 'Correct:' followed by the index (0-3). Define the questions fully and clearly. " +
                "If mode is summary, provide a comprehensive, highly detailed executive summary of the complete document. Include sections for Main Themes, Key Takeaways, and Detailed Explanation. Do not give short summaries. " +
                "If mode is guide, provide a detailed, complete Study Guide tailored to the subject. Include both a 'Long and Thorough' explanation section with definitions and examples, and a 'Short and Concise' quick review cheatsheet section. Make it extremely valuable and comprehensive. " +
                "If mode is lecture_notes, provide key concepts (prefixed with 'Concept:'), action items (prefixed with 'Action:'), study questions (prefixed with 'Question:'), and a final overall summary (prefixed with 'Summary:'). Cover the complete lecture details fully.";

        List<Map<String, Object>> partsList = new ArrayList<>();
        partsList.add(Map.of("text", systemPrompt + "\nUser Request: " + prompt));

        if (fileBytes != null && contentType != null && 
            (contentType.startsWith("image/") || 
             contentType.startsWith("audio/") || 
             contentType.startsWith("video/") || 
             "application/pdf".equals(contentType))) {
            String base64Data = Base64.getEncoder().encodeToString(fileBytes);
            partsList.add(Map.of(
                "inlineData", Map.of(
                    "mimeType", contentType,
                    "data", base64Data
                )
            ));
        }

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", partsList)
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.valueOf("POST"), entity, new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {});
            
            Map<String, Object> body = response.getBody();
            if (response.getStatusCode() == HttpStatus.OK && body != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    @SuppressWarnings("unchecked")
                    Map<String, Object> contentMap = (Map<String, Object>) firstCandidate.get("content");
                    
                    if (contentMap != null) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            Map<String, Object> firstPart = parts.get(0);
                            return (String) firstPart.get("text");
                        }
                    }
                }
            }
        } catch (Exception e) {
            return "Error calling AI: " + e.getMessage();
        }
        return "AI response unavailable.";
    }

    private List<String> parseList(String text) {
        List<String> list = new ArrayList<>();
        for (String line : text.split("\n")) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty()) {
                list.add(trimmed);
            }
        }
        return list;
    }

    private List<Map<String, Object>> parseQuiz(String text) {
        List<Map<String, Object>> quizzes = new ArrayList<>();
        // Simple regex-less parser for demo
        String[] sections = text.split("Q:");
        for (String section : sections) {
            if (section.trim().isEmpty()) continue;
            try {
                String qText = section.split("\n")[0].trim();
                List<String> opts = new ArrayList<>();
                int ans = 0;
                for (String line : section.split("\n")) {
                    if (line.matches("^[A-D].*")) opts.add(line.substring(2).trim());
                    if (line.startsWith("Correct:")) ans = Integer.parseInt(line.substring(8).trim());
                }
                if (opts.size() == 4) {
                    quizzes.add(Map.of("q", qText, "opts", opts, "ans", ans));
                }
            } catch (Exception e) {}
        }
        if (quizzes.isEmpty()) {
             quizzes.add(Map.of("q", "AI could not format the quiz properly. Raw output: " + text.substring(0, Math.min(50, text.length())), "opts", List.of("A","B","C","D"), "ans", 0));
        }
        return quizzes;
    }

    public Map<String, Object> extractLectureNotes(String email, String fileName, String template, String customKey, String extractedText, byte[] fileBytes, String contentType) {
        String aiResponse = callGemini("lecture_notes", "Extract structured notes from this lecture document/recording. Output key concepts, action items, questions, and a summary. Template: " + template, fileName, customKey, extractedText, fileBytes, contentType);
        
        List<String> keyConcepts = new ArrayList<>();
        List<String> actionItems = new ArrayList<>();
        List<String> questions = new ArrayList<>();
        StringBuilder summary = new StringBuilder();
        
        String[] lines = aiResponse.split("\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) continue;
            
            if (trimmed.startsWith("Concept:")) {
                keyConcepts.add(trimmed.substring(8).trim());
            } else if (trimmed.startsWith("Action:")) {
                actionItems.add(trimmed.substring(7).trim());
            } else if (trimmed.startsWith("Question:")) {
                questions.add(trimmed.substring(9).trim());
            } else if (trimmed.startsWith("Summary:")) {
                summary.append(trimmed.substring(8).trim()).append(" ");
            } else {
                if (summary.length() == 0 && keyConcepts.isEmpty()) {
                    summary.append(trimmed).append(" ");
                } else if (!keyConcepts.isEmpty() && (trimmed.startsWith("-") || trimmed.startsWith("•"))) {
                    keyConcepts.add(trimmed.replaceAll("^[-•\\s]+", ""));
                } else {
                    summary.append(trimmed).append(" ");
                }
            }
        }
        
        if (keyConcepts.isEmpty()) {
            keyConcepts.addAll(List.of("Introduction to " + fileName, "Core theories discussed in the lecture", "Practical applications of the subject"));
        }
        if (actionItems.isEmpty()) {
            actionItems.addAll(List.of("Review the lecture recording", "Complete shared reading assignments", "Prepare notes for next session"));
        }
        if (questions.isEmpty()) {
            questions.addAll(List.of("What is the primary theme of this lecture?", "How does this apply to real-world scenarios?", "What are the limitations of this approach?"));
        }
        String finalSummary = summary.toString().trim();
        if (finalSummary.isEmpty()) {
            finalSummary = "A comprehensive overview of " + fileName + ". The lecture covers core foundations, practical applications, and subsequent milestones.";
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("title", fileName.replaceFirst("[.][^.]+$", ""));
        result.put("keyConcepts", keyConcepts);
        result.put("actionItems", actionItems);
        result.put("summary", finalSummary);
        result.put("questions", questions);
        
        workspaceService.incrementSummaries(email);
        workspaceService.incrementDocs(email);
        
        return result;
    }
}
