

// Priority order: highest = 1 which is placement, then result, then event. Anything else is lowest priority.
const PRIORITY_MAP = {
  Placement: 1,
  Result: 2,
  Event: 3,
};


export function sortByLatest(notifications) {
  return [...notifications].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}


export function sortByPriority(notifications) {
  return [...notifications].sort((a, b) => {
    const pa = PRIORITY_MAP[a.type] ?? 99;
    const pb = PRIORITY_MAP[b.type] ?? 99;
    if (pa !== pb) return pa - pb;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
}


export function filterByType(notifications, type) {
  if (!type || type === 'All') return notifications;
  return notifications.filter((n) => n.type === type);
}

/**
 * Paginate an array client-side.
 * @param {Array} items
 * @param {number} page 1-indexed
 * @param {number} limit
 * @returns {{ items: Array, totalPages: number, total: number }}
 */
export function paginate(items, page, limit) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    totalPages,
    total,
    currentPage: safePage,
  };
}


export function formatTimestamp(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  if (isNaN(d)) return ts;
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}



const SEEN_KEY = 'campus_seen_ids';

export function getSeenIds() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function markAsSeen(ids) {
  try {
    const existing = getSeenIds();
    ids.forEach((id) => existing.add(String(id)));
    localStorage.setItem(SEEN_KEY, JSON.stringify([...existing]));
  } catch {
    // ignore
  }
}

export function clearSeenIds() {
  localStorage.removeItem(SEEN_KEY);
}
