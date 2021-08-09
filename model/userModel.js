const mongoose = require("./dbConnect");

const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    role: {
        default: 'user',
        type: String
    }
}, {collection: 'user'});


const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;