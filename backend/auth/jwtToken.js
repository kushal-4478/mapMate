//DEFINATION
// This function generates a JWT token and stores it in a cookie.
//The token in the cookie is automatically sent with each request to your server, allowing the server to validate your authentication status.

import jwt from "jsonwebtoken"
    // Generate the token  COMPONENT OF JWT => eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTYyNjY3MjAwMCwiZXhwIjoxNjI2Njc1NjAwfQ.abc123signature
    //header=> metadata of token
    //Payload ({ id: user.id, email: user.email })
    //signature => secret key
    // Stateless Authentication: The server does not need to store session data. The token itself contains all the necessary information.
    
   
    
    // Function to generate JWT tokens and store them in cookies
    const generateToken = (user, res) => {
        const secretKey = process.env.JWT_SECRET || "hsghvsgsjash872337%^%^$Ehuw";
        const refreshSecretKey = process.env.JWT_REFRESH_SECRET || "refreshSecretKey";
        const accessTokenExpiresIn = "15m"; // Access token expires in 15 minutes
        const refreshTokenExpiresIn = "7d"; // Refresh token expires in 7 days
    
        // Generate the access token
        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            secretKey,
            { expiresIn: accessTokenExpiresIn }
        );
    
        // Generate the refresh token
        const refreshToken = jwt.sign(
            { id: user.id, email: user.email },
            refreshSecretKey,
            { expiresIn: refreshTokenExpiresIn }
        );
    
        // Set the tokens in cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
        });
    
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
    
        return { accessToken, refreshToken };
    };
    
    

export default generateToken;