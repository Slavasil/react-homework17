import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  let [state, setState] = useState({loading: true, notes: []});
  let noteContentInput = useRef();

  useEffect(function() {
    setState((oldState) => {
      return {...oldState, loading: true}
    });
    refreshNotes();
  }, []);

  function createNote(content) {
    fetch('http://localhost:7777/notes', {
      method: 'POST',
      body: JSON.stringify(
        {id: 0, content: content}
      )
    }).then((response) => {
      refreshNotes();
    });
  }
  function refreshNotes() {
    fetch('http://localhost:7777/notes').then((response) => {
      if (response.ok) {
        response.json().then((body)=>{
          setState((oldState) => {
            return {...oldState, loading: false, notes: body};
          });
        });
      }
    });
  }
  function deleteNote(id) {
    fetch('http://localhost:7777/notes/'+id, {
      method: 'DELETE'
    }).then((response)=>{
      refreshNotes();
    });
  }

  return (
    <div className="App">
      <div className="notes-header">
        <h1>Заметки</h1>
        <button onClick={refreshNotes}>Обновить</button>
      </div>
      <div className="notes">
        {state.loading ? 'Загрузка' : 
          state.notes.length > 0 ? state.notes.map((note) => {
          return (
            <div key={note.id} className="note-container">
              <div className="note">
                {note.content}
              </div>
              <button className="note-button-delete" onClick={()=>deleteNote(note.id)}>X</button>
            </div>
          );
          }) : "Здесь пока ничего нет."
        }
      </div>
      <div className="note-adding-form">
        <label htmlFor="new-note-content">Новая заметка</label>
        <br/>
        <textarea id="new-note-content" ref={noteContentInput}></textarea>
        <br/>
        <button onClick={()=>{createNote(noteContentInput.current.value); noteContentInput.current.value=""}}>Добавить</button>
      </div>
    </div>
  );
}

export default App;
