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
