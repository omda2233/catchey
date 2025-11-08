import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount = null;
const primaryPath = path.join(__dirname, 'serviceAccountKey.json');
const fallbackPath = path.join(__dirname, 'catchy-fabric-market-firebase-adminsdk-fbsvc-684c43ae4f.json');

try {
  const jsonStr = fs.readFileSync(primaryPath, 'utf8');
  serviceAccount = JSON.parse(jsonStr);
} catch (_) {
  try {
    const jsonStr = fs.readFileSync(fallbackPath, 'utf8');
    serviceAccount = JSON.parse(jsonStr);
  } catch (__) {
    console.warn('Service account JSON not found. Falling back to default initialization.');
  }
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.initializeApp();
  }
}

const db = admin.firestore();
export { db };
export default admin;
