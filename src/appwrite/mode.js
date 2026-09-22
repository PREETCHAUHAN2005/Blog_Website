import conf from "../conf/conf.js";

let mode = null;
let reason = "";
let pending = null;
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

export function getModeState() {
  return { mode, reason };
}

export function subscribeMode(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

async function detect() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(
      `${conf.appwriteUrl}/databases/${conf.appwriteDatabaseId}/collections/${conf.appwriteCollectionId}`,
      {
        headers: { "X-Appwrite-Project": conf.appwriteProjectId },
        signal: controller.signal,
      }
    );
    const data = await response.json().catch(() => ({}));
    if (data?.type === "project_paused") {
      mode = "local";
      reason =
        "Appwrite is paused, so accounts and posts are saved in this browser. Restore the project in the Appwrite console to use the cloud API again.";
    } else {
      mode = "cloud";
      reason = "";
    }
  } catch {
    mode = "local";
    reason =
      "Appwrite could not be reached, so accounts and posts are saved in this browser.";
  } finally {
    clearTimeout(timer);
  }
  emit();
  return mode;
}

export function resolveMode() {
  if (mode) return Promise.resolve(mode);
  if (!pending) {
    pending = detect().finally(() => {
      pending = null;
    });
  }
  return pending;
}
