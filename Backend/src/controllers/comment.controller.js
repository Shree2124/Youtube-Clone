import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";

const addComment = asyncHandler( async (req, res, next) => {
  const {desc, videoId} = req.body;

  if(!desc) return new ApiError(400, "Description is required")

  const newComment = await Comment.create({
      desc,
      videoId,
      userId: req?.user?.id
    })
    console.log(newComment)
    res.status(200).json(new ApiResponse(201, newComment));
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(res.params.id);
  const video = await Video.findById(res.params.id);
  if (req.user.id === comment.userId || req.user.id === video.userId) {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json(ApiResponse("The comment is deleted successfully"));
  } else {
    return new ApiError(400, "You can delete only your comments");
  }
});

const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ videoId: req.params.videoId });
  res.status(200).json(new ApiResponse(201, comments, "Success"))
});

export { addComment, deleteComment, getComments };
