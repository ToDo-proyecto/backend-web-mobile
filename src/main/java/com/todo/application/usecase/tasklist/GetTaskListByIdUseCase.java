package com.todo.application.usecase.tasklist;

import com.todo.application.dto.TaskListResponse;
import com.todo.application.exception.NotFoundException;
import com.todo.domain.repository.TaskListRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.UUID;

@ApplicationScoped
public class GetTaskListByIdUseCase {

    @Inject
    TaskListRepository taskListRepository;

    public TaskListResponse execute(UUID id, String userId) {
        return taskListRepository.findByIdAndUserId(id, userId)
                .map(TaskListResponse::from)
                .orElseThrow(() -> new NotFoundException("Lista no encontrada"));
    }
}
