package com.todo.infrastructure.persistence.repository;

import com.todo.domain.models.TaskList;
import com.todo.domain.repository.TaskListRepository;
import com.todo.infrastructure.mapper.TaskListMapper;
import com.todo.infrastructure.persistence.entity.TaskListEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class TaskListRepositoryImpl implements TaskListRepository, PanacheRepositoryBase<TaskListEntity, UUID> {

    @Override
    public List<TaskList> findByUserId(String userId) {
        return find("userId = ?1 ORDER BY createdAt DESC", userId)
                .stream()
                .map(TaskListMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TaskList> findByIdAndUserId(UUID id, String userId) {
        return find("id = ?1 AND userId = ?2", id, userId)
                .firstResultOptional()
                .map(TaskListMapper::toDomain);
    }

    @Override
    @Transactional
    public TaskList save(TaskList taskList) {
        Optional<TaskListEntity> existing = findByIdOptional(taskList.getId());
        if (existing.isPresent()) {
            TaskListEntity entity = existing.get();
            entity.setTitle(taskList.getTitle());
            entity.setSubtitle(taskList.getSubtitle());
            entity.setColor(taskList.getColor());
            entity.setIcon(taskList.getIcon());
            entity.setTags(serializeTags(taskList));
            entity.setUpdatedAt(taskList.getUpdatedAt());
            return TaskListMapper.toDomain(entity);
        } else {
            TaskListEntity entity = TaskListMapper.toEntity(taskList);
            persist(entity);
            return TaskListMapper.toDomain(entity);
        }
    }

    @Override
    @Transactional
    public void remove(UUID id) {
        findByIdOptional(id).ifPresent(this::delete);
    }

    private String serializeTags(TaskList taskList) {
        if (taskList.getTags() == null || taskList.getTags().isEmpty()) return "[]";
        try {
            jakarta.json.bind.Jsonb jsonb = jakarta.json.bind.JsonbBuilder.create();
            return jsonb.toJson(taskList.getTags());
        } catch (Exception e) {
            return "[]";
        }
    }
}
