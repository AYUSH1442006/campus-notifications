

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  ACTION: 'ACTION',
  API: 'API',
};

const MAX_LOGS = 500; // prevent localStorage bloat

function getTimestamp() {
  return new Date().toISOString();
}

function formatEntry(level, category, message, data = null) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: getTimestamp(),
    level,
    category,
    message,
    data,
  };
}

function persist(entry) {
  try {
    const raw = localStorage.getItem('campus_logs');
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift(entry); // latest first
    if (logs.length > MAX_LOGS) logs.splice(MAX_LOGS);
    localStorage.setItem('campus_logs', JSON.stringify(logs));
  } catch {
    // silently fail if localStorage is full
  }
}

function output(entry) {
  const prefix = `[${entry.timestamp}] [${entry.level}] [${entry.category}]`;
  const style =
    entry.level === LOG_LEVELS.ERROR
      ? 'color: #f44336; font-weight: bold;'
      : entry.level === LOG_LEVELS.WARN
      ? 'color: #ff9800;'
      : entry.level === LOG_LEVELS.ACTION
      ? 'color: #2196f3;'
      : entry.level === LOG_LEVELS.API
      ? 'color: #4caf50;'
      : 'color: #9e9e9e;';

  // Use groupCollapsed to keep devtools clean
  // eslint-disable-next-line no-console
  console.groupCollapsed(`%c${prefix} ${entry.message}`, style);
  if (entry.data) {
    // eslint-disable-next-line no-console
    console.dir(entry.data);
  }
  // eslint-disable-next-line no-console
  console.groupEnd();

  persist(entry);
}

const logger = {
  /**
   * Log informational messages
   */
  info(category, message, data) {
    output(formatEntry(LOG_LEVELS.INFO, category, message, data));
  },

  /**
   * Log warnings
   */
  warn(category, message, data) {
    output(formatEntry(LOG_LEVELS.WARN, category, message, data));
  },

  /**
   * Log errors with stack traces
   */
  error(category, message, error) {
    const data = error
      ? {
          message: error.message,
          stack: error.stack,
          response: error.response
            ? {
                status: error.response.status,
                data: error.response.data,
              }
            : undefined,
        }
      : null;
    output(formatEntry(LOG_LEVELS.ERROR, category, message, data));
  },

  /**
   * Log API calls (request + response metadata)
   */
  api(method, url, statusOrError, durationMs) {
    const message = `${method.toUpperCase()} ${url} → ${statusOrError} (${durationMs}ms)`;
    output(formatEntry(LOG_LEVELS.API, 'API', message, { method, url, statusOrError, durationMs }));
  },

  /**
   * Log user actions (clicks, navigation, filters, etc.)
   */
  action(action, detail) {
    output(formatEntry(LOG_LEVELS.ACTION, 'USER_ACTION', action, detail));
  },

  /**
   * Retrieve all stored logs from localStorage
   */
  getLogs() {
    try {
      const raw = localStorage.getItem('campus_logs');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Clear stored logs
   */
  clearLogs() {
    localStorage.removeItem('campus_logs');
  },
};

export default logger;
