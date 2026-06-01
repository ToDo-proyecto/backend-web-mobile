package com.todo.domain.repository;

import com.todo.domain.models.TaskItem;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskItemRepository {
    List<TaskItem> findByListId(UUID listId);
    Optional<TaskItem> findByIdAndListId(UUID itemId, UUID listId);
    TaskItem save(TaskItem taskItem);
    void remove(UUID id);
}
