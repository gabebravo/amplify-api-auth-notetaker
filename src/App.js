import React, { useState, useEffect } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';
import { createNote, deleteNote, updateNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';
import { onCreateNote } from './graphql/subscriptions';
import _ from 'lodash';

export default function App() {

  const [state, setState] = useState({
    id: '',
    note: '',
    notes: []
  })

  async function fetchNotes() {
    const res = await API.graphql(graphqlOperation(listNotes))
    await setState({ ...state, notes: res.data.listNotes.items })
  }

  useEffect( () => {
    fetchNotes(); // THIS WILL LOAD INITIAL NOTES
    const createNoteListener = API.graphql(graphqlOperation(onCreateNote)).subscribe({
      next: noteData => { // THIS WILL FIRE ON EACH CREATE NOTE
        const newNote = noteData.value.data.onCreateNote;
        setState( prevState => { // IMP : THIS IS HOW TO ACCESS PREV STATE FOR AN UPDATE
          const prevNotes = [...prevState.notes].filter( note => note.id !== newNote.id );
          const updatedNotes = [...prevNotes, newNote]; 
          return { ...prevState, notes: updatedNotes }
        })
      }
    })
    return () => {
      createNoteListener.unsubscribe();
    }
  }, []) // MIMICS CDM

  async function handleSubmit(ev){
    ev.preventDefault();
    if( state.id ) {
      const res = await API.graphql(graphqlOperation(updateNote, { 
        input: { id: state.id, note: state.note }
      }))
      const newNote = res.data.updateNote;
      const index = _.findIndex([...state.notes], { id: newNote.id });
      const updatedNotes = [ ...state.notes.slice(0, index), newNote, ...state.notes.slice(index + 1)]
      setState({ id: '', note: '', notes: updatedNotes })
    } else {
      await API.graphql(graphqlOperation(createNote, { 
        input: { note: state.note }
      }))
      // __NO NEED TO SPREAD IN THE NEW NOTE TO UPDATE THE UI ON CREATE >> LINE 29 REALTIME
        // const res = await API.graphql(graphqlOperation(createNote, { 
        //   input: { note: state.note }
        // }))
        // const newNote = res.data.createNote;
        // setState({ note: '', notes: [...state.notes, newNote ] })
      setState({ ...state, note: '' })
    }
  }

  async function handleDelete(noteId){
    const res = await API.graphql(graphqlOperation(deleteNote, { 
      input: { id: noteId }
    }))
    const deletedNoteId = res.data.deleteNote.id;
    const newNotes = [...state.notes].filter( note => note.id !== deletedNoteId ) ;
    setState({ ...state, note: '', notes: newNotes })
  }

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-l">Amplify Note Taker</h1>
      <form className="mb3" onSubmit={handleSubmit}>
        <input type="text" value={state.note} className="pa2 f4" placeholder="write you note" onChange={ e => setState({ ...state, note: e.target.value }) }/>
        <button type="submit" className="pa2 f4">{state.id ? 'Update Note' : 'Add Note' }</button>
      </form>
      <div>
        { state.notes ? state.notes.map( item => 
          <div key={item.id} className="flex items-center">
            <li onClick={() => setState({ ...state, note: item.note, id: item.id })} className="list pa1t f3">{`${item.note}`}</li>
            <button className="bg-transparent bn f4" onClick={() => handleDelete(item.id)}><span>&times;</span></button>
          </div>
        ): null}
      </div>
    </div>
  );
}

withAuthenticator(App, { includeGreetings:  true });