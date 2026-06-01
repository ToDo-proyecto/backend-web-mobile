package com.todo.application.security;

import jakarta.enterprise.context.RequestScoped;

@RequestScoped
public class AuthenticatedUserContext {
    private CurrentUser currentUser;

    public void setCurrentUser(CurrentUser currentUser) {
        this.currentUser = currentUser;
    }

    public CurrentUser getCurrentUser() {
        return currentUser;
    }

    public String getUserId() {
        return currentUser != null ? currentUser.getUserId() : null;
    }
}
