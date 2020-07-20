const Room = require('../Room.js');
const Interactable = require('../Interactable.js');
const MapObjects = require('../MapObjects.js');
const Messaging = require('../Messaging.js');
const UserInput = require('../UserInput.js');
const Globals = require('../Globals.js');

//TODO: This would be better if it was a subclass of Room instead of a var export, but whatevs.
const r1_simonSays = new Room();
module.exports = r1_simonSays;



r1_simonSays.shortDescription = "You enter a room bathed in green light.  A gnome stands on the northern side of the room near a gilded door.  You begin to take a step toward the gnome, but as you do he raises his arm with his palm extended toward you and says \"Simon says STOP.\"";
r1_simonSays.longDescription = "The gnome eyes you menacingly.  You wouldn't dare disobey him.  How are you going to get past him?";

    r1_simonSays.addAction(UserInput.VerbGroup.LOOK, (playerObj) => {
        var response = new Messaging.ConsoleOutput();
        var simonSays_progress = playerObj.getPlayerContextValue("r1_simonSays_progress");
        var responseText = "";
        if (simonSays_progress != null) {
            responseText += "You're about " + (4 - simonSays_progress) + " steps away from the golden door.<br><br>";
        }
        responseText += r1_simonSays.longDescriptionWithObjects;
        response.setResponseText(responseText);
        return response;
    });

    var r1_d0 = new MapObjects.Door(["north", "northern", "gilded"], ["door"], Globals.roomNumbers.treasure);
    r1_d0.shortDescription = "There is a gleaming, gilded door on the northern wall.";
    r1_d0.longDescription = "The golden door shines and sparkles.  The gnome sees you looking at the door and growls at you.";
    r1_d0.onUseDescription = "You made it!  You push open the door and head north."
    r1_d0.addAction(UserInput.VerbGroup.GO, (playerObj) => {
        var playerProgress = playerObj.getPlayerContextValue("r1_simonSays_progress");
        if (playerProgress >= 4) {
            //success, use the door!
            return r1_d0.onUseDoor(playerObj);
        } 
        else if  (playerProgress >= 3) {
            //so close!
            var response = new Messaging.ConsoleOutput();
            response.setResponseText("You can almost reach the door, but you aren't there yet!");
            return response;
        }
        else {
            //not so close
            var response = new Messaging.ConsoleOutput();
            response.setResponseText("The door is all the way across the room from here.  You can't reach it.");
            return response;
        }
    });
    r1_simonSays.addInteractable(r1_d0);

    var r1_d1 = new MapObjects.Door(["south", "southern"], ["door"], Globals.roomNumbers.entry);
    r1_d1.shortDescription = "There is an old wooden door on the southern wall.";
    r1_d1.longDescription = "The old wooden door loosely hangs from its hinges on the southern wall.";
    r1_d1.onUseDescription = "You pull open the old wooden door and head to the south."
    r1_simonSays.addInteractable(r1_d1);

    const r1_simonSays_restartText = "  Start over!<br><br>You feel a magical rush of energy propel you backward.  Your feet skid to a stop just before you hit the southern wall.";
    const r1_f1_simon = () => {
        //Check if players succeeded at last simon says state
        //We only need check that their movement isn't empty when they should have moved
        //If they tried to move the wrong direction or move when they should stop, the movement action will prevent it
        if (r1_simonSays.getRoomContextValue("simonSays") == "stepforward") {
            r1_simonSays.forEachPlayerInRoom((player) => {
                if (player.getPlayerContextValue("r1_simonSays_didMove") != true
                        && player.getPlayerContextValue("r1_simonSays_progress") && player.getPlayerContextValue("r1_simonSays_progress") > 0) {
                    player.sendConsoleLine("Simon said move forward but you didn't!" + r1_simonSays_restartText);
                    player.setPlayerContextValue("r1_simonSays_progress", 0);
                }
            });
        }
        else if (r1_simonSays.getRoomContextValue("simonSays") == "stepback") {
            r1_simonSays.forEachPlayerInRoom((player) => {
                if (player.getPlayerContextValue("r1_simonSays_didMove") != true
                        && player.getPlayerContextValue("r1_simonSays_progress") && player.getPlayerContextValue("r1_simonSays_progress") > 0) {
                    player.sendConsoleLine("Simon said move backward but you didn't!" + r1_simonSays_restartText);
                    player.setPlayerContextValue("r1_simonSays_progress", 0);
                }
            });
        }

        //clear movement states
        r1_simonSays.forEachPlayerInRoom((player) => {
            player.setPlayerContextValue("r1_simonSays_didMove", false);
        });

        //Set new simon says state
        var min = 1;
        var max = 8;
        var rand = Math.floor(Math.random() * (max - min + 1) + min);
        if (rand == 1 || rand == 2) {
            r1_simonSays.setRoomContextValue("simonSays", "stop");
            r1_simonSays.sendLineToRoomPlayers("Simon says STOP.");
        }
        else if (rand == 3 || rand == 4 || rand == 5) {
            r1_simonSays.setRoomContextValue("simonSays", "stepforward");
            r1_simonSays.sendLineToRoomPlayers("Simon says TAKE ONE STEP FORWARD.");
        }
        else if (rand == 6) {
            r1_simonSays.setRoomContextValue("simonSays", "notstepforward");
            r1_simonSays.sendLineToRoomPlayers("TAKE ONE STEP FORWARD.");
        }
        else if (rand == 7) {
            r1_simonSays.setRoomContextValue("simonSays", "stepback");
            r1_simonSays.sendLineToRoomPlayers("Simon says TAKE ONE STEP BACK.");
        }
        else {
            r1_simonSays.setRoomContextValue("simonSays", "notstepback");
            r1_simonSays.sendLineToRoomPlayers("TAKE ONE STEP BACK.")
        }

        min = 5;
        max = 11;
        rand = Math.floor(Math.random() * (max - min + 1) + min);
        setTimeout(r1_f1_simon, rand*1000);
    };
    setTimeout(r1_f1_simon, 5000);

    //Simon says movement actions.  Order matters because step forward must outweigh step backward in priority
    //singular step forward
    var r1_action_stepForwardSingle = new Interactable(["a", "one", "forward"], ["step", "steps"]);
    r1_action_stepForwardSingle.addAction(["walk", "move", "step", "take"], (playerObj) => {
        
        var response = new Messaging.ConsoleOutput();
        var simonSays = r1_simonSays.getRoomContextValue("simonSays");
        if (playerObj.getPlayerContextValue("r1_simonSays_didMove") == true) {
            response.setResponseText("You already moved this round!  You'd best stand still until the gnome says something again.");
            return response;
        } else if (simonSays == "stepforward") {
            var progress = playerObj.getPlayerContextValue("r1_simonSays_progress");
            if (!progress) progress = 0;
            progress += 1;
            playerObj.setPlayerContextValue("r1_simonSays_progress", progress);
            playerObj.setPlayerContextValue("r1_simonSays_didMove", true);
            if (progress >= 4)
                response.setResponseText("You take a single step forward.  You can reach the gilded door from here!");
            else if (progress >= 3)
                response.setResponseText("You take a single step forward.  You're almost to the gilded door!");
            else
                response.setResponseText("You take a single step forward.");
        } else {
            //not allowed!
            playerObj.setPlayerContextValue("r1_simonSays_progress", 0);
            playerObj.setPlayerContextValue("r1_simonSays_didMove", true);
            if (simonSays == "notstepforward")
                response.setResponseText("Hey, I didn't say Simon Says!" + r1_simonSays_restartText);
            else if (simonSays == "stop")
                response.setResponseText("Hey, I said STOP!" + r1_simonSays_restartText);
            else
                response.setResponseText("Hey, that's not what I said to do!" + r1_simonSays_restartText);
        }

        return response;
    });
    r1_simonSays.addInteractable(r1_action_stepForwardSingle);
    
    var r1_action_stepForwardMulti = new Interactable(["forward", "many", "two", "three", "four", "multiple", "several", "couple"], ["step", "steps"]);
    r1_action_stepForwardMulti.addAction(["walk", "move", "step", "take", "run"], (playerObj) => {
        var response = new Messaging.ConsoleOutput();
        playerObj.setPlayerContextValue("r1_simonSays_progress", 0);
        playerObj.setPlayerContextValue("r1_simonSays_didMove", true);
        response.setResponseText("You start walking forward but the gnome snaps his eyes to you and points a finger in your direction.<br><br>Hey no fair, you gotta play the game!" + r1_simonSays_restartText);
        return response;
    });
    r1_simonSays.addInteractable(r1_action_stepForwardMulti);
    
    //Move forward, specifically at the door or gnome
    var r1_action_stepForwardDoor = new Interactable(["forward", "many", "two", "three", "four", "multiple", "several", "couple", "gilded", "north", "northern"], ["step", "steps", "door", "gnome", "Simon"]);
    r1_action_stepForwardDoor.addAction(["walk", "move", "step", "take", "run"], (playerObj) => {
        playerObj.setPlayerContextValue("r1_simonSays_progress", 0);
        playerObj.setPlayerContextValue("r1_simonSays_didMove", true);
        response.setResponseText("You start to move towards your target but the gnome snaps his eyes to you and points a finger in your direction.<br><br>Hey no fair, you gotta play the game!" + r1_simonSays_restartText);
        return response;
    });
    r1_simonSays.addInteractable(r1_action_stepForwardDoor);

    var r1_action_stepBackwardSingle = new Interactable(["a", "one", "backward"], ["step", "steps"]);
    r1_action_stepBackwardSingle.addAction(["walk", "move", "step", "take", "back", "backward"], (playerObj) => {
        
        var response = new Messaging.ConsoleOutput();
        var simonSays = r1_simonSays.getRoomContextValue("simonSays");
        if (playerObj.getPlayerContextValue("r1_simonSays_didMove") == true) {
            response.setResponseText("You already moved this round!  You'd best stand still until the gnome says something again.");
            return response;
        } else if (simonSays == "stepback") {
            var progress = playerObj.getPlayerContextValue("r1_simonSays_progress");
            if (!progress) progress = 0;
            if (progress <= 0)
                response.setResponseText("You're already against the southern wall, so you can't go back any farther.");
            if (progress <= 1)
                response.setResponseText("You take a single step backward.  You're almost back where you started...");
            else
                response.setResponseText("You take a single step backward.");
                
            progress -= 1;
            if (progress < 0) progress = 0;
            playerObj.setPlayerContextValue("r1_simonSays_progress", progress);
            playerObj.setPlayerContextValue("r1_simonSays_didMove", true);
        } else {
            //not allowed!
            playerObj.setPlayerContextValue("r1_simonSays_progress", 0);
            playerObj.setPlayerContextValue("r1_simonSays_didMove", true);
            if (simonSays == "notstepback")
                response.setResponseText("Hey, I didn't say Simon Says!" + r1_simonSays_restartText);
            else if (simonSays == "stop")
                response.setResponseText("Hey, I said STOP!" + r1_simonSays_restartText);
            else
                response.setResponseText("Hey, that's not what I said to do!" + r1_simonSays_restartText);
        }

        return response;
    });
    r1_simonSays.addInteractable(r1_action_stepBackwardSingle);
    
    var r1_action_stepBackwardMulti = new Interactable(["backward", "back", "many", "two", "three", "four", "multiple", "several", "couple"], ["step", "steps"]);
    r1_action_stepBackwardMulti.addAction(["walk", "move", "step", "take", "run", "restart"], (playerObj) => {
        var response = new Messaging.ConsoleOutput();
        if (!playerObj.getPlayerContextValue("r1_simonSays_progress"))
            response.setResponseText("You can't go back any farther.");
        else
            response.setResponseText("I don't know why you would want to go back there, but let me help you out!  Haha!" + r1_simonSays_restartText);
        playerObj.setPlayerContextValue("r1_simonSays_progress", 0);
        playerObj.setPlayerContextValue("r1_simonSays_didMove", true);
        return response;
    });
    r1_simonSays.addInteractable(r1_action_stepBackwardMulti);    

    var r1_action_stop = new Interactable(["don't", "dont", "still"], []);
    r1_action_stop.addAction(["stop", "halt", "stand", "stay"], (playerObj) => {
        var response = new Messaging.ConsoleOutput();
        response.setResponseText("You stand perfectly still.");
        playerObj.setPlayerContextValue("r1_simonSays_didMove", true); //ok, they didn't "move" move, but they /made a move/.
        return response;
    });
    r1_simonSays.addInteractable(r1_action_stop);