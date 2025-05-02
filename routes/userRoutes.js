import express from "express";
import { 
    createUser, 
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById,
    getTeacherNameId,
    addStudentToClass,
    getEnrolledClassesByUserId
 } from "../controllers/userController.js";
import { authenticate, authorizeAdmin} from "../middlewares/authMiddleware.js"
const router = express.Router();

router
.route("/").post(createUser)
. get(authenticate, authorizeAdmin, getAllUsers);

//http://localhost:8800/api/users/auth
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router
.route("/profile")
.get(authenticate, getCurrentUserProfile)
.put(authenticate, updateCurrentUserProfile);

router.route("/teacheridname").get(getTeacherNameId);
router.route("/addstudenttoclass").put(addStudentToClass);


router.route("/getenrolledclassesbyuserid/:id").get(getEnrolledClassesByUserId)

//adminn routes
router.route("/:id").delete(authenticate, authorizeAdmin, deleteUserById)
.get(authenticate, getUserById)
.put(authenticate, authorizeAdmin, updateUserById);
;

//Instructor


export default router;
