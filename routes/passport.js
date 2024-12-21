const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


// Use LocalStrategy for username and password authentication
passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) return done(err);
                    if (!isMatch) return done(null, false, { message: 'Invalid credentials' });
                    return done(null, user);
                });
                
                return done(null, user);
            })
            .catch(err => done(err));
    }
));



// Serialize the user into the session
passport.serializeUser((user, done) => {
    done(null, user._id);
});


// Deserialize the user from the session
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});

module.exports = passport;
