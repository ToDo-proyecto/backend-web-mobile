package com.todo.application.usecase.taskitem;

import com.todo.application.dto.CreateTaskItemDto;
import com.todo.application.exception.NotFoundException;
import com.todo.domain.models.TaskItem;
import com.todo.domain.repository.TaskItemRepository;
import com.todo.domain.repository.TaskListRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class CreateTaskItemUseCase {

    @Inject
    TaskListRepository taskListRepository;

    @Inject
    TaskItemRepository taskItemRepository;

    public TaskItem execute(UUID listId, CreateTaskItemDto dto, String userId) {
        taskListRepository.findByIdAndUserId(listId, userId)
                .orElseThrow(() -> new NotFoundException("Lista no encontrada"));

        TaskItem item = new TaskItem();
        item.setId(UUID.randomUUID());
        item.setListId(listId);
        item.setTitle(dto.title);
        item.setDescription(dto.description);
        item.setCompleted(false);
        item.setPriority(dto.priority != null ? dto.priority : "medium");
        item.setDueDate(dto.dueDate);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        return taskItemRepository.save(item);
    }
}
