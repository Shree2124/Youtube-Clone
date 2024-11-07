import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  deleteUser,
  subscribe,
  unsubscribe,
  like,
  dislike,
  getUser,
  getMyVideos,
  getSubs
} from "../controllers/user.controller.js";
// import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();

router.route("/register").post(upload.fields([
  {
    name: "avatar",
    maxCount: 1,
  },
]), registerUser);

router.route("/login").post(loginUser);

// TODO: Secured Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account-details").patch(verifyJWT, updateAccountDetails);
router.route("/c/:name").get(verifyJWT, getUserChannelProfile);

router.route("/history").get(verifyJWT, getWatchHistory);

// delete user
router.route("/:id").delete(verifyJWT, deleteUser)

// subcribe a user
router.route("/sub/:id").patch(verifyJWT, subscribe)

// get a user
router.route("/find/:id").get(getUser);

// unsubscribe a user
router.route("/unsub/:id").patch(verifyJWT, unsubscribe)

// like a video
router.route("/like/:videoId").put(verifyJWT, like)

// dislike a video
router.route("/dislike/:videoId").put(verifyJWT, dislike)

router.route("/get-my-videos").get(verifyJWT, getMyVideos)

router.route("/get-sub-channels").get(verifyJWT, getSubs)


// router
//   .route("/avatar")
//   .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// router
//   .route("/cover-image")
//   .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
export default router;
