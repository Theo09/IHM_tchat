import React from 'react';
import Listgroup from './listgroup.jsx'
import openSocket from 'socket.io-client';
import styles from './tchat.css';
import Message from './message.jsx';
import Listutil from './listutil.jsx';
import  { Redirect } from 'react-router-dom'
export default class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            txt: " ",
            msg: "",
            dest: "",
            dest1: "",
            username: this.props.username,
            listconnect: [],
            info: "",
            list : "",
            sender : "",
            socket : this.props.socket,
            listmsg : [],
            group : "",
            grouplist : [],

        }

    }

    componentDidMount(){
        this.state.socket.emit('listclient');
        this.state.socket.emit('listgroup');
        this.state.socket.on('msg',(msg) =>  {
        var donne = JSON.parse(msg);
        this.setState({info:donne.message});
        var sender = donne.sender;
        var mess = donne.message;
        var dest = this.state.dest;
        var obj ={sender,mess,dest};
        this.state.listmsg.push(obj);
        this.setState({sender:donne.sender});
      });
      this.state.socket.on('list',(data) =>  {
      var donne = JSON.parse(data);
      this.setState({listconnect:donne.tab});
    }
      );

    this.state.socket.on('lgroup',(data) =>  {
    var donne = JSON.parse(data);
    this.setState({grouplist:donne.message});
      }
    );
  }

    joingroup(){
      console.log("join");
      var info = JSON.stringify({source: this.state.username,nomGroupe :this.state.group});
      this.state.socket.emit('join',info);

    }

    creategoup(){
      console.log("cgrategroup");
      console.log(this.state.grouplist);
      var info = JSON.stringify({source: this.state.username,nomGroupe :this.state.group});
      this.state.socket.emit('createGroup',info);
      this.state.socket.emit('listgroup');
    }

    quitgroup(){
      console.log("quit");
      var info = JSON.stringify({source: this.state.username,nomGroupe :this.state.group});
      this.state.socket.emit('leave',info);
    }

    sendgroup(){
      if (this.state.msg == 'list'){
      console.log("listclient");
      var info = JSON.stringify({source: this.state.username,nomGroupe :this.state.dest,message:this.state.msg});
      this.state.socket.emit('listeClientGroup',info);
      }
      else{
      console.log("broadcastgroup");
      var info = JSON.stringify({source: this.state.username,nomGroupe :this.state.group,message:this.state.msg});
      this.state.socket.emit('broadcastGroup',info);
    }
    }

    increment() {
        if (this.state.dest == "")
        {
          console.log("broadcast");
          var info = JSON.stringify({message:this.state.msg});
          this.state.socket.emit('broadcast',info);
      }
        else {
        console.log('private');
        var info = JSON.stringify({source: this.state.username,destination:this.state.dest,message:this.state.msg});
        this.state.socket.emit('private',info);
      }
        this.setState({
            txt: this.state.msg,
            dest1: this.state.dest
        })
    }
    handleChange(event) {
  this.setState({msg: event.target.value})
}
handleChange1(event) {
this.setState({dest: event.target.value})
}
handleChange2(event) {
this.setState({group: event.target.value})
}

    render() {
        var test = this.props.username;
        var tab = this.props.listconnect;
        var msg = this.state.info;
        var send = this.state.sender;
        return (
            <div className={styles.maincontainer}>
            <h1> Compte de {test} </h1>
            <div className={styles.list}>
              <Listutil list = {this.state.listconnect} />
              <Listgroup list = {this.state.grouplist} />
              <input type="text" name="groupe" value={this.state.group}   placeholder="Name's group"
              onChange={this.handleChange2.bind(this)}
              className = {styles.inpgroup}
                />
              <button onClick={ ( ) => this.creategoup() } className={styles.butgroupe} >
                New Group
                </button>
              <button onClick={ ( ) => this.joingroup() } className={styles.butjoingroupe} >
                Join Group
              </button>
            <button onClick={ ( ) => this.quitgroup() } className={styles.butquitgroupe} >
            Quit Group
            </button>
            </div>
              <div className = {styles.test}>
                <Message message = {msg} sender = {send} list = {this.state.listmsg} username = {this.state.username} />
              </div>
                <input type="text" name="title" value={this.state.msg}   placeholder="Enter a msg"
                  onChange={this.handleChange.bind(this)}
                  className={styles.inpmsg}
                  />
                  <input type="text" name="dest" value={this.state.dest}   placeholder="Enter a dest"
                    onChange={this.handleChange1.bind(this)}
                    className={styles.inpdest}/>
                <button onClick={ ( ) => this.increment() } className={styles.but} >
                    Send
                </button>
                <button onClick={ ( ) => this.sendgroup() } className={styles.butsendgroupe} >
                    Send to group
                </button>
            </div>
        )
    }
}
