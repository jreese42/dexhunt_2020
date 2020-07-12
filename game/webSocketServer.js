/*
 * webSocketServer.js
 * Manage the websocket server and clients.
 */

const WebSocket = require('ws');
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
      var response = {};
      response["playerInput"] = data["playerInput"];
      response["resultOutput"] = "You said: \"" + data["playerInput"] + "\""
      return response;
    }
}

module.exports = WebSocketServer