package com.todo.application.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class CreateTaskListDto {
    @NotBlank(message = "El título es obligatorio")
    public String title;
    public String subtitle = "";
    public List<String> tags = new ArrayList<>();
    public String color = "#3B82F6";
    public String icon = "list";
}
