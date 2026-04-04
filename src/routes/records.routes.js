import { Router } from "express";
import { createRecords } from "../controllers/records.controller.js";  
import { verifyUserJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
const router = Router();

router.route("/create").post(verifyUserJwt, authorizeRoles("ADMIN"), createRecords);
router.route("/view").get(verifyUserJwt, authorizeRoles("ADMIN", "USER"), viewRecords);
router.route("/view/:id").get(verifyUserJwt, authorizeRoles("ADMIN", "USER"), viewRecordById);
router.route("/update/:id").put(verifyUserJwt, authorizeRoles("ADMIN"), updateRecords);
router.route("/delete/:id").delete(verifyUserJwt, authorizeRoles("ADMIN"), deleteRecords);
export default router;