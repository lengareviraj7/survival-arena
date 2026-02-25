// Notes Management

function loadNotes() {
    const notes = getNotes();
    renderNotes(notes);
}

function renderNotes(notes) {
    const container = document.getElementById('notesList');
    
    if (notes.length === 0) {
        container.innerHTML = '<p class="empty-state">No notes yet</p>';
        return;
    }
    
    // Sort by updated date
    const sortedNotes = sortByDate(notes, 'updatedAt', false);
    
    container.innerHTML = sortedNotes.map(note => `
        <div class="note-card" data-id="${note.id}" onclick="viewNote('${note.id}')">
            <h3>${escapeHtml(note.title)}</h3>
            <p class="note-subject">📁 ${escapeHtml(note.subject)}</p>
            <p class="note-preview">${escapeHtml(truncateText(note.content, 150))}</p>
            <div class="note-footer">
                <span class="note-date">${formatDate(note.updatedAt)}</span>
                <div class="note-actions" onclick="event.stopPropagation()">
                    <button class="btn-icon" onclick="editNote('${note.id}')" title="Edit">✏️</button>
                    <button class="btn-icon" onclick="deleteNoteConfirm('${note.id}')" title="Delete">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
    
    staggerAnimation('.note-card', 50);
}

function addNote(event) {
    event.preventDefault();
    
    const title = document.getElementById('noteTitle').value;
    const subject = document.getElementById('noteSubject').value;
    const content = document.getElementById('noteContent').value;
    
    const note = {
        title,
        subject,
        content
    };
    
    addNote(note);
    showNotification('Note saved successfully!', 'success');
    
    closeModal();
    loadNotes();
    
    event.target.reset();
}

function viewNote(id) {
    const note = getNotes().find(n => n.id === id);
    if (!note) return;
    
    // Create a view modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content modal-large">
            <h3>${escapeHtml(note.title)}</h3>
            <p class="note-subject">📁 ${escapeHtml(note.subject)}</p>
            <div class="note-content-view">${escapeHtml(note.content).replace(/\n/g, '<br>')}</div>
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="editNote('${note.id}'); this.closest('.modal').remove();">Edit</button>
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove(); closeModal();">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('modalOverlay').classList.remove('hidden');
    modal.classList.remove('hidden');
}

function editNote(id) {
    const note = getNotes().find(n => n.id === id);
    if (!note) return;
    
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteSubject').value = note.subject;
    document.getElementById('noteContent').value = note.content;
    
    const form = document.querySelector('#addNoteModal form');
    form.onsubmit = (e) => {
        e.preventDefault();
        updateNote(id, {
            title: document.getElementById('noteTitle').value,
            subject: document.getElementById('noteSubject').value,
            content: document.getElementById('noteContent').value
        });
        showNotification('Note updated!', 'success');
        closeModal();
        loadNotes();
        form.onsubmit = addNote;
    };
    
    showModal('addNoteModal');
}

function deleteNoteConfirm(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        deleteNote(id);
        showNotification('Note deleted', 'info');
        loadNotes();
    }
}

// Search functionality
document.getElementById('notesSearch')?.addEventListener('input', debounce((e) => {
    const searchTerm = e.target.value;
    let notes = getNotes();
    
    if (searchTerm) {
        notes = filterBySearch(notes, searchTerm, ['title', 'subject', 'content']);
    }
    
    renderNotes(notes);
}, 300));
