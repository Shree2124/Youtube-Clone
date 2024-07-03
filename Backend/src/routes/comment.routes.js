import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getComments } from "../controllers/comment.controller.js"

const router = new Router()

router.route("/add-comment").post(verifyJWT, addComment)
router.route("/delete-comment/:id").delete(verifyJWT, deleteComment)
router.route("/get-comments/:videoId").get(getComments)

export default router