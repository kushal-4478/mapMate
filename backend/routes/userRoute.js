import express from "express"
import { registerUser,loginUser,signOutUser,refreshAccessToken } from "../controllers/userControllers";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

//routing
router.post("/register", registerUser);

router.post("/login", loginUser);


router.post("/signout", signOutUser);


router.get("/refresh-token", refreshAccessToken);

export default router;