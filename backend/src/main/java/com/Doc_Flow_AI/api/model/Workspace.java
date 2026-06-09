package com.Doc_Flow_AI.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "workspaces")
public class Workspace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String userEmail;

    private int docsProcessed = 0;
    private int quizzesGenerated = 0;
    private int summariesCreated = 0;

    public Workspace() {}

    public Workspace(String userEmail) {
        this.userEmail = userEmail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public int getDocsProcessed() {
        return docsProcessed;
    }

    public void setDocsProcessed(int docsProcessed) {
        this.docsProcessed = docsProcessed;
    }

    public int getQuizzesGenerated() {
        return quizzesGenerated;
    }

    public void setQuizzesGenerated(int quizzesGenerated) {
        this.quizzesGenerated = quizzesGenerated;
    }

    public int getSummariesCreated() {
        return summariesCreated;
    }

    public void setSummariesCreated(int summariesCreated) {
        this.summariesCreated = summariesCreated;
    }
}
