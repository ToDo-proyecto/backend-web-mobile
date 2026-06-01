package com.todo.application.usecase.tasklist;

import com.todo.application.dto.TaskListResponse;
import com.todo.application.dto.UpdateTaskListDto;
import com.todo.application.exception.NotFoundException;
import com.todo.domain.models.TaskList;
import com.todo.domain.repository.TaskListRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class UpdateTaskListUseCase {

    @Inject
    TaskListRepository taskListRepository;

    public TaskListResponse execute(UUID id, UpdateTaskListDto dto, String userId) {
        TaskList taskList = taskListRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Lista no encontrada"));

        if (dto.title != null) taskList.setTitle(dto.title);
        if (dto.subtitle != null) taskList.setSubtitle(dto.subtitle);
        if (dto.color != null) taskList.setColor(dto.color);
        if (dto.icon != null) taskList.setIcon(dto.icon);
        if (dto.tags != null) taskList.setTags(dto.tags);
        taskList.setUpdatedAt(LocalDateTime.now());

        TaskList updated = taskListRepository.save(taskList);
        return TaskListResponse.from(updated);
    }
}
