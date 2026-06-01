package com.todo.interfaces.rest;

import com.todo.application.dto.CreateTaskItemDto;
import com.todo.application.dto.UpdateTaskItemDto;
import com.todo.application.security.AuthenticatedUserContext;
import com.todo.application.usecase.taskitem.*;
import com.todo.domain.models.TaskItem;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/api/task-lists/{listId}/items")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TaskItemResource {

    @Inject
    AuthenticatedUserContext userContext;

    @Inject
    GetTaskItemsUseCase getTaskItemsUseCase;

    @Inject
    CreateTaskItemUseCase createTaskItemUseCase;

    @Inject
    UpdateTaskItemUseCase updateTaskItemUseCase;

    @Inject
    DeleteTaskItemUseCase deleteTaskItemUseCase;

    @GET
    public Response getAll(@PathParam("listId") UUID listId) {
        List<TaskItem> items = getTaskItemsUseCase.execute(listId, userContext.getUserId());
        return Response.ok(items).build();
    }

    @POST
    public Response create(@PathParam("listId") UUID listId, @Valid CreateTaskItemDto dto) {
        TaskItem created = createTaskItemUseCase.execute(listId, dto, userContext.getUserId());
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PATCH
    @Path("/{itemId}")
    public Response update(@PathParam("listId") UUID listId,
                           @PathParam("itemId") UUID itemId,
                           UpdateTaskItemDto dto) {
        TaskItem updated = updateTaskItemUseCase.execute(listId, itemId, dto, userContext.getUserId());
        return Response.ok(updated).build();
    }

    @DELETE
    @Path("/{itemId}")
    public Response delete(@PathParam("listId") UUID listId,
                           @PathParam("itemId") UUID itemId) {
        deleteTaskItemUseCase.execute(listId, itemId, userContext.getUserId());
        return Response.noContent().build();
    }
}
