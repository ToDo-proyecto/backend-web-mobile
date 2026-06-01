package com.todo.infrastructure.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.todo.application.security.AuthenticatedUserContext;
import com.todo.application.security.CurrentUser;
import io.quarkus.arc.profile.UnlessBuildProfile;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import java.io.IOException;
import java.util.List;

@Provider
@Priority(Priorities.AUTHENTICATION)
@UnlessBuildProfile("test")
public class FirebaseAuthFilter implements ContainerRequestFilter {

    @Inject
    AuthenticatedUserContext authenticatedUserContext;

    private static final List<String> PUBLIC_PATHS = List.of("/health", "health", "/status", "status");

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String path = requestContext.getUriInfo().getPath();
        if (PUBLIC_PATHS.contains(path)) {
            return;
        }

        String authHeader = requestContext.getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
            return;
        }

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance()
                    .verifyIdToken(authHeader.replace("Bearer ", ""));
            authenticatedUserContext.setCurrentUser(new CurrentUser(decodedToken.getUid()));
        } catch (Exception e) {
            System.err.println("[FirebaseAuthFilter] Token verification failed: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
        }
    }
}
