import React from 'react';
import Chat from './chatapp.jsx'
import openSocket from 'socket.io-client';
import styles from './login.css';
import  { Redirect } from 'react-router-dom';
import {Router, Route} from 'react-router';
const socket = openSocket('http://localhost:3000');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({ username: '',
                    password: ' ',
                    listconnect: [],
                    list: ' ',
                    submitted : false,
                    socket : socket
                  });


    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
    this.pwdChangeHandler = this.pwdChangeHandler.bind(this);
    this.quit = this.quit.bind(this);
    this.connect = this.connect.bind(this);
  }
  componentDidMount(){
      this.state.socket.on('logOK',(logok) =>  {
        var donne = JSON.parse(logok);;
        var logIN = donne.logOK;
        if (logIN == true){
          console.log ("bon compte");
          this.setState({submitted: true});
        }
        if(logIN == false){
          var donne = JSON.parse(logok);
          alert(donne.message);
        }
      }
    );
  }

  send() {
    var info = JSON.stringify({ nickname : this.state.username, pwd : this.state.password});
    console.log ('dejaclient');
    this.state.socket.emit('dejaclient',info);

  }

  usernameChangeHandler(event) {
    console.log(event.target.value);
    this.setState({ username: event.target.value });
    console.log ( this.state.username);
  }

  pwdChangeHandler(event) {
    console.log(event.target.value);
    this.setState({ password: event.target.value });
  }

  createuser() {

      var info = JSON.stringify({ nickname : this.state.username, pwd : this.state.password });
      this.state.socket.emit('newclient',info);
      console.log('newclient');

    }

  usernameSubmitHandler(event) {
    event.preventDefault();
  }

  connect(){
    this.setState({username: this.state.username });
    this.setState({ password: this.state.password });
    this.send();
  }

  quit(){
    this.setState({submitted : false});
    this.state.socket.emit('quit');
  }

  render() {


    if (this.state.submitted) {

      return (
        <div>
        <button onClick={ ( ) => this.quit()} className={styles.butquit} >
            Deconnect
        </button>
        <Chat username = {this.state.username} socket = {this.state.socket}  />
        </div>
      );
    }

    return (
      <div className={styles.Login}>
      <form onSubmit={this.usernameSubmitHandler} >
        <div>
          <input
            type="text"
            onChange={this.usernameChangeHandler}
            placeholder="Enter a username..."
            required className={styles.inp}
            className={styles.inp} />
            <input
              type="password"
              onChange={this.pwdChangeHandler}
              placeholder="Enter a pwd..."
              required className={styles.inp}/>
        </div>

        <button onClick={ ( ) => this.connect()} className={styles.but} >
            Submit
        </button>
        <button onClick={ ( ) => this.createuser()} className={styles.but} >
            Create
        </button>
        </form>
      </div>
    );
  }

}

App.defaultProps = {};
export default App;
