import axios from 'axios';
import logger from '../logging_middleware/logger';

const BASE_URL = '/api';

async function getAuthToken() {
  const cached = localStorage.getItem('auth_token');
  if (cached) return cached;

  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'ak1533@srmist.edu.in',
      name: 'ayush kumar',
      rollNo: 'ra2311042020005',
      accessCode: 'QkbpxH',
      clientID: '9d819bae-e71a-493f-a75e-7e5e667e15c5',
      clientSecret: 'KFxrtceMktaMYAgn',
    }),
  });
  const data = await res.json();
  localStorage.setItem('auth_token', data.access_token);
  return data.access_token;
}

export async function fetchNotifications() {
  const token = await getAuthToken();
  logger.info('API_REQUEST', '→ GET /notifications');
  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await res.json();
    logger.api('GET', '/notifications', res.status, Date.now() - start);
    const raw = data?.notifications ?? data ?? [];
    // Normalize capital keys → lowercase
    const notifications = raw.map(n => ({
      id: n.ID ?? n.id,
      type: n.Type ?? n.type,
      message: n.Message ?? n.message,
      timestamp: n.Timestamp ?? n.timestamp,
    }));
    logger.info('SERVICE', `Fetched ${notifications.length} notifications`);
    return notifications;
  } catch (err) {
    logger.error('API_ERROR', err.message, err);
    throw err;
  }
}