package com.todo.application.dto;

import com.todo.domain.models.TaskList;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class TaskListResponse {
    public UUID id;
    public String title;
    public String subtitle;
    public List<String> tags;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public int percentage;
    public String idColor;
    public String idIcon;

    public static TaskListResponse from(TaskList taskList) {
        TaskListResponse r = new TaskListResponse();
        r.id = taskList.getId();
        r.title = taskList.getTitle();
        r.subtitle = taskList.getSubtitle();
        r.tags = taskList.getTags();
        r.createdAt = taskList.getCreatedAt();
        r.updatedAt = taskList.getUpdatedAt();
        r.percentage = taskList.getPercentage();
        r.idColor = taskList.getColor();
        r.idIcon = taskList.getIcon();
        return r;
    }
}
