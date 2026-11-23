// Descriptions are typed into the admin panel as one block of text with • or ✅
// in front of each point. Splits them into an intro and a list of points.
export const parsePoints = (text) => {
  const [first = '', ...rest] = (text || '')
    .split(/[•✅]/)
    .map(part => part.replace(/\s+/g, ' ').trim());

  // Single words between bullets are tags, which are shown separately.
  const points = rest.filter(part => part.includes(' '));
  const intro = points.length === 0 || first.includes(' ') ? first : '';
  return { intro, points };
};

// "MoverGPT –AI Chatbot" -> "MoverGPT – AI Chatbot"
export const tidyTitle = (title) => (title || '').replace(/\s*–\s*/g, ' – ');

// Dates from date fields are stored as midnight UTC, so they must be shown in UTC too.
export const monthYear = (date) => (date
  ? new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
  : '');

export const period = (start, end, current = !end) => {
  const until = end ? monthYear(end) : (current && 'now');
  if (!start) return current ? 'Current' : monthYear(end);
  return until ? `${monthYear(start)} to ${until}` : `From ${monthYear(start)}`;
};

// One short line for a card: the intro, or else the first point.
export const summaryOf = (text) => {
  const { intro, points } = parsePoints(text);
  return intro || points[0] || '';
};

// "Voice AI, RAG pipelines and secure APIs" -> ['voice AI', 'RAG pipelines', 'secure APIs']
export const listOf = (text) => (text || '')
  .split(/,\s*|\s+and\s+/)
  .map(item => item.trim().replace(/^[A-Z](?=[a-z])/, letter => letter.toLowerCase()))
  .filter(Boolean);
