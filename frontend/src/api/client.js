const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export async function fetchJobs(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });

  const res = await fetch(`${BASE_URL}/jobs?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function fetchJobById(id) {
  const res = await fetch(`${BASE_URL}/jobs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch job details');
  return res.json();
}

export async function updateApplicationStatus(jobId, data) {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function removeApplicationStatus(jobId) {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply-status`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove status');
  return res.json();
}

export async function fetchApplications() {
  const res = await fetch(`${BASE_URL}/applications`);
  if (!res.ok) throw new Error('Failed to fetch tracked applications');
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch statistics');
  return res.json();
}

export async function triggerSync() {
  const res = await fetch(`${BASE_URL}/sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to trigger job sync');
  return res.json();
}

export async function fetchSyncLogs() {
  const res = await fetch(`${BASE_URL}/sync/logs`);
  if (!res.ok) throw new Error('Failed to fetch sync logs');
  return res.json();
}

export async function evaluateEligibility(payload) {
  const res = await fetch(`${BASE_URL}/ai/evaluate-eligibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to evaluate eligibility');
  return res.json();
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/ai/parse-resume`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to parse resume');
  }
  return res.json();
}

export async function analyzeJobPdf(jobId) {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/analyze-pdf`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to analyze notification PDF');
  return res.json();
}

export function getCalendarIcsUrl(jobId) {
  return `${BASE_URL}/jobs/${jobId}/calendar.ics`;
}

export function getApplicationsCsvUrl() {
  return `${BASE_URL}/applications/export.csv`;
}

export async function fetchSettings() {
  const res = await fetch(`${BASE_URL}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettings(data) {
  const res = await fetch(`${BASE_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

export async function testTelegram() {
  const res = await fetch(`${BASE_URL}/settings/test-telegram`, { method: 'POST' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to send test message');
  }
  return res.json();
}

export async function autoDetectChatId() {
  const res = await fetch(`${BASE_URL}/settings/auto-detect-chat-id`, { method: 'POST' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to auto-detect chat ID');
  }
  return res.json();
}

export async function fetchGovPresets() {
  const res = await fetch(`${BASE_URL}/tools/presets`);
  if (!res.ok) throw new Error('Failed to fetch presets');
  return res.json();
}

export async function resizeGovImage(file, preset) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/tools/resize-gov-image?preset=${preset}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Image resize failed');
  }

  const blob = await res.blob();
  const headers = {
    sizeKb: res.headers.get('X-GovDoc-Size-KB'),
    dimensions: res.headers.get('X-GovDoc-Dimensions'),
    compliant: res.headers.get('X-GovDoc-Compliant') === 'True',
    presetName: res.headers.get('X-GovDoc-Preset'),
  };
  return { blob, headers };
}

export async function previewMorningDigest() {
  const res = await fetch(`${BASE_URL}/notifications/preview-digest`);
  if (!res.ok) throw new Error('Failed to preview digest');
  return res.json();
}

export async function sendMorningDigest() {
  const res = await fetch(`${BASE_URL}/notifications/send-digest`, { method: 'POST' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to send digest');
  }
  return res.json();
}
