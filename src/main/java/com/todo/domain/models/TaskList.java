package com.todo.domain.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TaskList {
    private UUID id;
    private String userId;
    private String title;
    private String subtitle;
    private String color;
    private String icon;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TaskItem> items;

    public TaskList() {
        this.tags = new ArrayList<>();
        this.items = new ArrayList<>();
    }

    public int getPercentage() {
        if (items == null || items.isEmpty()) return 0;
        long completed = items.stream().filter(TaskItem::isCompleted).count();
        return (int) Math.round((double) completed / items.size() * 100);
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<TaskItem> getItems() { return items; }
    public void setItems(List<TaskItem> items) { this.items = items; }
}
