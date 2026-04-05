import { Router } from "express";
import { createRecords } from "../controllers/records.controller.js";  
import { verifyUserJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { viewRecords, viewRecordById, updateRecord, deleteRecords } from "../controllers/records.controller.js";
const router = Router();

router.route("/").post(verifyUserJwt, authorizeRoles("ADMIN"), createRecords);
router.route("/").get(verifyUserJwt, authorizeRoles("ADMIN","ANALYST"), viewRecords);
router.route("/:id").get(verifyUserJwt, authorizeRoles("ADMIN","ANALYST"), viewRecordById);
router.route("/:id").put(verifyUserJwt, authorizeRoles("ADMIN"), updateRecord);
router.route("/:id").delete(verifyUserJwt, authorizeRoles("ADMIN"), deleteRecords);
export default router;