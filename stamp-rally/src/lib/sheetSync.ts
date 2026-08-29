import type { Registration } from '../types';

const WEBHOOK_URL = import.meta.env.VITE_SHEET_WEBHOOK_URL as string | undefined;

// Fire-and-forget: registration must still work offline / without this being
// configured, so failures here are swallowed rather than surfaced to the user.
export function syncRegistrationToSheet(registration: Registration) {
  if (!WEBHOOK_URL) {
    if (import.meta.env.DEV) {
      console.info(
        '[sheetSync] VITE_SHEET_WEBHOOK_URL is not set — skipping spreadsheet sync. See stamp-rally/README-sheet-sync.md.',
      );
    }
    return;
  }

  const payload = {
    nickname: registration.nickname,
    gender: registration.gender,
    ageGroup: registration.ageGroup,
    timestamp: new Date().toISOString(),
  };

  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    // text/plain avoids a CORS preflight (OPTIONS) request, which Google Apps
    // Script web apps don't handle; the body is still valid JSON text and
    // e.postData.contents on the Apps Script side parses it fine.
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  }).catch((err) => {
    if (import.meta.env.DEV) {
      console.warn('[sheetSync] failed to sync registration', err);
    }
  });
}
