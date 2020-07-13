
$(function() {
    //Connect to WS
    setupWssSocket();
    
    //UI Events from WS to support: Insert line, clear screen 
    $('.vorplePrompt > input').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");
            var data = {"playerInput": $(this).val()}
            console.log(data)
            wss_send(data)
            $(this).val('')
    
            //Enable the textbox again if needed.
            $(this).removeAttr("disabled");
        }
    });    
})


//Open socket, send gameId to server to request game state
function setupWssSocket(gameId) {
    openWssSocket()
    ws.onopen = wssHelper_onOpen.bind(this, gameId)
}

function openWssSocket() {
    ws = new WebSocket('ws://localhost:33053');
    ws.onmessage = function (ev) {
        console.log(ev.data)
        processServerMessage(ev.data);
    }
}

function wssHelper_onOpen(gameId) {
    if (ws == null)
        return

    ws.send(JSON.stringify({
        "playerId": "abcd"
    }))    
}

function wss_send(object) {
    if (ws == null)
        return

    ws.send(JSON.stringify(object))    
}

function processServerMessage(serverMessageJson) {
    var dataObj = JSON.parse(serverMessageJson);
    if (dataObj.console) {
        insertTurn(dataObj.console);
    }

}

function insertTurn(turnData) {
    console.log(turnData)
    if (!turnData.playerInput)
        turnData.hideUserInput = true;
    console.log(turnData)
    $('#vorple > .previousTurn').before(render_gameTurn(turnData))
}