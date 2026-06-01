package com.todo.application.dto;

import java.time.LocalDateTime;

public class UpdateTaskItemDto {
    public String title;
    public String description;
    public Boolean completed;
    public String priority;
    public LocalDateTime dueDate;
}
