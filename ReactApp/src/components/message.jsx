import React from 'react';
import styles from './message.css';
import Mess from './mess.jsx';
export default class Message extends React.Component {

constructor(props) {
    super(props)
    this.state = {
        msg: this.props.message,
        list : this.props.list,
        username : this.props.username,
    }
}

render() {
  var test = this.props.message;
  var toto = this.props.sender;
  const message = this.state.list.map((x,i) =>
  <Mess sender = {x.sender} mess = {x.mess} dest = {x.dest} username = {this.props.username}/>);
  return (
  <div className = {styles.back}>
    {message}
  </div>
    )
  }
}
