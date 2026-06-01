package com.todo.application.usecase.taskitem;

import com.todo.application.exception.NotFoundException;
import com.todo.domain.models.TaskItem;
import com.todo.domain.repository.TaskItemRepository;
import com.todo.domain.repository.TaskListRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class GetTaskItemsUseCase {

    @Inject
    TaskListRepository taskListRepository;

    @Inject
    TaskItemRepository taskItemRepository;

    public List<TaskItem> execute(UUID listId, String userId) {
        taskListRepository.findByIdAndUserId(listId, userId)
                .orElseThrow(() -> new NotFoundException("Lista no encontrada"));
        return taskItemRepository.findByListId(listId);
    }
}
