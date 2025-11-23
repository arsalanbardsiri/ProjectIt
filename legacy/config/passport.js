const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  (email, password, done) => {
    db.User.findOne({
      where: {
        email: email
      }
    }).then(dbUser => {
      // If no user with the given email
      if (!dbUser) {
        return done(null, false, {
          message: 'Incorrect email.'
        });
      }
      // If user exists but password is incorrect
      if (!bcrypt.compareSync(password, dbUser.password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      // If credentials are correct, return the user
      return done(null, dbUser);
    });
  }
));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
passport.serializeUser((user, cb) => {
  console.log("Serializing User: ", user);
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  console.log("Deserializing Object: ", obj);
  cb(null, obj);
});

module.exports = passport;
