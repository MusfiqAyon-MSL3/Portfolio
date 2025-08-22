// Theme Toggle Slide + Sun/Moon Icon
const toggleCheckbox = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = document.getElementById('theme-icon');

if(localStorage.getItem('theme') === 'dark'){
  body.classList.add('dark');
  toggleCheckbox.checked = true;
  themeIcon.classList.replace('fa-sun','fa-moon');
}

toggleCheckbox.addEventListener('change', () => {
  if(toggleCheckbox.checked){
    body.classList.add('dark');
    localStorage.setItem('theme','dark');
    themeIcon.classList.replace('fa-sun','fa-moon');
  } else{
    body.classList.remove('dark');
    localStorage.setItem('theme','light');
    themeIcon.classList.replace('fa-moon','fa-sun');
  }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({behavior:'smooth'});
  });
});

// Notes Section with localStorage
const noteInput = document.getElementById('note-input');
const saveNoteBtn = document.getElementById('save-note');
const notesList = document.getElementById('notes-list');

function renderNotes() {
  notesList.innerHTML = '';
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.forEach((note,index) => {
    const noteEl = document.createElement('div');
    noteEl.classList.add('note-item');
    noteEl.innerHTML = `<span>${note}</span><button onclick="deleteNote(${index})">Delete</button>`;
    notesList.appendChild(noteEl);
  });
}

function deleteNote(index){
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.splice(index,1);
  localStorage.setItem('notes',JSON.stringify(notes));
  renderNotes();
}

saveNoteBtn.addEventListener('click', () => {
  const note = noteInput.value.trim();
  if(note){
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.push(note);
    localStorage.setItem('notes',JSON.stringify(notes));
    noteInput.value='';
    renderNotes();
  }
});

renderNotes();
