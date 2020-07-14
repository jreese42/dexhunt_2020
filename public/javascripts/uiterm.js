
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
            if ($(this).val()) {
                wss_send(data);
            }
            else {
                var turnData = {
                    "playerInput": "",
                    "resultOutput": "Enter some text.  Type 'help' for command list."
                }
                $('#vorple > .previousTurn').before(render_gameTurn(turnData));
                $(document).scrollTop($(document).height());
            }
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
    var HOST = location.origin.replace(/^http/, 'ws');
    console.log(HOST)
    // ws = new WebSocket('ws://localhost:33053'); //Local dev
    ws = new WebSocket(HOST); //Production
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
    $('#vorple > .previousTurn').before(render_gameTurn(turnData));
    $(document).scrollTop($(document).height());
}