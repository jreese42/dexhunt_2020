/*
 * webSocketServer.js
 * Manage the websocket server and clients.
 */

const WebSocket = require('ws');
const Player = require('./Player');
const UserInput = require('./UserInput');
const World = require('./World.js');

var world = new World();

const wssOptions = {
    port: 33053,
    perMessageDeflate: {
      zlibDeflateOptions: {
        // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024
      },
      // Other options settable:
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      serverMaxWindowBits: 10, // Defaults to negotiated value.
      // Below options specified as default values.
      concurrencyLimit: 10, // Limits zlib concurrency for perf.
      threshold: 1024 // Size (in bytes) below which messages
      // should not be compressed.
    }
  }

class WebSocketServer {
    constructor() {
        this.playerClients = []
        this.wss = new WebSocket.Server(wssOptions);
        this.wss.on('connection', this.onNewConnection.bind(this))
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

      var player = new Player();
      player.currentRoom = world.getRoom(0); //room1
      var userInput = new UserInput(data["playerInput"]);
      
      var response = {};
      response["playerInput"] = data["playerInput"];

      if (data.playerId) {
        //Initial command - send context to player
        response["resultOutput"] = player.getCurrentRoom().getShortDescription();
        return response;
      }

      //will need initialization of sockets later
      //for now just go straight through to command parsing
      response["resultOutput"] = player.process_playerAction(userInput.getAction(0));
      return response;
    }
}

module.exports = WebSocketServer