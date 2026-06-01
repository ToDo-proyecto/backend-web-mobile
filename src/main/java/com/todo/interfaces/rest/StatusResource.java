package com.todo.interfaces.rest;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.Map;

@Path("/status")
@Produces(MediaType.APPLICATION_JSON)
public class StatusResource {

    @ConfigProperty(name = "app.name", defaultValue = "backend-web-mobile")
    String appName;

    @ConfigProperty(name = "app.version", defaultValue = "dev")
    String appVersion;

    @GET
    public Response status() {
        return Response.ok(Map.of(
                "status", "ok",
                "app", appName,
                "version", appVersion
        )).build();
    }
}
