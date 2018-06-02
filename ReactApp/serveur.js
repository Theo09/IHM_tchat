var net = require('net');
const path = require('path');
var bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
var fs = require ('fs');
var clientconnecte=[];
var id = 0;
var numgroup = 0;
var groupe=[];
var mongroupe=[];
var name;
var idt=0;
var sup = 0;
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const port = 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
var notice = "Notice d'utilisation : \r\n message broadcast = message + destination vide + send \r\n message broadcast de groupe = message + destination + send to group  \r\n liste des clients dans un groupe = list + dest(mettre le nom du groupe) + send to group ";
let db = new sqlite3.Database('database',sqlite3.OPEN_READWRITE, (err) => { //connexion a la bdd
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
io.on('connection', function(socket1) { // a la connexion

  var n;
  id = id+1;
  var tg1 = [];
  var tabrep =[];
  var pseudo = "";
  var monclient = {socketclient : socket1, monid:id,name : pseudo, tg : tg1 };
  clientconnecte.push(monclient); // ajoute le client à la liste des clients connectés
  var partant = monclient.name;
  var idc = monclient.monid;
  var givenamme;
              socket1.on('listbdd',(message) =>  { // affiche toute les personnes presentes dans la bdd
                  db.serialize(function() {
                      db.each("SELECT name, pwd FROM user", function(err, row) {
                        console.log("BDD name : "+row.name+" pwd :"+row.pwd);
                      });
                    }  );
                    var info = "testOK";
                    var mess = JSON.stringify({message:info});
                    socket1.emit('msg',mess);
                });
                socket1.on('newclient',(message) =>{ // si nouveau client
                  var message = JSON.parse(message);
                  monclient.name = message.nickname;
                  db.serialize(function() {
                    let sql1 = 'SELECT name,pwd FROM user WHERE name = ?';
                    db.get(sql1, message.nickname, function (err, row) {
                      if (row == undefined){
                          bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(message.pwd, salt, function(err, hash) {
                              // Store hash in your password DB.
                            var stmt = db.prepare("INSERT INTO user VALUES (?,?)");
                            stmt.run(message.nickname,message.pwd);
                          });
                        });
                  var mess = JSON.stringify({message : 'vous etes connecté!', logOK : true});
                  socket1.emit('logOK',mess);
                  socket1.emit('msg',mess);
                  var n = monclient.name;
                  creerrep(n);
                  var idclient = monclient.monid;
                  clientconnecte.forEach(function(monclient){ //envoi à tous les clients
                    if(idclient!=monclient.monid){  // sauf moi
                      var info = n +" est connect";
                      var mess = JSON.stringify({message:info});
                      monclient.socketclient.emit('msg',mess);
                    }
                  });
                }
                    else {
                      var mess = JSON.stringify({message : 'Pseudo déjà utilisé', action : 'logexist', logOK : false});
                      monclient.socketclient.write(mess);
                      monclient.socketclient.emit('logOK',mess);
                      console.log ('non deja utilisé');}
                  });
                });
                });
            socket1.on('dejaclient',(message) => //si déja client
            {
              var message = JSON.parse(message);
              monclient.name = message.nickname;
              db.serialize(function() {
                let sql1 = 'SELECT name,pwd FROM user WHERE name = ?';
                db.get(sql1, message.nickname, function (err, row) {
                  if (row == undefined){ // si pas dans la table
                    var mess = JSON.stringify({message : 'Problème de login', action : 'badconnection',logOK : false});
                    monclient.socketclient.emit('logOK',mess);
                    console.log ('pbm login');
                  }
                  else {
                    bcrypt.compare(message.pwd, row.pwd, function(err, res) {
                    if(row.pwd != message.pwd){ //si pas le même mot de passe
                    var mess = JSON.stringify({message : 'Probleme de pwd', action : 'badconnection', logOK : false});
                    monclient.socketclient.emit('logOK',mess);
                    console.log ('pbm pwd');
                  }
                    else if (row.pwd == message.pwd){  // si bien present dans la bdd
                    console.log ('compte bien présent');
                    var toto = 0;
                    clientconnecte.forEach(function(monclient){
                      if (monclient.name==message.nickname){toto = toto + 1}
                    });
                    if (toto >=2) { // si déja connecté
                      var mess = JSON.stringify({message : 'deja connect',logOK : false});
                      monclient.socketclient.emit('logOK',mess);
                      console.log ('deja conect');
                    }
                    else {
                    var mess = JSON.stringify({message : 'vous etes connecté! Si vous souhaitez voir la notice d utilisation entrez la commande h ',logOK : true});
                    socket1.emit('logOK',mess);
                    var n = monclient.name;
                    var idclient = monclient.monid;
                    clientconnecte.forEach(function(monclient){ //envoi à tous les clients
                      if(idclient!=monclient.monid){  // sauf moi
                        var info = n +" est connect";
                        var mess = JSON.stringify({message:info});
                        monclient.socketclient.emit('msg',mess);}
                      });
                    }
                  }
                });}
              });
                });
            }
          );
                socket1.on('broadcast',(message) => { //broadcasr
                  var message = JSON.parse(message);
                  var idclient = monclient.monid;
                  clientconnecte.forEach(function(monclient){
                    if(idclient!=monclient.monid){
                      var info = "message broadcast : " +message.message;
                      var mess = JSON.stringify({message:info});
                      monclient.socketclient.emit('msg',mess);}
                    });
                    var info = "message broadcast : " +message.message;
                    var mess = JSON.stringify({message:info});
                    socket1.emit('msg',mess);
                  });
                  socket1.on('private',(message) =>{  //message privé
                    var message = JSON.parse(message);
                    var find;
                    var present;
                    var idclient = monclient.monid;
                    var source = monclient.name;
                    clientconnecte.forEach(function(monclient){ //parcour mon tableau de client qui sont connectés
                      if ( monclient.name == message.destination){ // si la destination parmis les clients connectés
                        find = 1;
                        if(idclient!=monclient.monid){
                          var info = message.message;
                          var mess = JSON.stringify({message:info,sender:source});
                          monclient.socketclient.emit('msg',mess);
                          socket1.emit('msg',mess);}
                        }
                      });
                      if (find!=1){ // si pas dans les clients connectés
                        var info = "cet utilisateur n'est pas connect";
                        var mess = JSON.stringify({message:info});
                        socket1.emit('msg',mess);
                      }}
                    );
                      socket1.on('broadcastGroup',(message) =>{  // message broadcast de groupe
                        var message = JSON.parse(message);
                        var source = monclient.name;
                        var present;
                        var idclient = monclient.monid;
                        groupe.forEach(function(mongroupe){
                          if(message.nomGroupe==mongroupe.nameg) // si trouve le groupe demandé
                          {
                            {mongroupe.mg.forEach(function(monclient){
                              if(idclient!=monclient.monid )
                              {
                                var info = "message broadcast groupe de " + source + " : " + message.message;
                                var mess = JSON.stringify({message:info});
                                monclient.socketclient.emit('msg',mess);}}
                              );}
                              present=1;
                              var info = "message broadcast groupe de " + source + " : " + message.message;
                              var mess = JSON.stringify({message:info});
                              socket1.emit('msg',mess);
                            }
                          });
                          if (present!=1){ // si le groupe pas dans la liste des groupe crée
                            var info = "Ce groupe n'existe pas";
                            var mess = JSON.stringify({message:info});
                            socket1.emit('msg',mess);
                          }
                        });
                        socket1.on('listclient',() =>{  // lister les clients connectés
                          var tab = [];
                          var conn='' ;
                          clientconnecte.forEach(function(monclient){
                            conn = conn +","+ monclient.name +"," ;
                            tab.push(monclient.name);
                          });
                          var info = conn + "  connectés";
                          var mess = JSON.stringify({message:info,tab : tab });
                          clientconnecte.forEach(function(monclient){
                            monclient.socketclient.emit('list',mess);
                            });
                        });
                        socket1.on('listeClientGroup',(message) =>{ // lister tout les clients connecté dans un groupe
                          var message = JSON.parse(message);
                          var info ;
                          var nclient = monclient.name;
                          groupe.forEach(function(mongroupe){
                            if (message.nomGroupe == mongroupe.nameg){
                              var lcn = ' ';
                              mongroupe.mg.forEach(function(monclient1){
                                lcn = lcn + monclient1.name +' ';
                                info ="Les membres de ce groupe sont : " + lcn  ;});
                              }
                                                          });
                            var mess = JSON.stringify({message:info});
                            monclient.socketclient.emit('msg',mess);
                          });
                          socket1.on('listgroup',(message)=>{
                            var tab = [];
                            groupe.forEach(function(mongroupe){
                              tab.push(mongroupe.nameg);
                            });
                            var mess = JSON.stringify({message:tab});
                            clientconnecte.forEach(function(monclient){
                              monclient.socketclient.emit('lgroup',mess);
                              });
                          });
                          socket1.on('createGroup',(message) =>{ // crée un groupe
                            var message = JSON.parse(message);
                            var tabg = [];
                            var gexist = 0;
                            groupe.forEach(function(mongroupe){
                              if(message.nomGroupe==mongroupe.nameg) // si un groupe du même nom à déja été crée
                              {
                                var info ="Ce groupe existe deja";
                                var mess = JSON.stringify({message:info});
                                monclient.socketclient.emit('msg',mess);
                                gexist=1;
                              }
                            });
                            if (gexist==0){ // si pas de groupe similaire existant
                              mongroupe={idgroup : numgroup,nameg:message.nomGroupe,mg:tabg}; // création
                              numgroup=numgroup+1;
                              groupe.push(mongroupe);}
                              console.log("groupe créer"); //ajoute au tableau de groupe
                            });
                            socket1.on('join',(message) =>{ // rejoindre un groupe
                            console.log("join");
                              var message = JSON.parse(message);
                              var idclient = monclient.monid;
                              var rejoint = 0;
                              var ng = message.nomGroupe;
                              groupe.forEach(function(mongroupe){
                                if(ng==mongroupe.nameg) // si groupe demandé parmis les groupes déja existants
                                {
                                  mongroupe.mg.push(monclient); // ajout du client dans le groupe
                                  rejoint = 1;
                                  console.log("groupe rejoint");
                                }
                              });
                              if ( rejoint ==0) // si groupe n'existe pas
                              {
                                var info ="Ce groupe n'existe pas";
                                var mess = JSON.stringify({message:info});
                                monclient.socketclient.emit('msg',mess);
                              }
                              if (rejoint == 1) // si ajout dans un groupe à été réussi
                              { var nc = monclient.name;
                                var ng = message.nomGroupe;
                                clientconnecte.forEach(function(monclient){ // prévient les autres clients
                                  if(idclient!=monclient.monid){
                                    var info = nc +" est connecté au groupe : " + ng;
                                    var mess = JSON.stringify({message:info});
                                    monclient.socketclient.emit('msg',mess);}
                                  });
                                  var info = nc +" est connecté au groupe : " + ng;
                                  var mess = JSON.stringify({message:info});
                                  socket1.emit('msg',mess);
                                }
                              });
                              socket1.on('help',(message) =>{var mess = JSON.stringify({message:notice}); monclient.socketclient.emit('msg',mess)}); // affichage de la notice
                              socket1.on('leave',(message) => //quitter un groupe
                              {
                                var message = JSON.parse(message);
                                var i= 0;
                                groupe.forEach(function(mongroupe){
                                  if (message.nomGroupe==mongroupe.nameg){
                                    mongroupe.mg.forEach(function(monclient){
                                      if(message.source == monclient.name){
                                        mongroupe.mg.splice(i,1); // retire le client du groupe
                                      }
                                      i=i+1;
                                    });
                                  }
                                }  );
                                var idc = monclient.monid;
                                clientconnecte.forEach(function(monclient){ // prévient les autres clients connectés
                                  if(idc!=monclient.monid){
                                    var info = message.source +" a quitté le groupe : " + message.nomGroupe;
                                    var mess = JSON.stringify({message:info});
                                    monclient.socketclient.emit('msg',mess);}
                                  });
                                  var info = message.source +" a quitté le groupe : " + message.nomGroupe;
                                  var mess = JSON.stringify({message:info});
                                  socket1.emit('msg',mess);
                                }
                              );
                              socket1.on('uploadctc',(message) =>{
                                var message = JSON.parse(message);
                                 var idclient = monclient.monid;
                                 var mess = JSON.stringify({action : 'downloadctc',numeroport:message.numeroport,serveuradd : message.serveuradd, titre : message.nomfichier});
                                 clientconnecte.forEach(function(monclient){ //parcour mon tableau de client qui sont connectés
                                        if ( monclient.name == message.destinataire){ // si la destination parmis les clients connectés
                                          if(idclient!=monclient.monid ){
                                             monclient.socketclient.emit('msg',mess);}
                                           }
                                        });
                               });
                               socket1.on('cltserclt',(message) =>{
                                  var message = JSON.parse(message);
                                  var test ;
                                  var nrep = monclient.name ;
                                  var nomfichier = path.basename(message.nomfichier);
                                  var chemin = nrep+'/'+nomfichier;
                                  var net = require('net');
                                  var serverdown = net.createServer();
                                  serverdown.listen();
                                  var server1 = net.createServer();
                                  server1.listen();
                                  var numport = server1.address().port;
                                  var adr = server1.address().address;
                                  var mess = JSON.stringify({action : 'uploadready',numeroport:numport,serveuradd : adr});
                                  monclient.socketclient.sendMessage (mess);
                                  server1.on('connection',function(upsocket){
                                  var fichierrecu = fs.createWriteStream(chemin);
                                  upsocket.pipe(fichierrecu);
                                  upsocket.on('end',function(){
                                    upsocket.end();
                                    var numport = serverdown.address().port;
                                    var adr = serverdown.address().address;
                                    var idclient = monclient.monid;
                                    var mess = JSON.stringify({action : 'downloadready',numeroport:numport,serveuradd : adr, titre : nomfichier});
                                    clientconnecte.forEach(function(monclient){ //parcour mon tableau de client qui sont connectés
                                           if ( monclient.name == message.destinataire){ // si la destination parmis les clients connectés
                                             if(idclient!=monclient.monid ){
                                                monclient.socketclient.emit('msg',mess);}
                                              }
                                           });
                                    serverdown.on('connection',function(downsocket){
                                    var fichierenvoyer = fs.createReadStream(chemin);
                                    fichierenvoyer.pipe(downsocket);
                                          });
                                        });
                                          });
                                     });
                                     socket1.on('quit',(message) =>{ // quitter le chat
                                  var idclient = monclient.monid;
                                  var idsup = idclient -1 ;
                                  clientconnecte.splice(idsup,1); // supprime le client des clients connectés
                                  var info = "vous etes deconnect"
                                  var mess = JSON.stringify({message:info});
                                  monclient.socketclient.emit('msg',mess);
                                  var nc = monclient.name;
                                  var t = monclient.name;
                                  var pres =0;
                                  var i= 0;
                                  groupe.forEach(function(mongroupe){
                                    var i= 0;
                                    var ng = '';
                                    mongroupe.mg.forEach(function(monclient){
                                      if(t == monclient.name){
                                        mongroupe.mg.splice(i,1);
                                        pres =1;
                                        ng = ng + mongroupe.nameg; // supprime des groupes dont il est présent
                                      }
                                      i=i+1;
                                    });
                                    if (pres == 1)  { // prévient que le client à quitter le chat
                                      clientconnecte.forEach(function(monclient){
                                        if(idc!=monclient.monid){
                                          var info = t +" a quitter le groupe : " + ng;
                                          var mess = JSON.stringify({message:info});
                                          monclient.socketclient.emit('msg',mess);}
                                        });
                                      }
                                    });
                                    var tab = [];
                                    clientconnecte.forEach(function(monclient){
                                      if(idclient!=monclient.monid){
                                        tab.push(monclient.name);
                                        var info2 = nc +" est deconnect"
                                        var mess = JSON.stringify({message:info2});
                                      }
                                      });
                                      var mess1 = JSON.stringify({tab : tab });
                                      clientconnecte.forEach(function(monclient){
                                        if(idclient!=monclient.monid){
                                        monclient.socketclient.emit('list',mess1);
                                      }
                                        });
                                        socket1.disconnect();
                                }
                              );
                              socket1.on('disconnect',() =>{ //si controle c
                              console.log('user disconnected');
                              var idclient = monclient.monid;
                              var idsup = idclient -1 ;
                              clientconnecte.splice(idsup,1); // supprime le client des clients connectés
                              var info = "vous etes deconnect"
                              var mess = JSON.stringify({message:info});
                              monclient.socketclient.emit('msg',mess);
                              var nc = monclient.name;
                              var t = monclient.name;
                              var pres =0;
                              var i= 0;
                              groupe.forEach(function(mongroupe){
                                var i= 0;
                                var ng = '';
                                mongroupe.mg.forEach(function(monclient){
                                  if(t == monclient.name){
                                    mongroupe.mg.splice(i,1);
                                    pres =1;
                                    ng = ng + mongroupe.nameg; // supprime des groupes dont il est présent
                                  }
                                  i=i+1;
                                });
                                if (pres == 1)  { // prévient que le client à quitter le chat
                                  clientconnecte.forEach(function(monclient){
                                    if(idc!=monclient.monid){
                                      var info = t +" a quitter le groupe : " + ng;
                                      var mess = JSON.stringify({message:info});
                                      monclient.socketclient.emit('msg',mess);}
                                    });
                                  }
                                });
                                clientconnecte.forEach(function(monclient){
                                  if(idclient!=monclient.monid){
                                    var info2 = nc +" est deconnect"
                                    var mess = JSON.stringify({message:info2});
                                    monclient.socketclient.emit('msg',mess)};
                                  });
                                }
                                );
                                });

            function creerrep(nom){
                                   fs.mkdir(nom,function(err){
                                   if (err) {
                                      return console.error(err);
                                     }});}

                                    server.listen(port, function(){ console.log('Listening on port ');});
