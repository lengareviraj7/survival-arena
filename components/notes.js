// Notes Management
function loadNotes() {
    const notes = Storage.get('notes') || [];
    renderNotes(notes);
}

function renderNotes(notes) {
    const container = document.getElementById('notesList');
    
    if (notes.length === 0) {
        container.innerHTML = '<p class="empty-state">No notes yet</p>';
        return;
    }
    
    container.innerHTML = notes.map(n => `
        <div class="note-card" onclick="viewNote('${n.id}')">
            <h3>${n.title}</h3>
            <p class="note-subject">📁 ${n.subject}</p>
            <p class="note-preview">${n.content}</p>
            <div class="assignment-actions" onclick="event.stopPropagation()">
                <button class="btn-icon" onclick="editNote('${n.id}')">✏️</button>
                <button class="btn-icon" onclick="deleteNote('${n.id}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function showAddNote() {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('addNoteModal').classList.remove('hidden');
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteSubject').value = '';
    document.getElementById('noteContent').value = '';
}

function addNote(event) {
    event.preventDefault();
    
    const note = {
        id: generateId(),
        title: document.getElementById('noteTitle').value,
        subject: document.getElementById('noteSubject').value,
        content: document.getElementById('noteContent').value,
        createdAt: new Date().toISOString()
    };
    
    const notes = Storage.get('notes') || [];
    notes.push(note);
    Storage.set('notes', notes);
    
    closeModal();
    loadNotes();
}

function viewNote(id) {
    const notes = Storage.get('notes') || [];
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    alert(`${note.title}\n\n${note.content}`);
}

function editNote(id) {
    const notes = Storage.get('notes') || [];
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteSubject').value = note.subject;
    document.getElementById('noteContent').value = note.content;
    
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('addNoteModal').classList.remove('hidden');
    
    const form = document.querySelector('#addNoteModal form');
    form.onsubmit = (e) => {
        e.preventDefault();
        note.title = document.getElementById('noteTitle').value;
        note.subject = document.getElementById('noteSubject').value;
        note.content = document.getElementById('noteContent').value;
        Storage.set('notes', notes);
        closeModal();
        loadNotes();
        form.onsubmit = addNote;
    };
}

function deleteNote(id) {
    if (!confirm('Delete this note?')) return;
    
    let notes = Storage.get('notes') || [];
    notes = notes.filter(n => n.id !== id);
    Storage.set('notes', notes);
    loadNotes();
}

document.getElementById('notesSearch')?.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    let notes = Storage.get('notes') || [];
    
    if (search) {
        notes = notes.filter(n => 
            n.title.toLowerCase().includes(search) || 
            n.subject.toLowerCase().includes(search) ||
            n.content.toLowerCase().includes(search)
        );
    }
    
    renderNotes(notes);
});
