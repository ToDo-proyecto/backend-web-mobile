package com.todo.interfaces.rest;

import com.todo.application.dto.CreateTaskListDto;
import com.todo.application.dto.TaskListResponse;
import com.todo.application.dto.UpdateTaskListDto;
import com.todo.application.security.AuthenticatedUserContext;
import com.todo.application.usecase.tasklist.*;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/api/task-lists")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TaskListResource {

    @Inject
    AuthenticatedUserContext userContext;

    @Inject
    GetTaskListsUseCase getTaskListsUseCase;

    @Inject
    GetTaskListByIdUseCase getTaskListByIdUseCase;

    @Inject
    CreateTaskListUseCase createTaskListUseCase;

    @Inject
    UpdateTaskListUseCase updateTaskListUseCase;

    @Inject
    DeleteTaskListUseCase deleteTaskListUseCase;

    @GET
    public Response getAll() {
        List<TaskListResponse> lists = getTaskListsUseCase.execute(userContext.getUserId());
        return Response.ok(lists).build();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") UUID id) {
        TaskListResponse list = getTaskListByIdUseCase.execute(id, userContext.getUserId());
        return Response.ok(list).build();
    }

    @POST
    public Response create(@Valid CreateTaskListDto dto) {
        TaskListResponse created = createTaskListUseCase.execute(dto, userContext.getUserId());
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") UUID id, UpdateTaskListDto dto) {
        TaskListResponse updated = updateTaskListUseCase.execute(id, dto, userContext.getUserId());
        return Response.ok(updated).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") UUID id) {
        deleteTaskListUseCase.execute(id, userContext.getUserId());
        return Response.noContent().build();
    }
}
