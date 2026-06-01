package com.todo.application.usecase.taskitem;

import com.todo.application.dto.UpdateTaskItemDto;
import com.todo.application.exception.NotFoundException;
import com.todo.domain.models.TaskItem;
import com.todo.domain.repository.TaskItemRepository;
import com.todo.domain.repository.TaskListRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class UpdateTaskItemUseCase {

    @Inject
    TaskListRepository taskListRepository;

    @Inject
    TaskItemRepository taskItemRepository;

    public TaskItem execute(UUID listId, UUID itemId, UpdateTaskItemDto dto, String userId) {
        taskListRepository.findByIdAndUserId(listId, userId)
                .orElseThrow(() -> new NotFoundException("Lista no encontrada"));

        TaskItem item = taskItemRepository.findByIdAndListId(itemId, listId)
                .orElseThrow(() -> new NotFoundException("Tarea no encontrada"));

        if (dto.title != null) item.setTitle(dto.title);
        if (dto.description != null) item.setDescription(dto.description);
        if (dto.completed != null) item.setCompleted(dto.completed);
        if (dto.priority != null) item.setPriority(dto.priority);
        if (dto.dueDate != null) item.setDueDate(dto.dueDate);
        item.setUpdatedAt(LocalDateTime.now());

        return taskItemRepository.save(item);
    }
}
