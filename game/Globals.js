
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

module.exports = {
    getNextObjectId,
    setWorld,
    getWorld,
}