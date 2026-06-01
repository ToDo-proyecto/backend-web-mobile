package com.todo.infrastructure.persistence.repository;

import com.todo.domain.models.TaskItem;
import com.todo.domain.repository.TaskItemRepository;
import com.todo.infrastructure.mapper.TaskItemMapper;
import com.todo.infrastructure.persistence.entity.TaskItemEntity;
import com.todo.infrastructure.persistence.entity.TaskListEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class TaskItemRepositoryImpl implements TaskItemRepository, PanacheRepositoryBase<TaskItemEntity, UUID> {

    @Override
    public List<TaskItem> findByListId(UUID listId) {
        return find("list.id = ?1 ORDER BY createdAt DESC", listId)
                .stream()
                .map(TaskItemMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TaskItem> findByIdAndListId(UUID itemId, UUID listId) {
        return find("id = ?1 AND list.id = ?2", itemId, listId)
                .firstResultOptional()
                .map(TaskItemMapper::toDomain);
    }

    @Override
    @Transactional
    public TaskItem save(TaskItem taskItem) {
        Optional<TaskItemEntity> existing = findByIdOptional(taskItem.getId());
        if (existing.isPresent()) {
            TaskItemEntity entity = existing.get();
            entity.setTitle(taskItem.getTitle());
            entity.setDescription(taskItem.getDescription());
            entity.setCompleted(taskItem.isCompleted());
            entity.setPriority(taskItem.getPriority());
            entity.setDueDate(taskItem.getDueDate());
            entity.setUpdatedAt(taskItem.getUpdatedAt());
            return TaskItemMapper.toDomain(entity);
        } else {
            TaskListEntity listRef = new TaskListEntity();
            listRef.setId(taskItem.getListId());
            TaskItemEntity entity = TaskItemMapper.toEntity(taskItem, listRef);
            persist(entity);
            return TaskItemMapper.toDomain(entity);
        }
    }

    @Override
    @Transactional
    public void remove(UUID id) {
        findByIdOptional(id).ifPresent(this::delete);
    }
}
