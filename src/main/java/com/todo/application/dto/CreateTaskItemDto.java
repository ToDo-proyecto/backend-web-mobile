package com.todo.application.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class CreateTaskItemDto {
    @NotBlank(message = "El título es obligatorio")
    public String title;
    public String description;
    public String priority = "medium";
    public LocalDateTime dueDate;
}
