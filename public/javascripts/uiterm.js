
$(function() {

    var term = new Terminal();
    term.open($('#terminal'));
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    // term.fit()

    //Connect to WS
    //UI Events from WS to support: Insert line, clear screen 

    $('#userTextInput').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");
            
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