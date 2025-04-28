import { Router } from "express";
import {
  addVideo,
  uploadChunk,
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

// New route for chunk uploads
router.route("/upload-chunk").post(
  verifyJWT,
  upload.fields([
    { name: "chunk", maxCount: 1 }
  ]),
  uploadChunk
);

// Modified addVideo route - now handles the finalization after chunks are uploaded
router.route("/add-video").post(
  verifyJWT,
  addVideo
);

// Existing routes
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