import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Configure Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: "YOUR_GOOGLE_CLIENT_ID", // Replace with your Google Client ID
            clientSecret: "YOUR_GOOGLE_CLIENT_SECRET", // Replace with your Google Client Secret
            callbackURL: `${process.env.BACKEND_API_URL}/auth/google/callback`, // Backend callback URL
        },
        (accessToken, refreshToken, profile, done) => {
            // Save user profile to database or session
            console.log("Google Profile:", profile);
            return done(null, profile);
        }
    )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport;