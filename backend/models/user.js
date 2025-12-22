const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Some versions of passport-local-mongoose expose the plugin as .default under ESM
const plm = require('passport-local-mongoose');
const passportLocalMongoose = plm.default || plm;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);