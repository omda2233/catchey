import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from '../firebaseAdmin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '..', 'logs');
const logFile = path.join(logsDir, 'activity.log');

function ensureLogDir() {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

function formatLine(level, message, data, userId) {
  return JSON.stringify({
    time: new Date().toISOString(),
    level,
    message,
    userId: userId || null,
    data: data || null
  }) + '\n';
}

async function logToFirestore(level, message, data, userId) {
  try {
    const db = admin.firestore();
    await db.collection('logs').add({
      level,
      message,
      userId: userId || null,
      data: data || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (e) {
    // fallback console but do not throw
    console.error('Logger Firestore write failed:', e);
  }
}

function logToConsole(level, message, data) {
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}`;
  if (level === 'error') console.error(line, data || '');
  else if (level === 'warn') console.warn(line, data || '');
  else console.log(line, data || '');
}

function logToFile(level, message, data, userId) {
  try {
    ensureLogDir();
    fs.appendFileSync(logFile, formatLine(level, message, data, userId));
  } catch (e) {
    // ignore file errors to avoid crashing
  }
}

async function write(level, message, data = null, userId = null) {
  logToConsole(level, message, data);
  logToFile(level, message, data, userId);
  await logToFirestore(level, message, data, userId);
}

export default {
  info: (msg, data, userId) => write('info', msg, data, userId),
  warn: (msg, data, userId) => write('warn', msg, data, userId),
  error: (msg, data, userId) => write('error', msg, data, userId),
  log: (msg, data, userId) => write('info', msg, data, userId),
};
