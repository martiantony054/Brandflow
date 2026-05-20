// src/lib/api.js
// All fetch calls live here. Components never call fetch() directly.
// Vite proxies /api → Express server in dev.

const BASE = import.meta.env.VITE_API_BASE ?? '';

/**
 * Generate social media posts.
 * @param {{ platform: string, topic: string, tone: string }} params
 * @returns {Promise<{ posts: Array }>}
 */
export async function generatePosts({ platform, topic, tone }) {
  const res  = await fetch(`${BASE}/api/generate`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ platform, topic, tone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Generation failed — please try again.');
  return data;
}

/**
 * Predict performance score of a post before scheduling.
 * @param {{ content: string, platform: string, scheduledTime: string }} params
 * @returns {Promise<{ score: object }>}
 */
export async function predictPost({ content, platform, scheduledTime }) {
  const res  = await fetch(`${BASE}/api/predict`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ content, platform, scheduledTime }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Prediction failed — please try again.');
  return data;
}

/**
 * Repurpose existing content across platforms.
 * @param {{ content: string, sourcePlatform: string, tone: string }} params
 * @returns {Promise<{ repurposed: Array }>}
 */
export async function repurposeContent({ content, sourcePlatform, tone }) {
  const res  = await fetch(`${BASE}/api/repurpose`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ content, sourcePlatform, tone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Repurpose failed — please try again.');
  return data;
}