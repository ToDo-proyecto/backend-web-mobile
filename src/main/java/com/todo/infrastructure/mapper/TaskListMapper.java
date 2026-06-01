package com.todo.infrastructure.mapper;

import com.todo.domain.models.TaskItem;
import com.todo.domain.models.TaskList;
import com.todo.infrastructure.persistence.entity.TaskItemEntity;
import com.todo.infrastructure.persistence.entity.TaskListEntity;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class TaskListMapper {

    private static final Jsonb jsonb = JsonbBuilder.create();

    public static TaskListEntity toEntity(TaskList domain) {
        TaskListEntity entity = new TaskListEntity();
        entity.setId(domain.getId());
        entity.setUserId(domain.getUserId());
        entity.setTitle(domain.getTitle());
        entity.setSubtitle(domain.getSubtitle() != null ? domain.getSubtitle() : "");
        entity.setColor(domain.getColor() != null ? domain.getColor() : "#3B82F6");
        entity.setIcon(domain.getIcon() != null ? domain.getIcon() : "list");
        entity.setTags(serializeTags(domain.getTags()));
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());
        return entity;
    }

    public static TaskList toDomain(TaskListEntity entity) {
        TaskList domain = new TaskList();
        domain.setId(entity.getId());
        domain.setUserId(entity.getUserId());
        domain.setTitle(entity.getTitle());
        domain.setSubtitle(entity.getSubtitle() != null ? entity.getSubtitle() : "");
        domain.setColor(entity.getColor() != null ? entity.getColor() : "#3B82F6");
        domain.setIcon(entity.getIcon() != null ? entity.getIcon() : "list");
        domain.setTags(deserializeTags(entity.getTags()));
        domain.setCreatedAt(entity.getCreatedAt());
        domain.setUpdatedAt(entity.getUpdatedAt());

        if (entity.getItems() != null) {
            List<TaskItem> items = entity.getItems().stream()
                    .map(TaskItemMapper::toDomain)
                    .collect(Collectors.toList());
            domain.setItems(items);
        }

        return domain;
    }

    private static String serializeTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) return "[]";
        try {
            return jsonb.toJson(tags);
        } catch (Exception e) {
            return "[]";
        }
    }

    private static List<String> deserializeTags(String tagsJson) {
        if (tagsJson == null || tagsJson.isBlank() || tagsJson.equals("[]")) return new ArrayList<>();
        try {
            String[] arr = jsonb.fromJson(tagsJson, String[].class);
            return new ArrayList<>(Arrays.asList(arr));
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
