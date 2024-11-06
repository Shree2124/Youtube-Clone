import { Router } from "express";
import {
  addVideo,
  getVideo,
  deleteVideo,
  updateVideo,
  addView,
  random,
  trends,
  sub,
  getByTags,
  search,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();

router.route("/add-video").post(
  verifyJWT,
  upload.fields([{
    name: "imgUrl",
    maxCount: 1
  },
  {
    name: "videoUrl",
    maxCount: 1
  }]),
  addVideo
);
router.route("/:id").patch(verifyJWT, updateVideo);
router.route("/:id").delete(verifyJWT, deleteVideo);
router.route("/find/:id").get(getVideo);
router.route("/view/:id").put(verifyJWT, addView);
router.route("/trend").get(trends);
router.route("/random").get(random);
router.route("/sub").get(verifyJWT, sub);
router.route("/tag").get(getByTags);
router.route("/search/").get(verifyJWT, search);

export default router;
