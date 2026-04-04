import { Router } from "express";
import { createRecords } from "../controllers/records.controller.js";  
import { verifyUserJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
const router = Router();

router.route("/create").post(verifyUserJwt, authorizeRoles("ADMIN"), createRecords);

export default router;