
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
            // $.post({
            //     url: "/api/lookupGame/" + $(this).val()
            // })
            // .done(function(data) {
            //     console.log(data)
            //     if (!data.gameId) {
            //         console.log("Couldn't find gameId in response.")
            //         return
            //     }
            //     setupWssSocket_playerMode(data.gameId)
            // })
    
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
        insertTurn(JSON.parse(ev.data));
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

function insertTurn(turnData) {
    console.log(turnData)
    $('#vorple > .previousTurn').before(render_gameTurn(turnData))
}