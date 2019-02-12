import React, { useState, useEffect } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';
import { createNote, deleteNote, updateNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';
import _ from 'lodash';

export default function App() {

  const [state, setState] = useState({
    id: '',
    note: '',
    notes: []
  })

  async function fetchNotes() {
    const res = await API.graphql(graphqlOperation(listNotes))
    setState({ ...state, notes: res.data.listNotes.items })
  }

  useEffect( () => {
    fetchNotes();
  }, [])

  async function handleSubmit(ev){
    ev.preventDefault();
    if( state.id ) {
      const res = await API.graphql(graphqlOperation(updateNote, { 
        input: { id: state.id, note: state.note }
      }))
      const newNote = res.data.updateNote;
      const index = _.findIndex([...state.notes], { id: newNote.id });
      state.notes.splice(index, 1, newNote);
      setState({ ...state, id: '', note: '' })
    } else {
      const res = await API.graphql(graphqlOperation(createNote, { 
        input: { note: state.note }
      }))
      const newNote = res.data.createNote;
      setState({ note: '', notes: [...state.notes, newNote ] })
    }
  }

  async function handleDelete(noteId){
    const res = await API.graphql(graphqlOperation(deleteNote, { 
      input: { id: noteId }
    }))
    const deletedNoteId = res.data.deleteNote.id;
    const newNotes = [...state.notes].filter( note => note.id !== deletedNoteId ) ;
    setState({ note: '', notes: newNotes })
  }

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-l">Amplify Note Taker</h1>
      <form className="mb3" onSubmit={handleSubmit}>
        <input type="text" value={state.note} className="pa2 f4" placeholder="write you note" onChange={ e => setState({ ...state, note: e.target.value }) }/>
        <button type="submit" className="pa2 f4">{state.id ? 'Update Note' : 'Add Note' }</button>
      </form>
      <div>
        { state.notes.map( item => 
          <div key={item.id} className="flex items-center">
            <li onClick={() => setState({ ...state, note: item.note, id: item.id })} className="list pa1t f3">{`${item.note}`}</li>
            <button className="bg-transparent bn f4" onClick={() => handleDelete(item.id)}><span>&times;</span></button>
          </div>
        )}
      </div>
    </div>
  );
}

withAuthenticator(App, { includeGreetings:  true });