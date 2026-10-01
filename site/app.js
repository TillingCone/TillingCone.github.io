const profile = window.PORTFOLIO;
const pages = ['about', 'stats', 'projects'];
let current = Math.max(0, pages.indexOf(location.hash.slice(1)));
let selected = 0;
let detail = false;
const content = document.getElementById('screen-content');
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = value => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; } };
const linkHTML = (label, url) => safeUrl(url) ? `<a class="screen-link" href="${escapeHTML(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)} ↗</a>` : '';
function render() {
  content.setAttribute('aria-label', ['About me', 'My stats', 'Projects'][current]);
  document.getElementById('screen-number').textContent = `${current + 1} / 3`;
  document.getElementById('page-indicator').textContent = pages.map((_, i) => i === current ? '▪' : '▫').join(' ');
  document.querySelectorAll('.outside-nav a').forEach((a, i) => { if (i === current) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  document.getElementById('screen-hint').textContent = detail ? 'B: BACK TO PROJECTS' : current === 2 && profile.projects.length ? '↑↓ SELECT · A: OPEN' : 'A: NEXT SCREEN';
  if (current === 0) {
    content.innerHTML = `<div class="profile-heading"><span class="avatar" aria-hidden="true">${escapeHTML(profile.name.charAt(0).toUpperCase())}</span><div><h2>${escapeHTML(profile.name)}</h2><p class="role">${escapeHTML(profile.role)}</p></div></div><p class="bio">${escapeHTML(profile.bio)}</p><div class="links">${profile.links.map(l => linkHTML(l.label, l.url)).join('')}</div>`;
  } else if (current === 1) {
    const rows = [['Studying', profile.course], ['Year', profile.year], ['Based in', profile.location]].filter(([,v]) => v);
    content.innerHTML = `<h2>My stats</h2><dl class="stats">${rows.map(([k,v]) => `<div><dt>${k}</dt><dd>${escapeHTML(v)}</dd></div>`).join('')}<div><dt>Projects shared</dt><dd>${profile.projects.length}</dd></div></dl>${profile.skills.length ? `<h3>What I use</h3><p class="skill-list">${profile.skills.map(escapeHTML).join(' · ')}</p>` : '<p class="bio">Right now, I’m exploring ideas for my first personal project.</p>'}${profile.interests.length ? `<h3>Exploring</h3><p>${profile.interests.map(escapeHTML).join(' · ')}</p>` : ''}`;
  } else if (!profile.projects.length) {
    content.innerHTML = '<h2>Projects</h2><div class="empty-slot"><span aria-hidden="true">[ + ]</span><h3>Just getting started.</h3><p>No projects to share yet. I’ll add my experiments here as I build them.</p></div>';
  } else if (detail) {
    const p = profile.projects[selected];
    content.innerHTML = `<p class="screen-kicker">PROJECT ${String(selected+1).padStart(2,'0')}</p><h2>${escapeHTML(p.title)}</h2><p class="bio">${escapeHTML(p.description)}</p><p class="skill-list">${(p.stack || []).map(escapeHTML).join(' · ')}</p><div class="links">${linkHTML('Live demo',p.demo)}${linkHTML('Source code',p.source)}</div><button class="screen-link" id="back-projects">← Back to projects</button>`;
    document.getElementById('back-projects').addEventListener('click', () => { detail = false; render(); });
  } else {
    content.innerHTML = `<p class="screen-kicker">THE BUILD COLLECTION</p><h2>Projects</h2><div class="project-list">${profile.projects.map((p,i) => `<button data-project="${i}" class="project ${i === selected ? 'selected' : ''}" aria-label="Open ${escapeHTML(p.title)}"><span>${String(i+1).padStart(2,'0')}</span><strong>${escapeHTML(p.title)}</strong><span>▶</span></button>`).join('')}</div>`;
    content.querySelectorAll('[data-project]').forEach(b => b.addEventListener('click', () => { selected = Number(b.dataset.project); detail = true; render(); }));
  }
  content.scrollTop = 0;
}
function navigate(delta) { current = (current + delta + pages.length) % pages.length; detail = false; selected = 0; history.replaceState(null, '', '#' + pages[current]); render(); }
function action(name) {
  if (name === 'left') navigate(-1);
  else if (name === 'right' || name === 'select') navigate(1);
  else if (name === 'start') { current = 2; navigate(1); }
  else if (name === 'back') { if (detail) { detail = false; render(); } else navigate(-1); }
  else if (name === 'open') { if (current === 2 && profile.projects.length && !detail) { detail = true; render(); } else if (!detail) navigate(1); }
  else if ((name === 'up' || name === 'down') && current === 2 && profile.projects.length && !detail) { selected = (selected + (name === 'down' ? 1 : -1) + profile.projects.length) % profile.projects.length; render(); content.querySelector('.selected')?.scrollIntoView({block:'nearest'}); }
  else content.scrollBy({top: name === 'down' ? 100 : -100, behavior: 'auto'});
}
document.querySelectorAll('[data-action]').forEach(b => b.addEventListener('click', () => action(b.dataset.action)));
window.addEventListener('hashchange', () => { current = Math.max(0,pages.indexOf(location.hash.slice(1))); selected = 0; detail = false; render(); });
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.altKey || e.metaKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  if (e.key === 'Enter' && e.target.closest('a,button')) return;
  const key = {ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',a:'open',A:'open',Enter:'open',b:'back',B:'back',Escape:'back'}[e.key];
  if (key) { e.preventDefault(); action(key); }
});
render();
