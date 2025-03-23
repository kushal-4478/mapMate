//DEFINATION
// This function generates a JWT token and stores it in a cookie.
//The token in the cookie is automatically sent with each request to your server, allowing the server to validate your authentication status.


const jwt = require('jsonwebtoken');



// Function to generate JWT token and store it in a cookie
const generateToken = (user, res) => {
    const secretKey = process.env.JWT_SECRET || 'hsghvsgsjash872337%^%^$Ehuw';
    const expiresIn = '1h'; // Token expiration time

    // Generate the token  COMPONENT OF JWT => eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTYyNjY3MjAwMCwiZXhwIjoxNjI2Njc1NjAwfQ.abc123signature
    //header=> metadata of token
    //Payload ({ id: user.id, email: user.email })
    //signature => secret key
    // Stateless Authentication: The server does not need to store session data. The token itself contains all the necessary information.
    
    const token = jwt.sign({
         id: user.id,
         email: user.email 
        }, secretKey, { expiresIn });

    // Set the token in a cookie
    res.cookie('token', token, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 3600000, // 1 hour in milliseconds
    });

    return token;
};

export default generateToken;