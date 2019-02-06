import React, { Component } from 'react';
import { withAuthenticator } from 'aws-amplify-react';

class App extends Component {

  state = {
    notes: [
      { id: 1, note: 'hello world'}
    ]
  }

  render() {
    return (
      <div className="flex flex-column items-center justify-center pa3" style={{ background: 'wheat' }}>
        <h1 className="code f2-l">Amplify Note Taker</h1>
        <form className="mb3">
          <input type="text" className="pa2 f4" placeholder="write you note" />
          <button type="submit" className="pa2 f4">Add Note</button>
        </form>
        <div>
          { this.state.notes.map( item => 
            <div key={item.id} className="flex items-center">
              <li className="list pal f3">{`${item.note}`}</li>
              <button className="bg-transparent bn f4"><span>&times;</span></button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings:  true });