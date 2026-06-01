package com.todo.application.usecase.tasklist;

import com.todo.application.exception.NotFoundException;
import com.todo.domain.models.TaskList;
import com.todo.domain.repository.TaskListRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.UUID;

@ApplicationScoped
public class DeleteTaskListUseCase {

    @Inject
    TaskListRepository taskListRepository;

    public void execute(UUID id, String userId) {
        TaskList taskList = taskListRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Lista no encontrada"));
        taskListRepository.remove(taskList.getId());
    }
}
