
var nextObjectId = 1;
var g_world = null;

const getNextObjectId = () => {
    var id = nextObjectId;
    nextObjectId += 1;
    return id;
}


const setWorld = (world) => {
    g_world = world;
}

const getWorld = () => {
    return g_world;
}

//Utility names for the rooms as they're ordered in World.worldMap[].
const roomNumbers = {
    "entry": 0,
    "simonSays": 1,
    "treasure": 2
};

module.exports = {
    getNextObjectId,
    setWorld,
    getWorld,
    roomNumbers,
}