package com.todo.infrastructure.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import io.quarkus.arc.profile.UnlessBuildProfile;
import io.quarkus.runtime.Startup;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.InputStream;

@Startup
@ApplicationScoped
@UnlessBuildProfile("test")
public class FirebaseConfig {

    @PostConstruct
    void init() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                InputStream serviceAccount = getClass().getClassLoader()
                        .getResourceAsStream("firebase-service-account.json");

                if (serviceAccount == null) {
                    throw new IllegalStateException("No se encontró firebase-service-account.json en resources");
                }

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("Firebase inicializado correctamente (medsync-1)");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
