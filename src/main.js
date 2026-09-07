const nav = [
  ['dashboard','▦','Dashboard'],
  ['prospects','◉','Prospects'],
  ['actors','☰','AI Actors'],
  ['calling','☎','Cold Calling'],
  ['appointments','▤','Appointments'],
  ['research','⌕','Research'],
  ['analytics','▲','Analytics'],
  ['training','✎','Training'],
  ['integrations','⛭','Integrations'],
  ['settings','⚙','Settings']
];

const metrics = [
  ['Calls today','284','+12.4%'],
  ['Qualified leads','52','+8.1%'],
  ['Meetings booked','19','+21.7%'],
  ['Connect rate','38.4%','+4.2%']
];

const leads = [
  ['Maria Chen','Director of Facilities','Memorial Healthcare Campus','Hospital','Miami, FL','Hot','Qualified'],
  ['James Wilson','Chief Engineer','Harborview Data Center','Data Center','Fort Lauderdale, FL','Hot','New'],
  ['Sofia Patel','Property Manager','Palm Tower Residences','Luxury Condo','Boca Raton, FL','Warm','Research'],
  ['Robert King','VP Operations','AeroTech Manufacturing','Manufacturing','West Palm Beach, FL','Warm','Contacted'],
  ['Daniel Ortiz','Maintenance Supervisor','Grand Bay Convention Center','Convention Center','Miami Beach, FL','Cold','New']
];

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo neon"><img src="public/brand/prospector-logo-neon.png" alt="ProSpector logo" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" /><span style="display:none">P</span></div>
        <div><strong>ProSpector</strong><small>AI Sales Platform</small></div>
      </div>
      <div class="workspace"><span class="workspace-logo">P</span><div><small>WORKSPACE</small><b>HVAC Growth Team</b></div><span class="caret">⌄</span></div>
      <section class="call-controls" aria-label="Calling controls">
        <button class="emergency" data-action="emergency"><span>■</span> EMERGENCY STOP</button>
        <div class="utility-controls">
          <button class="mute" data-action="mute">◖ <span>MUTE</span></button>
          <button class="reload" data-action="reload">↻ <span>RELOAD</span></button>
          <button class="test" data-action="test">✓ <span>TEST</span></button>
          <button class="voice" data-action="voice">◉ <span>VOICE</span></button>
        </div>
        <small class="hotkey">ESC, SPACEBAR, or Ctrl+Shift+S</small>
      </section>
      <div class="nav-label">MAIN MENU</div>
      <nav>${nav.map(([id, icon, label], i) => `<button class="nav-item ${i === 0 ? 'active' : ''}" data-page="${id}"><span class="nav-icon">${icon}</span><span>${label}</span></button>`).join('')}</nav>
      <div class="side-bottom"><div class="mode-chip"><span></span> Mock mode</div><div class="account"><div class="avatar">PS</div><div><b>ProSpector</b><small>Workspace owner</small></div><span>•••</span></div></div>
    </aside>
    <main class="main">
      <header class="topbar"><div class="crumb">app <span>/</span> <b id="crumb">dashboard</b></div><div class="top-actions"><div class="connected"><i></i> All systems operational</div><button class="circle">?</button><div class="user-avatar">JD</div></div></header>
      <section class="content">
        <section id="dashboard-panel">
          <div class="hero"><div><div class="eyebrow">SUNDAY · SEPTEMBER 6, 2026</div><h1>Good evening, Jordan.</h1><p>Your AI sales team is ready. Here’s the pulse across your pipeline.</p></div><div class="hero-actions"><button class="secondary" id="import">＋ Import leads</button><button class="primary" id="campaign">＋ New campaign</button></div></div>
          <div class="metric-grid">${metrics.map(([label, value, change]) => `<article class="metric"><div class="metric-label">${label}<span class="metric-dot"></span></div><strong>${value}</strong><small>${change} <em>vs last week</em></small></article>`).join('')}</div>
          <div class="two-col">
            <article class="card chart-card"><div class="card-head"><div><h2>Pipeline activity</h2><p>Calls and qualified leads over the last 30 days</p></div><button class="filter">Last 30 days⌄</button></div><div class="chart"><div class="chart-value"><b>1,284</b><span>calls placed</span><em>↑ 18.4%</em></div><svg viewBox="0 0 620 210" preserveAspectRatio="none"><path class="gridline" d="M0 35H620M0 85H620M0 135H620M0 185H620"/><path class="area" d="M0 178 C40 165 54 151 85 160 S122 130 155 145 S194 106 225 123 S260 91 296 105 S332 75 365 92 S404 49 438 68 S474 42 508 57 S551 29 580 42 S605 18 620 25 L620 210H0Z"/><path class="line" d="M0 178 C40 165 54 151 85 160 S122 130 155 145 S194 106 225 123 S260 91 296 105 S332 75 365 92 S404 49 438 68 S474 42 508 57 S551 29 580 42 S605 18 620 25"/><path class="line orange" d="M0 194 C44 187 78 179 115 188 S173 163 213 177 S266 150 310 165 S371 136 413 151 S470 124 516 139 S574 108 620 118"/><text x="0" y="207">AUG 07</text><text x="145" y="207">AUG 14</text><text x="290" y="207">AUG 21</text><text x="435" y="207">AUG 28</text><text x="570" y="207">SEP 06</text></svg><div class="legend"><span><i></i>Calls placed</span><span><i class="orange-dot"></i>Qualified leads</span></div></div></article>
            <article class="card"><div class="card-head"><div><h2>Active campaigns</h2><p>Performance at a glance</p></div><button class="text-button" data-go="calling">View all →</button></div><div class="campaigns"><div class="campaign"><span class="camp-icon">Q4</span><div><b>Q4 SaaS founders</b><small>486 prospects · Updated 2h ago</small></div><strong>38.4%<small>connect</small></strong><label class="live">Live</label></div><div class="campaign"><span class="camp-icon">SM</span><div><b>SMB finance leaders</b><small>312 prospects · Updated 5h ago</small></div><strong>29.1%<small>connect</small></strong><label class="live">Live</label></div><div class="campaign"><span class="camp-icon">NR</span><div><b>North region re-engage</b><small>198 prospects · Updated yesterday</small></div><strong>21.7%<small>connect</small></strong><label class="paused">Paused</label></div></div></article>
          </div>
          <article class="card attention-card"><div class="card-head"><div><h2>Needs your attention</h2><p>Small actions that keep your pipeline moving</p></div><button class="text-button">View queue →</button></div><div class="attention"><div><i class="danger"></i><b>4 calls need a human follow-up</b><small>High-intent prospects asked to speak with someone.</small></div><div><i></i><b>12 prospects are missing time zones</b><small>Fix before the next calling window opens.</small></div><div><i></i><b>Calendar connection expires soon</b><small>Reconnect Google Calendar within 6 days.</small></div><div><i class="danger"></i><b>Campaign pacing fast</b><small>Review daily limits before tomorrow’s run.</small></div></div></article>
          <article class="card recent"><div class="card-head"><div><h2>Recent calls</h2><p>The latest conversations across all campaigns</p></div><button class="text-button" data-go="calling">Open call log →</button></div><div class="table-wrap"><table><thead><tr><th>Prospect</th><th>Campaign</th><th>Outcome</th><th>Duration</th><th>When</th></tr></thead><tbody><tr><td>Maria Chen</td><td>Q4 SaaS founders</td><td class="green">Qualified · Hot</td><td>04:12</td><td>8 min ago</td></tr><tr><td>Tom Keane</td><td>SMB finance leaders</td><td class="green">Meeting booked</td><td>06:38</td><td>23 min ago</td></tr><tr><td>Priya Shah</td><td>Q4 SaaS founders</td><td>Not interested</td><td>01:05</td><td>41 min ago</td></tr></tbody></table></div></article>
        </section>
        <section id="prospects-panel" class="prospects-view" hidden>
          <div class="hero"><div><div class="eyebrow">LEAD DATABASE · SOUTH FLORIDA</div><h1>Prospects</h1><p>Manage, enrich, and prepare commercial HVAC decision-makers for outreach.</p></div><div class="hero-actions"><button class="secondary" id="upload-leads">⇧ Import CSV</button><button class="primary" id="add-lead">＋ Add prospect</button></div></div>
          <div class="lead-summary"><div><span>Total prospects</span><b>2,847</b></div><div><span>Ready to call</span><b class="green">1,926</b></div><div><span>Needs research</span><b class="amber-text">312</b></div><div><span>Invalid numbers</span><b class="red-text">86</b></div></div>
          <article class="card lead-card"><div class="lead-toolbar"><label class="lead-search">⌕ <input id="lead-search" placeholder="Search company, contact, or title" /></label><select id="lead-filter"><option>All statuses</option><option>Hot</option><option>Warm</option><option>Cold</option></select><button class="secondary">Filter ▾</button></div><div class="table-wrap"><table class="lead-table"><thead><tr><th>Contact</th><th>Company / facility</th><th>Industry</th><th>Location</th><th>Priority</th><th>Status</th></tr></thead><tbody id="lead-rows">${leads.map(l=>`<tr><td><b>${l[0]}</b><small>${l[1]}</small></td><td>${l[2]}</td><td>${l[3]}</td><td>${l[4]}</td><td><span class="priority ${l[5].toLowerCase()}">${l[5]}</span></td><td><span class="lead-status">${l[6]}</span></td></tr>`).join('')}</tbody></table></div></article>
        </section>
      </section>
    </main>
  </div><div class="toast" id="toast"></div>`;

const toast = document.querySelector('#toast');
function notify(message){ toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2400); }

document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
  button.classList.add('active');
  const page = button.dataset.page;
  document.querySelector('#crumb').textContent = page;
  document.querySelector('#dashboard-panel').hidden = page !== 'dashboard';
  document.querySelector('#prospects-panel').hidden = page !== 'prospects';
  notify(`${button.textContent.trim()} view selected`);
}));

document.querySelector('#campaign').addEventListener('click', () => notify('Campaign workspace ready — mock mode is active.'));
document.querySelector('#import').addEventListener('click', () => notify('Lead importer opened — connect a source to continue.'));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => notify('AI Cold Calling view selected')));
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
  const messages = { emergency:'Emergency stop activated — calling paused', mute:'Microphone muted', reload:'Calling workspace reloaded', test:'Test call workspace ready', voice:'Voice controls opened' };
  notify(messages[button.dataset.action] || 'Calling control selected');
}));
document.querySelector('#upload-leads').addEventListener('click', () => notify('CSV importer opened — mock mode is active'));
document.querySelector('#add-lead').addEventListener('click', () => notify('New prospect form opened'));
document.querySelector('#lead-search').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('#lead-rows tr').forEach(row => row.hidden = !row.textContent.toLowerCase().includes(q));
});
document.querySelector('#lead-filter').addEventListener('change', e => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('#lead-rows tr').forEach(row => row.hidden = q !== 'all statuses' && !row.textContent.toLowerCase().includes(q));
});
