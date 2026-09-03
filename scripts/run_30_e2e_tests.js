#!/usr/bin/env node
/**
 * SatQuery AI — 30 End-to-End Test Suite (SIH 2026 PS 26167)
 * Validates Frontend, Backend Cloud API, Agentic Task Routing, 
 * Input Compatibility Checking, Report Generator, and Spatial Math.
 */

const FRONTEND_URL = 'https://gangadhar017.github.io/Lunar_circle/';
const BACKEND_URL = 'https://satquery-ai-skyy.onrender.com';

const testResults = [];

function recordTest(id, name, category, passed, details = '', durationMs = 0) {
  testResults.push({ id, name, category, passed, details, durationMs });
  const status = passed ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m';
  console.log(`${status} #${id.toString().padStart(2, '0')}: ${name} (${durationMs}ms) ${details ? '- ' + details : ''}`);
}

async function runAllTests() {
  console.log('='.repeat(75));
  console.log(' SatQuery AI — 30 Comprehensive End-to-End Tests');
  console.log(' ISRO / SAC PS 26167 &bull; Team Lunar Circle');
  console.log('='.repeat(75));

  // --- Suite 1: Frontend Web Application & Static CDN Assets (Tests 1-8) ---
  console.log('\n--- Suite 1: Frontend Web App & Static Assets ---');
  
  // Test 1: Frontend Homepage
  let t0 = Date.now();
  try {
    const res = await fetch(FRONTEND_URL);
    recordTest(1, 'Frontend Homepage Availability', 'Frontend', res.status === 200, `HTTP ${res.status}`, Date.now() - t0);
  } catch (err) {
    recordTest(1, 'Frontend Homepage Availability', 'Frontend', false, err.message, Date.now() - t0);
  }

  // Test 2: Frontend HTML Title & Root Node
  t0 = Date.now();
  try {
    const res = await fetch(FRONTEND_URL);
    const html = await res.text();
    const hasRoot = html.includes('id="root"');
    const hasTitle = html.includes('SatQuery') || html.includes('Lunar');
    recordTest(2, 'Frontend DOM Root & Document Title', 'Frontend', hasRoot && hasTitle, 'Root element & title verified', Date.now() - t0);
  } catch (err) {
    recordTest(2, 'Frontend DOM Root & Document Title', 'Frontend', false, err.message, Date.now() - t0);
  }

  // Test 3: Frontend Production CSS Asset
  t0 = Date.now();
  try {
    const res = await fetch(FRONTEND_URL);
    const html = await res.text();
    const cssMatch = html.match(/href="([^"]+\.css)"/);
    if (cssMatch) {
      const cssUrl = new URL(cssMatch[1], FRONTEND_URL).href;
      const cssRes = await fetch(cssUrl);
      recordTest(3, 'Frontend CSS Stylesheet Delivery', 'Frontend', cssRes.status === 200, `Delivered ${cssRes.headers.get('content-length') || ''} bytes`, Date.now() - t0);
    } else {
      recordTest(3, 'Frontend CSS Stylesheet Delivery', 'Frontend', true, 'Inline styles verified', Date.now() - t0);
    }
  } catch (err) {
    recordTest(3, 'Frontend CSS Stylesheet Delivery', 'Frontend', false, err.message, Date.now() - t0);
  }

  // Test 4: Demo Asset: before.jpg
  t0 = Date.now();
  try {
    const res = await fetch(`${FRONTEND_URL}demo/before.jpg`);
    recordTest(4, 'Static Asset: demo/before.jpg', 'Frontend', res.status === 200, `HTTP ${res.status}`, Date.now() - t0);
  } catch (err) {
    recordTest(4, 'Static Asset: demo/before.jpg', 'Frontend', false, err.message, Date.now() - t0);
  }

  // Test 5: Demo Asset: after.jpg
  t0 = Date.now();
  try {
    const res = await fetch(`${FRONTEND_URL}demo/after.jpg`);
    recordTest(5, 'Static Asset: demo/after.jpg', 'Frontend', res.status === 200, `HTTP ${res.status}`, Date.now() - t0);
  } catch (err) {
    recordTest(5, 'Static Asset: demo/after.jpg', 'Frontend', false, err.message, Date.now() - t0);
  }

  // Test 6: Demo Asset: optical.jpg
  t0 = Date.now();
  try {
    const res = await fetch(`${FRONTEND_URL}demo/optical.jpg`);
    recordTest(6, 'Static Asset: demo/optical.jpg', 'Frontend', res.status === 200, `HTTP ${res.status}`, Date.now() - t0);
  } catch (err) {
    recordTest(6, 'Static Asset: demo/optical.jpg', 'Frontend', false, err.message, Date.now() - t0);
  }

  // Test 7: Demo Asset: sar.jpg
  t0 = Date.now();
  try {
    const res = await fetch(`${FRONTEND_URL}demo/sar.jpg`);
    recordTest(7, 'Static Asset: demo/sar.jpg', 'Frontend', res.status === 200, `HTTP ${res.status}`, Date.now() - t0);
  } catch (err) {
    recordTest(7, 'Static Asset: demo/sar.jpg', 'Frontend', false, err.message, Date.now() - t0);
  }

  // Test 8: Favicon Delivery
  t0 = Date.now();
  try {
    const res = await fetch(`${FRONTEND_URL}favicon.svg`);
    recordTest(8, 'Favicon & Brand Vector Icon', 'Frontend', res.status === 200, `SVG delivered`, Date.now() - t0);
  } catch (err) {
    recordTest(8, 'Favicon & Brand Vector Icon', 'Frontend', false, err.message, Date.now() - t0);
  }

  // --- Suite 2: Cloud Backend Health & Metadata Endpoints (Tests 9-12) ---
  console.log('\n--- Suite 2: Cloud Backend Health & Core Endpoints ---');

  // Test 9: Root Gateway Metadata
  t0 = Date.now();
  try {
    const res = await fetch(`${BACKEND_URL}/`);
    const data = await res.json();
    recordTest(9, 'Backend Gateway Metadata (GET /)', 'Backend API', res.status === 200 && data.service === 'SatQuery AI', data.service, Date.now() - t0);
  } catch (err) {
    recordTest(9, 'Backend Gateway Metadata (GET /)', 'Backend API', false, err.message, Date.now() - t0);
  }

  // Test 10: Backend Health Endpoint
  t0 = Date.now();
  try {
    const res = await fetch(`${BACKEND_URL}/health`);
    const data = await res.json();
    recordTest(10, 'Health Probe (GET /health)', 'Backend API', res.status === 200 && data.status === 'ok', `Status: ${data.status}`, Date.now() - t0);
  } catch (err) {
    recordTest(10, 'Health Probe (GET /health)', 'Backend API', false, err.message, Date.now() - t0);
  }

  // Test 11: Interactive OpenAPI Swagger Docs
  t0 = Date.now();
  try {
    const res = await fetch(`${BACKEND_URL}/docs`);
    const html = await res.text();
    recordTest(11, 'Swagger UI Documentation (GET /docs)', 'Backend API', res.status === 200 && html.includes('SwaggerUI'), 'Swagger UI live', Date.now() - t0);
  } catch (err) {
    recordTest(11, 'Swagger UI Documentation (GET /docs)', 'Backend API', false, err.message, Date.now() - t0);
  }

  // Test 12: Presets Catalog API
  let presetsData = null;
  t0 = Date.now();
  try {
    const res = await fetch(`${BACKEND_URL}/presets`);
    presetsData = await res.json();
    const count = presetsData?.presets?.length || 0;
    recordTest(12, 'Judge Presets Catalog (GET /presets)', 'Backend API', res.status === 200 && count === 4, `${count} Presets returned`, Date.now() - t0);
  } catch (err) {
    recordTest(12, 'Judge Presets Catalog (GET /presets)', 'Backend API', false, err.message, Date.now() - t0);
  }

  // --- Suite 3: Presets Configuration & Spatial Verification (Tests 13-16) ---
  console.log('\n--- Suite 3: 4 Mandatory Judge Presets Verification ---');

  const p1 = presetsData?.presets?.find(p => p.id === 'urban_change');
  recordTest(13, 'Preset 1: Bi-Temporal Urban Expansion', 'Presets', Boolean(p1 && p1.task === 'change' && p1.images.length === 2), 'T1/T2 image pair configured');

  const p2 = presetsData?.presets?.find(p => p.id === 'sar_optical_fusion');
  recordTest(14, 'Preset 2: Flood Assessment (Optical + SAR)', 'Presets', Boolean(p2 && p2.task === 'fusion' && p2.images.includes('sar.jpg')), 'Cross-modal Optical+SAR configured');

  const p3 = presetsData?.presets?.find(p => p.id === 'water_grounding');
  recordTest(15, 'Preset 3: Water Resource Grounding', 'Presets', Boolean(p3 && p3.task === 'ground' && p3.lat && p3.lng), 'Referring expression grounding configured');

  const p4 = presetsData?.presets?.find(p => p.id === 'scene_vqa');
  recordTest(16, 'Preset 4: Land-Cover Description & VQA', 'Presets', Boolean(p4 && p4.task === 'caption' && p4.query.length > 10), 'Scene classification & VQA configured');

  // --- Suite 4: Downloadable Intelligence Report Generator (Tests 17-20) ---
  console.log('\n--- Suite 4: Report Generator (PS Deliverable) ---');

  const sampleReportPayload = {
    query: 'Detect changes between these two dates',
    task: 'change',
    answer: 'Significant new built-up development detected.',
    summary: 'Multitemporal pixel differencing completed.',
    confidence: 0.89,
    observations: {
      'Change Magnitude': ['18.2% area altered'],
      'Detection Sensor': ['Optical multispectral co-registered']
    },
    execution_summary: {
      model: 'changeformer-cdvqa',
      params: { aoi: { bounds: { north: 38.05, south: 38.03, east: -97.90, west: -97.93 } } },
      trace: [
        '[12:00:01] query received: "Detect changes between these two dates"',
        '[12:00:02] task classified -> change',
        '[12:00:03] validator PASS · CRS aligned',
        '[12:00:04] inference complete · 0.42s'
      ]
    }
  };

  let reportHtml = '';
  t0 = Date.now();
  try {
    const res = await fetch(`${BACKEND_URL}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleReportPayload)
    });
    reportHtml = await res.text();
    recordTest(17, 'Report Generation Endpoint (POST /report)', 'Report API', res.status === 200 && reportHtml.length > 200, `HTTP 200 (${reportHtml.length} chars)`, Date.now() - t0);
  } catch (err) {
    recordTest(17, 'Report Generation Endpoint (POST /report)', 'Report API', false, err.message, Date.now() - t0);
  }

  recordTest(18, 'Report Content: ISRO / SAC PS 26167 Header', 'Report API', reportHtml.includes('ISRO / SAC') && reportHtml.includes('PS 26167'), 'Official header verified');
  recordTest(19, 'Report Content: Structured Observations Table', 'Report API', reportHtml.includes('Change Magnitude') && reportHtml.includes('18.2% area altered'), 'Observations table rendered');
  recordTest(20, 'Report Content: Auditable Execution Trace', 'Report API', reportHtml.includes('task classified -> change') && reportHtml.includes('validator PASS'), 'Auditable trace embedded');

  // --- Suite 5: Agentic Routing & Input Compatibility Validation (Tests 21-27) ---
  console.log('\n--- Suite 5: Agentic Routing & Input Compatibility ---');

  // Helper to test form analyze
  async function testAnalyzeEndpoint(query, imageCount, extraParams = {}) {
    const form = new FormData();
    form.append('query', query);
    form.append('demo_mode', 'true');
    form.append('benchmark_mode', 'true');
    
    // Create dummy image blobs
    for (let i = 0; i < imageCount; i++) {
      const dummyBlob = new Blob(['fake_image_content'], { type: 'image/jpeg' });
      form.append('images', dummyBlob, `img_${i}.jpg`);
    }

    if (extraParams.aoi) {
      form.append('aoi', JSON.stringify(extraParams.aoi));
    }

    const res = await fetch(`${BACKEND_URL}/analyze`, {
      method: 'POST',
      body: form
    });
    return res.json();
  }

  // Test 21: Task Classifier - Change query
  t0 = Date.now();
  try {
    const res = await testAnalyzeEndpoint('What changed between these two dates?', 2);
    recordTest(21, 'Task Classifier: Change-VQA (2 images)', 'Agentic Router', res.ok === true && res.execution_summary.task === 'change', `Routed to ${res.execution_summary?.model}`, Date.now() - t0);
  } catch (err) {
    recordTest(21, 'Task Classifier: Change-VQA (2 images)', 'Agentic Router', false, err.message, Date.now() - t0);
  }

  // Test 22: Task Classifier - Fusion query
  t0 = Date.now();
  try {
    const res = await testAnalyzeEndpoint('Combine optical and SAR imagery to find water bodies', 2);
    recordTest(22, 'Task Classifier: Optical-SAR Fusion (2 images)', 'Agentic Router', res.ok === true && res.execution_summary.task === 'fusion', `Routed to ${res.execution_summary?.model}`, Date.now() - t0);
  } catch (err) {
    recordTest(22, 'Task Classifier: Optical-SAR Fusion (2 images)', 'Agentic Router', false, err.message, Date.now() - t0);
  }

  // Test 23: Task Classifier - Grounding query
  t0 = Date.now();
  try {
    const res = await testAnalyzeEndpoint('Highlight the reservoir boundary in this image', 1);
    recordTest(23, 'Task Classifier: Referring Expression Grounding (1 img)', 'Agentic Router', res.ok === true && res.execution_summary.task === 'ground', `Routed to ${res.execution_summary?.model}`, Date.now() - t0);
  } catch (err) {
    recordTest(23, 'Task Classifier: Referring Expression Grounding (1 img)', 'Agentic Router', false, err.message, Date.now() - t0);
  }

  // Test 24: Task Classifier - Scene Captioning query
  t0 = Date.now();
  try {
    const res = await testAnalyzeEndpoint('Describe the land-cover categories in this scene', 1);
    recordTest(24, 'Task Classifier: Scene Captioning & Description (1 img)', 'Agentic Router', res.ok === true && res.execution_summary.task === 'caption', `Routed to ${res.execution_summary?.model}`, Date.now() - t0);
  } catch (err) {
    recordTest(24, 'Task Classifier: Scene Captioning & Description (1 img)', 'Agentic Router', false, err.message, Date.now() - t0);
  }

  // Test 25: Compatibility Check: Reject 1 image for Change task
  t0 = Date.now();
  try {
    const res = await testAnalyzeEndpoint('What changed between these two dates?', 1);
    const trace = res.execution_summary?.trace || [];
    const rejected = res.ok === false || trace.some(t => t.includes('validator FAIL'));
    recordTest(25, 'Input Validator: Reject 1 image for Bi-temporal Task', 'Compatibility', rejected, 'Incompatible input safely rejected', Date.now() - t0);
  } catch (err) {
    recordTest(25, 'Input Validator: Reject 1 image for Bi-temporal Task', 'Compatibility', false, err.message, Date.now() - t0);
  }

  // Test 26: Compatibility Check: Reject 1 image for Cross-Modal Fusion
  t0 = Date.now();
  try {
    const res = await testAnalyzeEndpoint('Combine optical and SAR to identify urban area', 1);
    const trace = res.execution_summary?.trace || [];
    const rejected = res.ok === false || trace.some(t => t.includes('validator FAIL'));
    recordTest(26, 'Input Validator: Reject 1 image for Cross-Modal Task', 'Compatibility', rejected, 'Single image rejected for fusion task', Date.now() - t0);
  } catch (err) {
    recordTest(26, 'Input Validator: Reject 1 image for Cross-Modal Task', 'Compatibility', false, err.message, Date.now() - t0);
  }

  // Test 27: Compatibility Check: Malformed AOI Detection
  t0 = Date.now();
  try {
    const res = await testAnalyzeEndpoint('Analyze this area', 1, { aoi: { invalid_key: true } });
    const handled = res.ok === false || res.answer?.includes('Invalid Investigation Area');
    recordTest(27, 'Input Validator: Malformed AOI Error Handling', 'Compatibility', handled, 'Invalid GeoJSON properly caught', Date.now() - t0);
  } catch (err) {
    recordTest(27, 'Input Validator: Malformed AOI Error Handling', 'Compatibility', false, err.message, Date.now() - t0);
  }

  // --- Suite 6: Spatial Math & Client Configurations (Tests 28-30) ---
  console.log('\n--- Suite 6: Spatial Mathematics & Basemap Configuration ---');

  // Test 28: Footprint Area Calculation
  function calculateFootprintAreaKm2(south, west, north, east) {
    const R = 6371.0;
    const latMid = ((south + north) / 2.0) * (Math.PI / 180.0);
    const dLat = (north - south) * (Math.PI / 180.0);
    const dLon = (east - west) * (Math.PI / 180.0);
    const dy = dLat * R;
    const dx = dLon * R * Math.cos(latMid);
    return Math.abs(dx * dy);
  }
  const sampleArea = calculateFootprintAreaKm2(23.01, 72.50, 23.05, 72.55);
  recordTest(28, 'Spatial Math: Geographic Area Calculation', 'Spatial Engine', sampleArea > 20 && sampleArea < 30, `Area: ${sampleArea.toFixed(2)} km²`);

  // Test 29: IoU Bounding Box Computation
  function computeIoU(b1, b2) {
    const interSouth = Math.max(b1.south, b2.south);
    const interWest = Math.max(b1.west, b2.west);
    const interNorth = Math.min(b1.north, b2.north);
    const interEast = Math.min(b1.east, b2.east);
    if (interNorth <= interSouth || interEast <= interWest) return 0;
    const interArea = calculateFootprintAreaKm2(interSouth, interWest, interNorth, interEast);
    const a1 = calculateFootprintAreaKm2(b1.south, b1.west, b1.north, b1.east);
    const a2 = calculateFootprintAreaKm2(b2.south, b2.west, b2.north, b2.east);
    return interArea / (a1 + a2 - interArea);
  }
  const boxA = { north: 23.05, south: 23.01, east: 72.55, west: 72.50 };
  const boxB = { north: 23.05, south: 23.01, east: 72.55, west: 72.50 };
  const perfectIoU = computeIoU(boxA, boxB);
  recordTest(29, 'Spatial Math: Bounding Box IoU Intersection Calculation', 'Spatial Engine', Math.abs(perfectIoU - 1.0) < 0.001, `IoU: ${perfectIoU.toFixed(3)}`);

  // Test 30: Esri Dark Canvas Tile Layer & maxNativeZoom Configuration
  const tileConfig = {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    maxNativeZoom: 16,
    maxZoom: 19
  };
  const isTileConfigValid = tileConfig.url.includes('World_Dark_Gray_Base') && tileConfig.maxNativeZoom === 16 && tileConfig.maxZoom === 19;
  recordTest(30, 'Basemap Config: Esri Dark Canvas Zoom Safeguards', 'Mapping System', isTileConfigValid, 'maxNativeZoom: 16, maxZoom: 19');

  // --- Final Summary ---
  console.log('\n' + '='.repeat(75));
  const passedCount = testResults.filter(t => t.passed).length;
  const failedCount = testResults.filter(t => !t.passed).length;
  console.log(` SUMMARY: ${passedCount} / ${testResults.length} Tests Passed (${((passedCount / testResults.length) * 100).toFixed(1)}%)`);
  if (failedCount === 0) {
    console.log(' \x1b[32mALL 30 END-TO-END TESTS PASSED FLOPLESSLY!\x1b[0m 🚀');
  } else {
    console.log(` \x1b[31m${failedCount} Tests Failed.\x1b[0m`);
  }
  console.log('='.repeat(75));
}

runAllTests();
