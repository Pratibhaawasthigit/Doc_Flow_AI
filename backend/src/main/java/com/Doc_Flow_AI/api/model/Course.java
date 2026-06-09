package com.Doc_Flow_AI.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String level;
    private int progress;
    private String icon;

    // Aligned with Frontend Names
    private String image;
    private Integer lessons;
    private String instructor;
    private String avatar;
    private Double rating;
    private String category;
    private String duration;
    private String videoUrl;

    @Column(length = 2000)
    private String description;

    private String enrolled;
    private String badge;
    private String levelColor;

    public Course() {
    }

    public Course(String title, String level, int progress, String icon, String image, Integer lessons,
            String instructor, String avatar, Double rating, String category, String duration, String videoUrl,
            String description, String enrolled, String badge, String levelColor) {
        this.title = title;
        this.level = level;
        this.progress = progress;
        this.icon = icon;
        this.image = image;
        this.lessons = lessons;
        this.instructor = instructor;
        this.avatar = avatar;
        this.rating = rating;
        this.category = category;
        this.duration = duration;
        this.videoUrl = videoUrl;
        this.description = description;
        this.enrolled = enrolled;
        this.badge = badge;
        this.levelColor = levelColor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getLessons() {
        return lessons;
    }

    public void setLessons(Integer lessons) {
        this.lessons = lessons;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEnrolled() {
        return enrolled;
    }

    public void setEnrolled(String enrolled) {
        this.enrolled = enrolled;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getLevelColor() {
        return levelColor;
    }

    public void setLevelColor(String levelColor) {
        this.levelColor = levelColor;
    }
}
