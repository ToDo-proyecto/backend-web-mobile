package com.todo.application.usecase.taskitem;

import com.todo.application.exception.NotFoundException;
import com.todo.domain.models.TaskItem;
import com.todo.domain.repository.TaskItemRepository;
import com.todo.domain.repository.TaskListRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.UUID;

@ApplicationScoped
public class DeleteTaskItemUseCase {

    @Inject
    TaskListRepository taskListRepository;

    @Inject
    TaskItemRepository taskItemRepository;

    public void execute(UUID listId, UUID itemId, String userId) {
        taskListRepository.findByIdAndUserId(listId, userId)
                .orElseThrow(() -> new NotFoundException("Lista no encontrada"));

        TaskItem item = taskItemRepository.findByIdAndListId(itemId, listId)
                .orElseThrow(() -> new NotFoundException("Tarea no encontrada"));

        taskItemRepository.remove(item.getId());
    }
}
