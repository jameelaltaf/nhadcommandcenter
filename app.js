/* ══════════════════════════════════════════════════════════════
   NEW HEIGHTS COMMAND CENTER — app.js
   Navigation · Theme switching · Ad generator · Budget calculator
   ══════════════════════════════════════════════════════════════ */

/* ─── NAVIGATION ─── */
function showSection(id, navEl) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Show target
  const target = document.getElementById('section-' + id);
  if (target) target.classList.add('active');

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) {
    navEl.classList.add('active');
  } else {
    // Find nav item by data-section
    const match = document.querySelector('.nav-item[data-section="' + id + '"]');
    if (match) match.classList.add('active');
  }

  // Close sidebar on mobile
  if (window.innerWidth <= 768) closeSidebar();

  // Scroll to top
  document.querySelector('.main').scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ─── MOBILE SIDEBAR ─── */
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── THEME SWITCHER ─── */
function toggleThemeSwitcher() {
  const panel = document.getElementById('themePanel');
  panel.classList.toggle('open');
}

// Close theme panel when clicking outside
document.addEventListener('click', function(e) {
  const switcher = document.getElementById('themeSwitcher');
  if (switcher && !switcher.contains(e.target)) {
    document.getElementById('themePanel').classList.remove('open');
  }
});

function setTheme(theme) {
  const body = document.body;
  // Remove all theme classes
  body.classList.remove('theme-dune', 'theme-midnight', 'theme-emerald', 'theme-rose', 'theme-slate');
  // Apply new theme
  body.classList.add('theme-' + theme);
  body.dataset.theme = theme;

  // Update active swatch
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.theme === theme);
  });

  // Persist
  try { localStorage.setItem('nh_theme', theme); } catch(e) {}

  // Close panel
  document.getElementById('themePanel').classList.remove('open');

  // Update budget bars color
  updateBudget();
}

// Load saved theme
(function() {
  try {
    const saved = localStorage.getItem('nh_theme');
    if (saved) setTheme(saved);
  } catch(e) {}
})();

/* ─── AD GENERATOR ─── */
let currentPlatform = 'meta';

