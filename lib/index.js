var crypto  = require('crypto');

function mongooseUserPassword (schema) {
    schema.add({
        passwordHash : { type: String, default: '' },
        salt         : { type: String, default: '' },
    });

    schema
    .virtual('password')
    .set(function setPassword(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.passwordHash = this.encryptPassword(password);
    });

    schema.methods.checkPassword = function checkPassword(plainText) {
        return this.encryptPassword(plainText) === this.passwordHash;
    };

    schema.methods.makeSalt = function makeSalt() {
        return `${Math.round((new Date().valueOf() * Math.random()))}`;
    };

    schema.methods.encryptPassword = function encryptPassword(password) {
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } catch (err) {
            return '';
        }
    };
}

module.exports = mongooseUserPassword
