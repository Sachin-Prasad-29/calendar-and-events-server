const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email must be Provided'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Name must be Provided'],
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: '',
    },
    profilePic: {
        type: String,
        default: 'https://www.ssrl-uark.com/wp-content/uploads/2014/06/no-profile-image.png',
    },
    birthday: {
        type: Date,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    website: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
},{timestamps:true})

const emailPat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordPat = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

// we can customize the schema further before model is created
userSchema
    .path('email')
    .validate((email) => emailPat.test(email), 'Invalid email. Please make sure the email is a fynd.com email.');

userSchema
    .path('password')
    .validate(
        (password) => passwordPat.test(password),
        'Password must have at least 1 upper case, 1 lower case, 1 digit, 1 special characters, and should be 8 characters in length.'
    );

const SALT_FACTOR = 10;

//console.log(this); // global / window

userSchema.pre('save', function (done) {
    // DO NOT use arrow function here
    const user = this; // const user -> new User()

    if (!user.isModified('password')) {
        done();
        return;
    }

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return done(err); // Mongoose will not insert the user document
        }

        bcrypt.hash(user.password, salt, function (err, hashedPassword) {
            if (err) {
                return done(err);
            }

            user.password = hashedPassword;
            done(); // pass no arguments to done() to signify success
        });
    });

    console.log('executes immediately');
});

userSchema.methods.checkPassword = async function (plainTextPassword) {
    const hashedPassword = this.password;

    // this line will throw an error sometimes
    // if on the other hand bcrypt is able to compare it will return true / false
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    return isMatch;
};

module.exports = mongoose.model('User', userSchema);
