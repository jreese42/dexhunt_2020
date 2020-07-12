# dexhunt_2020
Dex Hunt 2020


## Websocket Object
### Client to Server
{
    "console": {
        "playerInput": "string"
    }
}
### Server to Client
{
    "console": {
        "playerInput": "string", //Echos back the player input
        "resultOutput": "string" //Text response to player
    },
    "media": {
        "imageResource": "string", //URL to an image resource
        "audioResource": "string" //URL to an audio resource
    }
}