function setPlatform(platform, btn) {
  currentPlatform = platform;
  document.querySelectorAll('.gen-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const labels = { meta: 'Meta', google: 'Google RSA', pmax: 'Google PMax', tiktok: 'TikTok' };
  document.getElementById('genPlatformLabel').textContent = labels[platform];
  // Hide previous output
  document.getElementById('genOutput').style.display = 'none';
}

function runAdGen() {
  const prop     = document.getElementById('g-prop').value;
  const loc      = document.getElementById('g-loc').value;
  const persona  = document.getElementById('g-persona').value;
  const price    = document.getElementById('g-price').value || '1,800,000';
  const handover = document.getElementById('g-handover').value;
  const usp      = document.getElementById('g-usp').value;

  const outputDiv  = document.getElementById('genOutput');
  const outputBody = document.getElementById('outputBody');
  const outputLabel= document.getElementById('outputLabel');
  const scoreBadge = document.getElementById('scoreBadge');
  const genBtn     = document.getElementById('genBtn');
  const genBtnText = document.getElementById('genBtnText');

  const platformLabels = { meta:'Meta ad assets', google:'Google RSA assets', pmax:'PMax asset group', tiktok:'TikTok ad assets' };
  outputLabel.textContent = platformLabels[currentPlatform];
  outputDiv.style.display = 'block';
  scoreBadge.textContent = '';
  scoreBadge.style.cssText = '';
  outputBody.innerHTML = '<div class="loading-dots" style="font-size:13px;color:var(--text-secondary);padding:4px 0;">Generating<span>.</span><span>.</span><span>.</span></div>';
  genBtn.classList.add('loading');
  genBtnText.textContent = 'Generating...';

  const prompts = {
    meta: `You are a Dubai real estate Meta Ads specialist for New Heights Real Estate (an off-plan developer brokerage).
Generate Meta Facebook/Instagram ad assets for this listing:
- Property: ${prop} in ${loc}, Dubai
- Offer: Off-plan, handover ${handover}
- Starting price: AED ${price}
- Buyer: ${persona}
- USP: ${usp || 'Developer-direct pricing, flexible payment plan, RERA-protected escrow'}
- Context: April 2026 — uncertain market, use calm authority tone not urgency hype. RERA compliance required.

Return ONLY valid JSON, no markdown, no backticks:
{
  "score": <0-100>,
  "score_reason": "<one sentence>",
  "primary_text": ["<A: calm authority/data-backed hook, 80-100 words>", "<B: yield/investment angle, 80-100 words>", "<C: payment plan/risk-reducer angle, 80-100 words>"],
  "headlines": ["<h1 ≤27 chars>","<h2>","<h3>","<h4>","<h5>"],
  "descriptions": ["<d1 ≤30 chars>","<d2>","<d3>"],
  "audience_signal": "<2 sentence Meta targeting recommendation for this persona>",
  "compliance_note": "<one RERA/compliance reminder>"
}`,

    google: `You are a Dubai real estate Google Ads specialist for New Heights Real Estate (off-plan developer brokerage).
Generate Google RSA assets for:
- Property: ${prop} in ${loc}, Dubai
- Offer: Off-plan, handover ${handover}
- Starting price: AED ${price}
- Buyer: ${persona}
- USP: ${usp || 'Developer-direct, RERA-protected escrow, flexible payment plan'}
- Context: April 2026 uncertain market — include reassurance keywords.

Return ONLY valid JSON, no markdown, no backticks:
{
  "score": <0-100>,
  "score_reason": "<one sentence>",
  "headlines": ["<h1 ≤30 chars>","<h2>","<h3>","<h4>","<h5>","<h6>","<h7>","<h8>","<h9>","<h10>"],
  "descriptions": ["<d1 ≤90 chars>","<d2>","<d3>","<d4>"],
  "keywords": ["<kw1>","<kw2>","<kw3>","<kw4>","<kw5>","<kw6>","<kw7>","<kw8>"],
  "negative_keywords": ["<neg1>","<neg2>","<neg3>","<neg4>","<neg5>"],
  "compliance_note": "<RERA reminder>"
}`,

    pmax: `You are a Google PMax specialist for New Heights Real Estate (Dubai off-plan developer brokerage).
Generate Performance Max asset group content for:
- Property: ${prop} in ${loc}, Dubai
- Offer: Off-plan, handover ${handover}
- Starting price: AED ${price}
- Buyer: ${persona}
- USP: ${usp || 'Developer-direct, RERA-protected escrow, flexible payment plan'}
- Context: April 2026 uncertain market — include RERA escrow reassurance language.

Return ONLY valid JSON, no markdown, no backticks:
{
  "score": <0-100>,
  "score_reason": "<one sentence>",
  "short_headlines": ["<h1 ≤30 chars>","<h2>","<h3>","<h4>","<h5>"],
  "long_headlines": ["<lh1 ≤90 chars>","<lh2>","<lh3>"],
  "descriptions": ["<d1 short ≤90 chars>","<d2>","<d3>","<d4 long ≤90 chars>"],
  "audience_signals": ["<signal 1>","<signal 2>","<signal 3>"],
  "asset_group_strategy": "<3 sentences on asset group strategy for this property>",
  "compliance_note": "<RERA reminder>"
}`,

    tiktok: `You are a TikTok ads specialist for New Heights Real Estate (Dubai off-plan developer brokerage).
Generate TikTok ad content for:
- Property: ${prop} in ${loc}, Dubai
- Offer: Off-plan, handover ${handover}
- Starting price: AED ${price}
- Buyer: ${persona} — TikTok skews 25–40 year old expats and NRI
- USP: ${usp || 'Developer-direct, RERA-protected escrow, flexible payment plan'}
- Context: April 2026 uncertain market — use calm authority, data-backed, never hype. Competitors are quiet on TikTok right now — this is NH's first-mover opportunity.

Return ONLY valid JSON, no markdown, no backticks:
{
  "score": <0-100>,
  "score_reason": "<one sentence>",
  "video_hooks": ["<hook A: question format, first 3 seconds>", "<hook B: bold data statement>", "<hook C: lifestyle/aspiration>"],
  "video_scripts": ["<30-second script A: payment plan explainer>", "<30-second script B: property + RERA safety walkthrough>"],
  "captions": ["<caption 1 with relevant hashtags>", "<caption 2 with relevant hashtags>"],
  "cta_overlays": ["<overlay 1>","<overlay 2>","<overlay 3>"],
  "targeting_note": "<TikTok audience recommendation>",
  "compliance_note": "<RERA reminder>"
}`
  };

  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompts[currentPlatform] }]
    })
  })
  .then(r => r.json())
  .then(data => {
    const raw = data.content.map(i => i.text || '').join('');
    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch(e) {
      outputBody.innerHTML = '<div style="color:var(--warn);font-size:13px;padding:8px;">Could not parse response. Please try again.</div>';
      resetGenBtn();
      return;
    }

    renderOutput(parsed, currentPlatform);
    resetGenBtn();
  })
  .catch(err => {
    outputBody.innerHTML = '<div style="color:var(--warn);font-size:13px;padding:8px;">Error: ' + esc(String(err)) + '</div>';
    resetGenBtn();
  });
}

