import React from 'react';
import {render} from 'react-dom';
import Counter from './testbutton.jsx'
import App from './test.jsx'
class App1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: 'theo',
                  };
                }
  render () {
    return (<div>
                <App />
            </div>

    );
  }
}

export default App1;
