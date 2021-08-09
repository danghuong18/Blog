const mongoose = require("./dbConnect");

const blackListSchema = mongoose.Schema({
    token: String
}, {collection: 'blackList'});

const BlackListModel = mongoose.model('blackList', blackListSchema);

module.exports = BlackListModel;