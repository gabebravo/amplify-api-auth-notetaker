import React, { useState, useEffect } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';
import { createNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';

export default function App() {

  const [state, setState] = useState({
    note: '',
    notes: []
  })

  useEffect( async () => { // mimics componentDidMount
    const res = await API.graphql(graphqlOperation(listNotes))
    setState({ ...state, notes: res.data.listNotes.items })
  }, [])

  async function handleChange(ev){
    ev.preventDefault()
    const res = await API.graphql(graphqlOperation(createNote, { 
      input: { note: state.note }
    }))
    const newNote = res.data.createNote;
    setState({ note: '', notes: [...state.notes, newNote ] })
  }

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-l">Amplify Note Taker</h1>
      <form className="mb3" onSubmit={handleChange}>
        <input type="text" value={state.note} className="pa2 f4" placeholder="write you note" onChange={ e => setState({ ...state, note: e.target.value }) }/>
        <button type="submit" className="pa2 f4">Add Note</button>
      </form>
      <div>
        { state.notes.map( item => 
          <div key={item.id} className="flex items-center">
            <li className="list pa1t f3">{`${item.note}`}</li>
            <button className="bg-transparent bn f4"><span>&times;</span></button>
          </div>
        )}
      </div>
    </div>
  );
}

withAuthenticator(App, { includeGreetings:  true });