package com.Doc_Flow_AI.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "folders")
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;
    private String icon;
    private String iconColor;
    private String bg;
    private String iconBg;
    private String badgeBg;
    private String badgeColor;
    private String accentVar;
    private String description;

    private String userEmail;

    public Folder() {}

    public Folder(String label, String icon, String iconColor, String bg, String userEmail) {
        this.label = label;
        this.icon = icon;
        this.iconColor = iconColor;
        this.bg = bg;
        this.userEmail = userEmail;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getIconColor() { return iconColor; }
    public void setIconColor(String iconColor) { this.iconColor = iconColor; }

    public String getBg() { return bg; }
    public void setBg(String bg) { this.bg = bg; }

    public String getIconBg() { return iconBg; }
    public void setIconBg(String iconBg) { this.iconBg = iconBg; }

    public String getBadgeBg() { return badgeBg; }
    public void setBadgeBg(String badgeBg) { this.badgeBg = badgeBg; }

    public String getBadgeColor() { return badgeColor; }
    public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }

    public String getAccentVar() { return accentVar; }
    public void setAccentVar(String accentVar) { this.accentVar = accentVar; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}
