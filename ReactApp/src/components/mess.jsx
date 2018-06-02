import React from 'react';
import styles from './mess.css';
export default class Mess extends React.Component {

constructor(props) {
    super(props)
    this.state = {
        mess: this.props.mess,
        sender : this.props.sender,
        username : this.props.username,

    }

}
render()
{

  if (this.props.sender == this.state.username )
  {
    console.log("mess from me");
    var style = styles.messagebody2;
    var to = this.props.sender + " > " + this.props.dest + " :  ";
  }
  else if (this.props.sender == undefined){
  var  style =styles.messagebody3;
  var to = " ";
  }
  else{
      console.log("mess from other");
      var  style =styles.messagebody;
      var to = this.props.sender + " > " + this.props.username + " :  ";
  }
  return (
    <div className = {styles.list} >
    <ul  className = {style}>{to}{this.props.mess}
    </ul>
    </div>
  );
}
}
