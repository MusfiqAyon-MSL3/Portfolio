// ---------- Theme Setup ----------
(function initTheme(){
  const stored = localStorage.getItem('theme');
  if(stored==='light') document.documentElement.classList.add('theme-light');
})();

const toggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');

(function syncToggleFromDom(){
  const isLight = document.documentElement.classList.contains('theme-light');
  toggle.checked = isLight;
  themeLabel.textContent = isLight ? 'Light' : 'Dark';
})();

toggle.addEventListener('change',()=>{
  const toLight = toggle.checked;
  document.documentElement.classList.toggle('theme-light',toLight);
  localStorage.setItem('theme',toLight?'light':'dark');
  themeLabel.textContent = toLight?'Light':'Dark';
});

// ---------- Smooth Scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id = a.getAttribute('href');
    if(id.length>1 && document.querySelector(id)){
      e.preventDefault();
      document.querySelector(id).scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

// ---------- Dynamic Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Notes ----------
const elInput = document.getElementById('note-input');
const elSave = document.getElementById('save-note');
const elClear = document.getElementById('clear-notes');
const elList  = document.getElementById('notes-list');
const elCount = document.getElementById('note-count');

function readNotes(){try{return JSON.parse(localStorage.getItem('notes_v2'))||[];}catch{return [];} }
function writeNotes(arr){ localStorage.setItem('notes_v2',JSON.stringify(arr)); }
function formatTs(ts){ return new Date(ts).toLocaleString(); }
function renderNotes(){
  const notes=readNotes();
  elList.innerHTML='';
  notes.forEach((n,idx)=>{
    const row=document.createElement('div'); row.className='note-item';
    const left=document.createElement('div'); left.className='note-text'; left.textContent=n.text;
    const meta=document.createElement('span'); meta.className='note-meta'; meta.textContent=formatTs(n.ts);
    const actions=document.createElement('div'); actions.className='note-actions-inline';
    const del=document.createElement('button'); del.className='note-btn ghost'; del.type='button';
    del.innerHTML='<i class="fa-solid fa-trash"></i>'; del.title='Delete';
    del.addEventListener('click',()=>{ const arr=readNotes(); arr.splice(idx,1); writeNotes(arr); renderNotes(); });
    actions.appendChild(del); row.appendChild(left); row.appendChild(meta); row.appendChild(actions); elList.appendChild(row);
  });
  elCount.textContent=`${notes.length} ${notes.length===1?'note':'notes'}`;
}
function saveNote(){ const text=(elInput.value||'').trim(); if(!text) return; const arr=readNotes(); arr.push({text,ts:Date.now()}); writeNotes(arr); elInput.value=''; renderNotes(); }
elSave.addEventListener('click',saveNote);
elInput.addEventListener('keydown',e=>{ if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){ e.preventDefault(); saveNote(); }});
elClear.addEventListener('click',()=>{ if(confirm('Delete all notes?')){ writeNotes([]); renderNotes(); }});
renderNotes();
/* ================= Projects JS ================= */
const PROJECTS_KEY = 'msl_projects_v2';

/* default demo data */
const defaultProjects = {
  client: [
    { id: cryptoRandomId(), company:'Chaldal.com', title:'Chaldal Online Store', date:'2024-07-10', url:'https://www.chaldal.com', tags:['HTML','CSS','JS'] }
  ],
  uni: [],
  personal: []
};

function cryptoRandomId(){ return 'p_'+Math.random().toString(36).slice(2,9); }

function readProjects(){
  try{
    const raw = localStorage.getItem(PROJECTS_KEY);
    if(!raw) return JSON.parse(JSON.stringify(defaultProjects));
    return JSON.parse(raw);
  }catch{ return JSON.parse(JSON.stringify(defaultProjects)); }
}

function writeProjects(obj){ localStorage.setItem(PROJECTS_KEY, JSON.stringify(obj)); }

function renderAllProjects(){
  const { client, uni, personal } = readProjects();
  renderList('client-list', client, true);
  renderList('uni-list', uni, false);
  renderList('personal-list', personal, false);
}

function renderList(containerId, items, isClient){
  const wrap = document.getElementById(containerId);
  if(!wrap) return;
  wrap.innerHTML='';
  if(!items.length) { wrap.innerHTML='<p class="muted">No projects added yet.</p>'; return; }
  items.forEach(it=>{
    const card = document.createElement('div'); card.className='project-card'; card.dataset.id=it.id;
    const head = document.createElement('div'); head.className='project-head';
    const title = document.createElement('div'); title.className='project-title'; title.textContent=it.title;
    const meta = document.createElement('div'); meta.className='project-meta';
    meta.innerHTML = isClient ? `<strong>${escapeHtml(it.company)}</strong><div>${it.date||''}</div>`:`<div>${it.date||''}</div>`;
    head.appendChild(title); head.appendChild(meta);

    const desc = document.createElement('div'); desc.className='project-desc';
    if(it.url){
      const el = document.createElement('div'); el.className='project-tag';
      const a = document.createElement('a'); a.href=it.url; a.target='_blank'; a.rel='noopener noreferrer'; a.textContent=simplifyUrl(it.url); a.className='project-link';
      el.appendChild(a); desc.appendChild(el);
    }
    if(Array.isArray(it.tags)&&it.tags.length){
      const tagsWrap = document.createElement('div'); tagsWrap.style.marginTop='8px';
      it.tags.forEach(t=>{ const span=document.createElement('span'); span.className='project-tag'; span.textContent=t; tagsWrap.appendChild(span); });
      desc.appendChild(tagsWrap);
    }

    const actions = document.createElement('div'); actions.className='project-links';
    const previewBtn = document.createElement('button'); previewBtn.className='btn preview'; previewBtn.textContent='Preview';
    previewBtn.addEventListener('click', ()=>openPreview(it.url, it.title));
    const openBtn = document.createElement('a'); openBtn.className='btn open'; openBtn.textContent='Open'; openBtn.href=it.url||'#'; openBtn.target='_blank'; openBtn.rel='noopener noreferrer';
    const delBtn = document.createElement('button'); delBtn.className='btn delete'; delBtn.textContent='Delete';
    delBtn.addEventListener('click', ()=>deleteProject(containerId, it.id));
    actions.appendChild(previewBtn); actions.appendChild(openBtn); actions.appendChild(delBtn);

    card.appendChild(head); card.appendChild(desc); card.appendChild(actions);
    wrap.appendChild(card);
  });
}

