package com.Doc_Flow_AI.api.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;
    private String icon;
    private String meta;
    private String tag;
    private String tagBg;
    private String tagColor;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ElementCollection
    private List<String> summary;

    private Long folderId;
    private String userEmail;

    public Note() {}

    public Note(String label, String icon, String meta, String tag, String tagBg, String tagColor, String content, List<String> summary, Long folderId, String userEmail) {
        this.label = label;
        this.icon = icon;
        this.meta = meta;
        this.tag = tag;
        this.tagBg = tagBg;
        this.tagColor = tagColor;
        this.content = content;
        this.summary = summary;
        this.folderId = folderId;
        this.userEmail = userEmail;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getMeta() { return meta; }
    public void setMeta(String meta) { this.meta = meta; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getTagBg() { return tagBg; }
    public void setTagBg(String tagBg) { this.tagBg = tagBg; }

    public String getTagColor() { return tagColor; }
    public void setTagColor(String tagColor) { this.tagColor = tagColor; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public List<String> getSummary() { return summary; }
    public void setSummary(List<String> summary) { this.summary = summary; }

    public Long getFolderId() { return folderId; }
    public void setFolderId(Long folderId) { this.folderId = folderId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}