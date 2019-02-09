import React, { useState } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';
import { createNote } from './graphql/mutations';

export default function App() {

  const [state, setState] = useState({
    note: '',
    notes: [
    ]
  })

  function handleChange(ev){
    ev.preventDefault()
    API.graphql(graphqlOperation(createNote, { 
      input: { note: state.note }
    }))
  }

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-l">Amplify Note Taker</h1>
      <form className="mb3" onSubmit={handleChange}>
        <input type="text" value={state.note} className="pa2 f4" placeholder="write you note" onChange={ e => setState({ ...state, note: e.target.value }) }/>
        <button type="submit" className="pa2 f4">Add Note</button>
      </form>
      <div>
        {/* { this.state.notes.map( item => 
          <div key={item.id} className="flex items-center">
            <li className="list pa1t f3">{`${item.note}`}</li>
            <button className="bg-transparent bn f4"><span>&times;</span></button>
          </div>
        )} */}
      </div>
    </div>
  );
}

withAuthenticator(App, { includeGreetings:  true });