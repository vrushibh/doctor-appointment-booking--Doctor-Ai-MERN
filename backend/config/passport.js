import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ['profile', 'email'],
}, (accessToken, refreshToken, profile, done) => {
  // Here you can handle the login logic
  // For example, find or create the user in your database
  const user = {
    googleId: profile.id,
    displayName: profile.displayName,
    email: profile.emails[0].value,
    image: profile.photos[0].value,
  };

  // Assuming you are using a User model and MongoDB
  // Find or create the user logic here
  done(null, user);
}));

// Serializing and deserializing user (important for session)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
