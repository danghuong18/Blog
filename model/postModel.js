const mongoose = require("./dbConnect");

const PostSchema = mongoose.Schema({
    title: String,
    content: String,
    userID: {
        type: String,
        ref: 'user'
    }
}, {collection: 'post'});

const PostModel = mongoose.model('post', PostSchema);

module.exports = PostModel;