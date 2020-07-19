/*
 * webSocketServer.js
 * Manage the websocket server and clients.
 */

const WebSocket = require('ws');
const Player = require('./Player');
const UserInput = require('./UserInput');
const World = require('./World.js');
const Messaging = require('./Messaging.js');
const app = require('../app');

var world = new World();

class WebSocketServer {
    constructor(wssOptions) {
        this.playerClients = []
        this.wss = new WebSocket.Server(wssOptions);
        this.wss.on('connection', this.onNewConnection.bind(this))
        this.playerObj = new Player();
        this.playerObj.currentRoom = world.getRoom(0); //room1
    }

    onNewConnection(webSocketClient) {
      /* Bind to a general message processor until we receive the initialization request */
      webSocketClient.on('message', WebSocketServer.prototype.onMessageFromNewClient.bind(this, webSocketClient))
    }

    sendToPlayerClients(message) {
      for (var client in this.playerClients) {
        client.send(message)
      }
    }

    onMessageFromNewClient(ws, message) {
      try {
        var data = JSON.parse(message)
        var response = this._processInitializationCommand(ws, data)
        ws.send(JSON.stringify(response))
      }
      catch (err) {
        console.error("Error while parsing JSON message from client.", err)
        return
      }
    }

    _addPlayerClient(ws) {
      this.playerClients.push(ws)
      ws.on('message', WebSocketServer.prototype.onMessageFromPlayer.bind(this, ws))      
      console.log("Added player")  
    }

    _processInitializationCommand(ws, data) {
      var player = this.playerObj; //TODO: get specific player from game
      var userInput = new UserInput(data["playerInput"]); //TODO: Verify data
      
      var response = new Messaging.ServerMessage();
      response.setPlayerInput(data["playerInput"]);

      if (data.playerId) {
        //Initial command - send room context to player
        var msg = new Messaging.ConsoleOutput();
        msg.setResponseText(player.getCurrentRoom().getShortDescription());
        response.appendConsoleOutput(msg);
      }

      //will need initialization of sockets later
      //for now just go straight through to command parsing
      for (var i = 0; i < userInput.countActions(); i++) {
        var msg = player.process_playerAction(userInput.getAction(i));
        if (msg)
          response.appendConsoleOutput(msg);
      }

      if (!response.hasConsoleOutput()) {
        var msg = new Messaging.ConsoleOutput();
        msg.setResponseText("I don't know what you mean.");
        response.appendConsoleOutput(msg);
      }

      return response.toObject();
    }
}

module.exports = WebSocketServer