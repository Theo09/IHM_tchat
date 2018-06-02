import React from 'react';
import styles from './list.css';
export default class Listgroup extends React.Component {

constructor(props) {
    super(props)
    this.state = {
        list : this.props.list,
    }
}
render() {
  const message = this.props.list.map((x,i) => <li className = {styles.list} key = {i}>{x}</li>);
  return (
  <div>
    <p> Groupes disponibles : </p>
    <ul>{message}</ul>
  </div>
    )
  }
}
