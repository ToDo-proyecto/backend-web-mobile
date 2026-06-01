package com.todo.application.usecase.tasklist;

import com.todo.application.dto.CreateTaskListDto;
import com.todo.application.dto.TaskListResponse;
import com.todo.domain.models.TaskList;
import com.todo.domain.repository.TaskListRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class CreateTaskListUseCase {

    @Inject
    TaskListRepository taskListRepository;

    public TaskListResponse execute(CreateTaskListDto dto, String userId) {
        TaskList taskList = new TaskList();
        taskList.setId(UUID.randomUUID());
        taskList.setUserId(userId);
        taskList.setTitle(dto.title);
        taskList.setSubtitle(dto.subtitle != null ? dto.subtitle : "");
        taskList.setColor(dto.color != null ? dto.color : "#3B82F6");
        taskList.setIcon(dto.icon != null ? dto.icon : "list");
        taskList.setTags(dto.tags != null ? dto.tags : java.util.Collections.emptyList());
        taskList.setCreatedAt(LocalDateTime.now());
        taskList.setUpdatedAt(LocalDateTime.now());

        TaskList saved = taskListRepository.save(taskList);
        return TaskListResponse.from(saved);
    }
}
