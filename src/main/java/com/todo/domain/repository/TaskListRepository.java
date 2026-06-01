package com.todo.domain.repository;

import com.todo.domain.models.TaskList;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskListRepository {
    List<TaskList> findByUserId(String userId);
    Optional<TaskList> findByIdAndUserId(UUID id, String userId);
    TaskList save(TaskList taskList);
    void remove(UUID id);
}
