
var nextObjectId = 1;
module.exports.getNextObjectId = () => {
    var id = nextObjectId;
    nextObjectId += 1;
    return id;
}