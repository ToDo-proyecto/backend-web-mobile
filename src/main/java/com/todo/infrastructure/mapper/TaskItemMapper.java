package com.todo.infrastructure.mapper;

import com.todo.domain.models.TaskItem;
import com.todo.infrastructure.persistence.entity.TaskItemEntity;
import com.todo.infrastructure.persistence.entity.TaskListEntity;

public class TaskItemMapper {

    public static TaskItemEntity toEntity(TaskItem domain, TaskListEntity listEntity) {
        TaskItemEntity entity = new TaskItemEntity();
        entity.setId(domain.getId());
        entity.setList(listEntity);
        entity.setTitle(domain.getTitle());
        entity.setDescription(domain.getDescription());
        entity.setCompleted(domain.isCompleted());
        entity.setPriority(domain.getPriority() != null ? domain.getPriority() : "medium");
        entity.setDueDate(domain.getDueDate());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());
        return entity;
    }

    public static TaskItem toDomain(TaskItemEntity entity) {
        TaskItem domain = new TaskItem();
        domain.setId(entity.getId());
        domain.setListId(entity.getList() != null ? entity.getList().getId() : null);
        domain.setTitle(entity.getTitle());
        domain.setDescription(entity.getDescription());
        domain.setCompleted(entity.isCompleted());
        domain.setPriority(entity.getPriority());
        domain.setDueDate(entity.getDueDate());
        domain.setCreatedAt(entity.getCreatedAt());
        domain.setUpdatedAt(entity.getUpdatedAt());
        return domain;
    }
}
