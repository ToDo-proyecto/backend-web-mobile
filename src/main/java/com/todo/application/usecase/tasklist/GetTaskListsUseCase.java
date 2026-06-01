package com.todo.application.usecase.tasklist;

import com.todo.application.dto.TaskListResponse;
import com.todo.domain.repository.TaskListRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class GetTaskListsUseCase {

    @Inject
    TaskListRepository taskListRepository;

    public List<TaskListResponse> execute(String userId) {
        return taskListRepository.findByUserId(userId)
                .stream()
                .map(TaskListResponse::from)
                .collect(Collectors.toList());
    }
}
