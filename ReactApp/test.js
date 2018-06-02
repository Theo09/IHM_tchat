var net = require('net'),
const path = require('path');
//var bcrypt = require('bcrypt');
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
//var iv = 'a2xhcgAAAAAAAAAA';
//const crypto = require("crypto");
var notice = "Notice d'utilisation :  \r\n séparer les commandes avec un : \r\n message broadcast = b:message \r\n message broadcast de groupe = bg:message \r\n message privé = s:destinataire:message \r\n liste des clients connectés = lsc \r\n liste des clients dans un groupe = lscg:nomdugroupe \r\n pour creer un groupe = cg:nomdugroupe \r\n pour rejoindre un groupe = j:nomdugroupe \r\n pour quitter un groupe = p:nomdugroupe \r\n pour transferer un fichier via le serveur = csc:destinataire:chemin du fichier \r\n pour transferer un fichier en clienttoclient = ctc:destinataire:chemin du fichier \r\n pour afficher la notice = h \r\n pour quitter le chat = q";
let db = new sqlite3.Database('database',sqlite3.OPEN_READWRITE, (err) => { //connexion a la bdd
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
io.on('connection', function(socket1) {
  //socket1 = new JsonSocket(socket); //création de la socket
  var n;
  id = id+1;
  var tg1 = [];
  var tabrep =[];
  var pseudo = "";
  var monclient = {socketclient : socket1, monid:id,name : pseudo, tg : tg1 };
  clientconnecte.push(monclient); // ajoute le client à la liste des clients connectés
  var partant = monclient.name;
  var idc = monclient.monid;
  //socket1.on('data', function(data) {
//parse les datas ici
//  console.log ("toto");


    var givenamme;
                //if (message.action == 'echangekey') //echange des clés publiques
                //{
                //  var ecdh2 = crypto.createECDH("secp256k1");
                //  var pubkey2 =ecdh2.generateKeys('base64','compressed');
                  //console.log ('la pubkey est : ' + pubkey2.length, pubkey2.toString('hex'));
                  //var userkey = message.publickey;
                  //console.log ('clé publique user ' + userkey.toString('hex'));
                  //const secret = ecdh2.computeSecret(userkey,'base64'); // genere le secret
                  //console.log ('secret 1 : '+secret.length, secret.toString('hex'));
                //  console.log("Serveur Secret: ", secret.length, secret.toString("hex"));
                  //var mess = JSON.stringify({publickey : pubkey2, action : 'echangekey'});
                  //socket1.write(mess);
                //}
                //if (message.action =='listbdd') // affiche toute les personnes presentes dans la bdd
              socket1.on('listbdd',()  {
                  db.serialize(function() {
                      db.each("SELECT name, pwd FROM user", function(err, row) {
                        console.log("BDD name : "+row.name+" pwd :"+row.pwd);
                      });
                    }  );
                    stmt.finalize();
                });
              //  if (message.action == 'newclient') //si nouveau client
                socket1.on('newclient',(message){
                  //var decryptpwd = dechiffrement(secret, iv, message.pwd)
                  var message = JSON.parse(message);
                  monclient.name = message.nickname;
                  db.serialize(function() {
                    let sql1 = 'SELECT name,pwd FROM user WHERE name = ?';
                    db.get(sql1, message.nickname, function (err, row) {
                      if (row == undefined){
                          //bcrypt.genSalt(10, function(err, salt) {
                            //bcrypt.hash(message.pwd, salt, function(err, hash) {
                              // Store hash in your password DB.
                            var stmt = db.prepare("INSERT INTO user VALUES (?,?)");
                            stmt.run(message.nickname,hash);
                          });
                        });
                  var mess = JSON.stringify({message : 'vous etes connecté! Si vous souhaitez voir la notice d utilisation entrez la commande h \r '});
                  //socket1.write(mess);
                  socket1.emit('msg',mess);
                  var n = monclient.name;
                  creerrep(n);
                  var idclient = monclient.monid;
                  clientconnecte.forEach(function(monclient){ //envoi à tous les clients
                    if(idclient!=monclient.monid){  // sauf moi
                      var info = n +" est connect";
                      var mess = JSON.stringify({message:info});
                    //  monclient.socketclient.write(mess);
                      monclient.socketclient.emit('msg',mess);
                    }

                  });

              }
                    else {
                      var mess = JSON.stringify({message : 'Pseudo déjà utilisé', action : 'logexist'});
                      //monclient.socketclient.write(mess);
                      monclient.socketclient.emit('msg',mess);
                      console.log ('non deja utilisé');}
                  });
              //  });

                  //  stmt.finalize();

            //    if (message.action == 'dejaclient') // si déja client
            socket1.on('dejaclient',(message)
                {
                  var message = JSON.parse(message);
                  monclient.name = message.nickname;
                  db.serialize(function() {

                    let sql1 = 'SELECT name,pwd FROM user WHERE name = ?';
                    db.get(sql1, message.nickname, function (err, row) {
                      if (row == undefined){ // si pas dans la table
                        var mess = JSON.stringify({message : 'Problème de login', action : 'badconnection'});
                        monclient.socketclient.emit('msg',mess);
                      console.log ('pbm login');
                      }
                    //  else {bcrypt.compare(message.pwd, row.pwd, function(err, res) {
                      //  if(res == false){console.log('pas dans la bdd'); //si pas le même mot de passe
                        //var mess = JSON.stringify({message : 'Probleme de pwd', action : 'badconnection'});
                        //monclient.socketclient.emit('msg',mess);
                      //console.log ('pbm pwd');
                      //}
                        else if (res == true) { // si bien present dans la bdd
                        console.log ('compte bien présent');
                        var toto = 0;
                        clientconnecte.forEach(function(monclient){
                          if (monclient.name==message.nickname){toto = toto + 1}
                        });
                        if (toto >=2) { // si déja connecté
                          var mess = JSON.stringify({action : 'badconnection2'});
                          monclient.socketclient.emit('msg',mess);
                          console.log ('deja conect');
                        }
                        else {
                        var mess = JSON.stringify({message : 'vous etes connecté! Si vous souhaitez voir la notice d utilisation entrez la commande h \r '});
                        monclient.socketclient.emit('msg',mess);
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
                  //  stmt.finalize();
                });
                socket1.on('broadcast',(message){
            //    if (message.action=='broadcast'){ // broadcast
                  var message = JSON.parse(message);
                  var idclient = monclient.monid;
                  clientconnecte.forEach(function(monclient){
                    if(idclient!=monclient.monid){
                      var info = "message broadcast : " +message.message;
                      var mess = JSON.stringify({message:info});
                      monclient.socketclient.emit('msg',mess);}
                    });
                  });
                  socket1.on('private',(message){
                  //else if (message.action=='private') { //message privé
                    var message = JSON.parse(message);
                    var find;
                    var present;
                    var idclient = monclient.monid;
                    var source = monclient.name;
                    clientconnecte.forEach(function(monclient){ //parcour mon tableau de client qui sont connectés
                      if ( monclient.name == message.destination){ // si la destination parmis les clients connectés
                        find = 1;
                        if(idclient!=monclient.monid){
                          var info = "message prive de " + source + ": " +message.message;
                          var mess = JSON.stringify({message:info});
                          monclient.socketclient.emit('msg',mess);}
                        }
                      });
                      if (find!=1){ // si pas dans les clients connectés
                        var info = "cet utilisateur n'est pas connect";
                        var mess = JSON.stringify({message:info});
                        socket1.emit('msg',mess);
                      }}
                    );
                      socket1.on('broadcatsGroup',(message){
                      //else if (message.action =='broadcastGroup'){ // message broadcast de groupe
                        var message = JSON.parse(message);
                        var source = monclient.name;
                        var present;
                        var idclient = monclient.monid;
                        groupe.forEach(function(mongroupe){
                          if(message.nomGroupe==mongroupe.nameg) // si trouve le groupe demandé
                          {
                            console.log ('ici');
                            {mongroupe.mg.forEach(function(monclient){
                              if(idclient!=monclient.monid )
                              {
                                var info = "message broadcast groupe de " + source + " : " + message.message;
                                var mess = JSON.stringify({message:info});
                                monclient.socketclient.emit('msg',mess);}}
                              );}
                              present=1;
                            }
                          });
                          if (present!=1){ // si le groupe pas dans la liste des groupe crée
                            var info = "Ce groupe n'existe pas";
                            var mess = JSON.stringify({message:info});
                            socket1.emit('msg',mess);
                          }
                        });
                        socket1.on('listclient',(message){
                      //  else if (message.action=='listeClient') { // lister les clients connectés
                          var message = JSON.parse(message);
                          var conn='' ;
                          clientconnecte.forEach(function(monclient){
                            conn = conn + monclient.name +" " ;
                          });
                          var info = conn + "  connectés";
                          var mess = JSON.stringify({message:info});
                          monclient.socketclient.emit('msg',mess);
                        });
                        socket1.on('listeClientGroup',(message){
                        //else if (message.action=='listeClientGroup'){ // lister tout les clients connecté dans un groupe
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
                          socket1.on('createGroup',(message){
                          //else if (message.action=='createGroup') // crée un groupe
                          //{
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
                              groupe.push(mongroupe);} //ajoute au tableau de groupe
                            });
                            socket1.on('join',(message){
                            //else if (message.action=='join') // rejoindre un groupe
                            //{
                              var message = JSON.parse(message);
                              var idclient = monclient.monid;
                              var rejoint = 0;
                              var ng = message.nomGroupe;
                              groupe.forEach(function(mongroupe){
                                if(ng==mongroupe.nameg) // si groupe demandé parmis les groupes déja existants
                                {
                                  mongroupe.mg.push(monclient); // ajout du client dans le groupe
                                  rejoint = 1;
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
                                }
                              });
                              socket1.on('help',(message){var mess = JSON.stringify({message:notice}); monclient.socketclient.emit('msg',mess)});
                              //else if (message.action =='help'){var mess = JSON.stringify({message:notice}); monclient.socketclient.write(mess);} // affichage de la notice
                              socket1.on('leave',(message){
                            //  else if (message.action=='leave') //quitter un groupe
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
                                }
                              );
                              socket1.on('uploadctc',(message){
                               //else if (message.action == 'uploadctc') // upload ctc
                               //{
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
                               socket1.on('cltserclt',(message){
                               //else if (message.action == 'cltserclt') // transfert cient-serveur-client
                               //{
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
                                     socket1.on('quit',(message){
                                //else if (message.action=='quit'){ // quitter le chat
                                  var message = JSON.parse(message);
                                  var idclient = monclient.monid;
                                  var idsup = idclient -1 ;
                                  clientconnecte.splice(idsup,1); // supprime le client des clients connectés
                                  var info = "vous etes deconnect"
                                  var mess = JSON.stringify({message:info});
                                  monclient.socketclient.emit('msg',mess);
                                  socket1.end();
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

                              });



                              socket1.on('disconnect',function(err){ //si controle c
                              var message = JSON.parse(message);
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
                                //socket1.end();
                          //  });

                                });

            function creerrep(nom){

                                   fs.mkdir(nom,function(err){
                                   if (err) {
                                      return console.error(err);
                                     }});}

             //function dechiffrement(cryptkey, iv, encryptdata) {
                //                         encryptdata = new Buffer(encryptdata, 'base64').toString('binary');

//                                         var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv),
  //                                           decoded  = decipher.update(encryptdata);

    //                                     decoded += decipher.final();
      //                                   return decoded;
        //                             }
          //    function chiffrment(cryptkey, iv, cleardata) {
            //                            var encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv),
              //                              encryptdata  = encipher.update(cleardata);

                //                        encryptdata += encipher.final();
                  //                      encode_encryptdata = new Buffer(encryptdata, 'binary').toString('base64');
                    //                    return encode_encryptdata;
                      //              }
                                    server.listen(port, function(){ console.log('Listening on port ');});
