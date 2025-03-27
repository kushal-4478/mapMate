import express from "express"
import { registerUser,loginUser,signOutUser,refreshAccessToken } from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { getSuggestions } from "../controllers/getSuggestion.js";
const router = express.Router();

//routing
router.post("/register", registerUser);

router.post("/login", loginUser);


router.post("/signout", signOutUser);


router.get("/refresh-token", refreshAccessToken);

//// Location-based suggestions route
router.post("/suggestions",getSuggestions);

export default router;