# mongoose-user-password

Simple plugin for Mongoose which adds passwordHash and salt fields to the scheme;

## Usage

```javascript
var userPassword = require('mongoose-user-password');

var UserSchema = new Schema({
    username: String
});

UserSchema.plugin(userPassword);
mongoose.model('User', UserSchema);
```
The User model will now have `passwordHash` and `salt` properties.
Also `checkPassword`, `makeSalt` and `encryptPassword` methods will be added to the schema;


## Plugin code

```javascript
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

    schema.methods.encryptPassword = function encryptPassword() {
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } catch (err) {
            return '';
        }
    };
```
