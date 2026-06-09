package com.Doc_Flow_AI.api.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String icon;

    @Column(nullable = false, unique = true)
    private String name;

    private String count;

    @ElementCollection
    private List<String> tags;

    public Subject() {
    }

    public Subject(String name, String icon, String count, List<String> tags) {
        this.name = name;
        this.icon = icon;
        this.count = count;
        this.tags = tags;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCount() { return count; }
    public void setCount(String count) { this.count = count; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
