import express from "express";
import {
  signup,
  login,
  updateUser,
  userDetail,
} from "../controllers/authController.js";
import verifyToken from "../middleware/verifyToken.js";
import {
  signupValidation,
  loginValidation,
} from "../middleware/authValidation.js";

const router = express.Router();

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.put("/updateUser", verifyToken, updateUser);
router.get("/userDetail", verifyToken, userDetail);

export default router;