function resetGenBtn() {
  const btn = document.getElementById('genBtn');
  const txt = document.getElementById('genBtnText');
  btn.classList.remove('loading');
  const labels = { meta: 'Meta', google: 'Google RSA', pmax: 'Google PMax', tiktok: 'TikTok' };
  txt.innerHTML = 'Generate <span id="genPlatformLabel">' + labels[currentPlatform] + '</span> assets';
}

function renderOutput(parsed, platform) {
  const score = parseInt(parsed.score) || 0;
  const badge = document.getElementById('scoreBadge');
  badge.textContent = 'Score: ' + score + '/100';
  if (score >= 80) {
    badge.style.cssText = 'background:rgba(93,170,110,0.18);color:#7DC490;font-size:12px;font-weight:500;padding:3px 12px;border-radius:20px;';
  } else if (score >= 60) {
    badge.style.cssText = 'background:rgba(212,146,74,0.18);color:#E0A860;font-size:12px;font-weight:500;padding:3px 12px;border-radius:20px;';
  } else {
    badge.style.cssText = 'background:rgba(212,92,74,0.18);color:#E88070;font-size:12px;font-weight:500;padding:3px 12px;border-radius:20px;';
  }

  let html = '<div style="font-size:12px;color:var(--text-muted);margin-bottom:14px;font-style:italic;">' + esc(parsed.score_reason || '') + '</div>';

  if (platform === 'meta') {
    html += '<div class="output-section-label">Primary text variations</div>';
    (parsed.primary_text || []).forEach(v => {
      html += '<div class="ad-block">' + esc(v) + '</div>';
    });
    html += '<div class="output-divider"></div>';
    html += '<div class="output-two-col">';
    html += '<div><div class="output-section-label">Headlines</div><div class="pill-row">';
    (parsed.headlines || []).forEach(h => { html += '<span class="kw-pill">' + esc(h) + '</span>'; });
    html += '</div></div>';
    html += '<div><div class="output-section-label">Descriptions</div><div class="pill-row">';
    (parsed.descriptions || []).forEach(d => { html += '<span class="kw-pill">' + esc(d) + '</span>'; });
    html += '</div></div>';
    html += '</div>';
    html += '<div class="output-divider"></div>';
    html += '<div class="output-section-label">Audience signal</div>';
    html += '<div class="ad-block">' + esc(parsed.audience_signal || '') + '</div>';

  } else if (platform === 'google') {
    html += '<div class="output-section-label">Headlines (10 — use all in RSA)</div>';
    html += '<div style="display:flex;flex-direction:column;gap:5px;margin-bottom:14px;">';
    (parsed.headlines || []).forEach((h, i) => {
      const over = h.length > 30;
      html += '<div style="display:flex;align-items:center;gap:10px;">';
      html += '<span style="font-size:11px;color:var(--text-muted);min-width:18px;text-align:right;">' + (i+1) + '</span>';
      html += '<div class="ad-block" style="flex:1;padding:8px 12px;margin:0;">' + esc(h) + '</div>';
      html += '<span style="font-size:11px;color:' + (over ? 'var(--warn)' : 'var(--text-muted)') + ';min-width:34px;text-align:right;">' + h.length + '/30</span>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="output-divider"></div>';
    html += '<div class="output-section-label">Descriptions</div>';
    (parsed.descriptions || []).forEach(d => {
      const over = d.length > 90;
      html += '<div style="display:flex;align-items:start;gap:10px;margin-bottom:6px;">';
      html += '<div class="ad-block" style="flex:1;padding:8px 12px;margin:0;">' + esc(d) + '</div>';
      html += '<span style="font-size:11px;color:' + (over ? 'var(--warn)' : 'var(--text-muted)') + ';white-space:nowrap;margin-top:6px;">' + d.length + '/90</span>';
      html += '</div>';
    });
    html += '<div class="output-divider"></div>';
    html += '<div class="output-two-col">';
    html += '<div><div class="output-section-label">Target keywords</div>';
    (parsed.keywords || []).forEach(k => { html += '<div style="font-size:12px;color:var(--text-secondary);padding:3px 0;">+ ' + esc(k) + '</div>'; });
    html += '</div>';
    html += '<div><div class="output-section-label">Negative keywords</div>';
    (parsed.negative_keywords || []).forEach(k => { html += '<div style="font-size:12px;color:var(--text-muted);padding:3px 0;text-decoration:line-through;">− ' + esc(k) + '</div>'; });
    html += '</div></div>';

  } else if (platform === 'pmax') {
    html += '<div class="output-section-label">Short headlines</div>';
    html += '<div class="pill-row">';
    (parsed.short_headlines || []).forEach(h => { html += '<span class="kw-pill">' + esc(h) + '</span>'; });
    html += '</div>';
    html += '<div class="output-section-label">Long headlines</div>';
    (parsed.long_headlines || []).forEach(h => { html += '<div class="ad-block">' + esc(h) + '</div>'; });
    html += '<div class="output-divider"></div>';
    html += '<div class="output-section-label">Descriptions</div>';
    (parsed.descriptions || []).forEach(d => { html += '<div class="ad-block">' + esc(d) + '</div>'; });
    html += '<div class="output-divider"></div>';
    html += '<div class="output-section-label">Audience signals</div>';
    html += '<div class="pill-row">';
    (parsed.audience_signals || []).forEach(s => { html += '<span class="kw-pill">' + esc(s) + '</span>'; });
    html += '</div>';
    html += '<div class="output-section-label">Asset group strategy</div>';
    html += '<div class="ad-block">' + esc(parsed.asset_group_strategy || '') + '</div>';

  } else if (platform === 'tiktok') {
    html += '<div class="output-section-label">Video hooks (first 3 seconds)</div>';
    (parsed.video_hooks || []).forEach(h => { html += '<div class="ad-block">' + esc(h) + '</div>'; });
    html += '<div class="output-divider"></div>';
    html += '<div class="output-section-label">30-second scripts</div>';
    (parsed.video_scripts || []).forEach(s => { html += '<div class="ad-block">' + esc(s) + '</div>'; });
    html += '<div class="output-divider"></div>';
    html += '<div class="output-section-label">Captions + hashtags</div>';
    (parsed.captions || []).forEach(c => { html += '<div class="ad-block">' + esc(c) + '</div>'; });
    html += '<div class="output-section-label">CTA overlays</div>';
    html += '<div class="pill-row">';
    (parsed.cta_overlays || []).forEach(c => { html += '<span class="kw-pill">' + esc(c) + '</span>'; });
    html += '</div>';
    html += '<div class="output-section-label">Targeting note</div>';
    html += '<div class="ad-block">' + esc(parsed.targeting_note || '') + '</div>';
  }

  if (parsed.compliance_note) {
    html += '<div class="output-note">RERA: ' + esc(parsed.compliance_note) + '</div>';
  }

  html += '<div class="output-action-row">';
  html += '<button class="output-action-btn" onclick="alert(\'Open in Claude.ai chat to use this action\')">Critique & improve ↗</button>';
  html += '<button class="output-action-btn" onclick="alert(\'Open in Claude.ai chat to use this action\')">Rewrite weakest hook ↗</button>';
  html += '<button class="output-action-btn" onclick="alert(\'Open in Claude.ai chat to use this action\')">Multilingual versions ↗</button>';
  html += '</div>';

  document.getElementById('outputBody').innerHTML = html;
}

/* ─── BUDGET CALCULATOR ─── */
const channels = [
  { name: 'Meta (FB/IG)',   color: 'var(--ch-meta)',   pct: 0.40, cpl: 160, apptRate: 0.08 },
  { name: 'Google Search',  color: 'var(--ch-google)', pct: 0.30, cpl: 280, apptRate: 0.12 },
  { name: 'Google PMax',    color: 'var(--ch-pmax)',   pct: 0.20, cpl: 220, apptRate: 0.09 },
  { name: 'TikTok',         color: 'var(--ch-tiktok)', pct: 0.10, cpl: 240, apptRate: 0.06 },
];

function updateBudget() {
  const total = parseInt(document.getElementById('budgetSlider').value);
  document.getElementById('totalDisplay').textContent = 'AED ' + total.toLocaleString();

  // Render channel bars
  const container = document.getElementById('budgetChannels');
  container.innerHTML = '';
  channels.forEach(ch => {
    const amt = Math.round(total * ch.pct);
    const row = document.createElement('div');
    row.className = 'budget-channel-row';
    row.innerHTML = `
      <span class="ch-dot" style="background:${ch.color};"></span>
      <span class="bc-name">${ch.name}</span>
      <span class="bc-amt">AED ${amt.toLocaleString()}</span>
      <div class="bc-bar-wrap">
        <div class="bc-bar" style="width:${ch.pct * 100}%;background:${ch.color};"></div>
      </div>
      <span class="bc-pct">${Math.round(ch.pct * 100)}%</span>
    `;
    container.appendChild(row);
  });

  // Render CPL table
  const tbody = document.getElementById('cplTableBody');
  tbody.innerHTML = '';
  let totalLeads = 0, totalAppts = 0;
  channels.forEach(ch => {
    const budget = Math.round(total * ch.pct);
    const leads = Math.round(budget / ch.cpl);
    const appts = Math.round(leads * ch.apptRate);
    totalLeads += leads;
    totalAppts += appts;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="ch-dot" style="background:${ch.color};margin-right:8px;"></span>${ch.name}</td>
      <td>AED ${budget.toLocaleString()}</td>
      <td>${leads}</td>
      <td>AED ${ch.cpl}</td>
      <td>${appts}</td>
    `;
    tbody.appendChild(tr);
  });
  const totRow = document.createElement('tr');
  const blendedCPL = totalLeads > 0 ? Math.round(total / totalLeads) : 0;
  totRow.innerHTML = `
    <td>Total</td>
    <td>AED ${total.toLocaleString()}</td>
    <td>${totalLeads}</td>
    <td>AED ${blendedCPL}</td>
    <td>${totalAppts}</td>
  `;
  tbody.appendChild(totRow);
}

/* ─── UTILITY ─── */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', function() {
  updateBudget();
});
