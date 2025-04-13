import express from "express";
import passport from "passport";

const router = express.Router();

// Google Auth Routes
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: "/dashboard", // Redirect after successful login
        failureRedirect: "/login", // Redirect after failed login
    })
);

// Example protected route
router.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) {
        res.send("Welcome to your dashboard!");
    } else {
        res.redirect("/login");
    }
});

export default router;