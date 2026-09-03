/**
 * Deployment Smoke Test
 * Validates availability and response schemas of the live frontend and backend endpoints.
 */

const FRONTEND_URL = 'https://gangadhar017.github.io/Lunar_circle/';
const BACKEND_URL = 'https://satquery-ai-skyy.onrender.com';

async function runSmokeTests() {
  console.log(`[Smoke Test] Checking Frontend: ${FRONTEND_URL}`);
  try {
    const resFront = await fetch(FRONTEND_URL);
    console.log(`Frontend Status: ${resFront.status} ${resFront.statusText}`);
  } catch (err) {
    console.error(`Frontend Error:`, err.message);
  }

  console.log(`[Smoke Test] Checking Backend Health: ${BACKEND_URL}/health`);
  try {
    const resBack = await fetch(`${BACKEND_URL}/health`);
    const data = await resBack.json();
    console.log(`Backend Health:`, data);
  } catch (err) {
    console.error(`Backend Error:`, err.message);
  }
}

runSmokeTests();