function escapeHtml(s){ if(!s) return ''; return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
function simplifyUrl(url){ try{ const u=new URL(url); return u.hostname.replace('www.','') + (u.pathname && u.pathname!=='/' ? u.pathname : ''); }catch{return url;} }

function deleteProject(listId,id){
  const projects=readProjects();
  if(listId==='client-list') projects.client=projects.client.filter(p=>p.id!==id);
  if(listId==='uni-list') projects.uni=projects.uni.filter(p=>p.id!==id);
  if(listId==='personal-list') projects.personal=projects.personal.filter(p=>p.id!==id);
  writeProjects(projects); renderAllProjects();
}

/* Preview modal */
const previewModal=document.getElementById('project-preview-modal');
const previewBody=document.getElementById('preview-body');
const previewOpen=document.getElementById('preview-open');
const previewTitle=document.getElementById('preview-title');
document.getElementById('close-preview').addEventListener('click', closePreview);
previewModal.addEventListener('click', e=>{ if(e.target===previewModal) closePreview(); });

function openPreview(url,title='Preview'){
  previewBody.innerHTML=''; previewTitle.textContent=title||'Preview'; previewOpen.href=url||'#';
  if(!url){ previewBody.innerHTML='<div style="padding:20px;">No URL provided for preview.</div>'; previewModal.classList.remove('hidden'); return; }
  const iframe=document.createElement('iframe'); iframe.src=url; iframe.loading='lazy'; iframe.referrerPolicy='no-referrer';
  iframe.onerror=()=>{ previewBody.innerHTML='<div style="padding:20px;">This site does not allow embedding. You can open it in a new tab using the button below.</div>'; };
  previewBody.appendChild(iframe); previewModal.classList.remove('hidden');
}
function closePreview(){ previewModal.classList.add('hidden'); previewBody.innerHTML=''; }

/* Client form handling */
const clientForm=document.getElementById('client-form');
clientForm.addEventListener('submit', e=>{
  e.preventDefault();
  const company=document.getElementById('client-company').value.trim();
  const title=document.getElementById('client-title').value.trim();
  const date=document.getElementById('client-date').value;
  const url=document.getElementById('client-link').value.trim();
  if(!company||!title){ alert('Please enter company and project title.'); return; }
  const obj=readProjects(); obj.client.push({ id: cryptoRandomId(), company, title, date, url, tags: [] });
  writeProjects(obj); clientForm.reset(); renderAllProjects();
});

/* clear form */
document.getElementById('client-clear').addEventListener('click', ()=>clientForm.reset());

/* Tabs */
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const key=btn.getAttribute('data-tab');
    document.querySelectorAll('[data-panel]').forEach(panel=>panel.classList.toggle('hidden',!panel.id.includes(key)));
  });
});

/* init */
renderAllProjects();
/* ================= GitHub Projects Fetch ================= */
const GITHUB_USER = 'MusfiqAyon-MSL3';
const uniListEl = document.getElementById('uni-list');
const personalListEl = document.getElementById('personal-list');

async function fetchGithubProjects() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`);
    const data = await res.json();
    if (!Array.isArray(data)) return;

    const uniProjects = [];
    const personalProjects = [];

    for (const repo of data) {
      // Note: topics fetch করতে হলে GitHub API v3 requires separate call OR accept: application/vnd.github.mercy-preview+json
      const repoRes = await fetch(repo.url, {
        headers: { Accept: "application/vnd.github.mercy-preview+json" }
      });
      const repoData = await repoRes.json();
      const topics = repoData.topics || [];

      const projectObj = {
        id: 'gh_'+repo.id,
        title: repo.name,
        date: repo.updated_at.split('T')[0],
        url: repo.html_url,
        tags: topics
      };

      if (topics.includes('university')) uniProjects.push(projectObj);
      if (topics.includes('personal')) personalProjects.push(projectObj);
    }

    // Update lists
    renderList('uni-list', uniProjects, false);
    renderList('personal-list', personalProjects, false);

  } catch (err) {
    console.error('GitHub projects fetch error:', err);
  }
}

// Call this after your normal renderAllProjects
fetchGithubProjects();
