import 'dotenv/config';
import { env } from './config/env';
import { initializeApp, cert } from 'firebase-admin/app';
import app from './app';

initializeApp({
  credential: cert({
    projectId: env.firebase.projectId,
    clientEmail: env.firebase.clientEmail,
    privateKey: env.firebase.privateKey,
  }),
});

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port} [${env.nodeEnv}]`);
});
