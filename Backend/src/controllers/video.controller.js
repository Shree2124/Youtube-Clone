import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js"

const addVideo = asyncHandler(async (req, res) => {
  const { title, des, tags } = req.body;

  if (!title) {
    throw new ApiError(401, "Title is required");
  }
  if (!des) {
    throw new ApiError(401, "Description is required");
  }

  // Extract file paths for video and image
  let videoUrlLocalPath;
  let imgUrlLocalPath;

  if (req?.files?.videoUrl && Array.isArray(req.files.videoUrl) && req.files.videoUrl.length > 0) {
    videoUrlLocalPath = req.files.videoUrl[0].path;
  }
  if (req?.files?.imgUrl && Array.isArray(req.files.imgUrl) && req.files.imgUrl.length > 0) {
    imgUrlLocalPath = req.files.imgUrl[0].path;
  }

  if (!videoUrlLocalPath) {
    throw new ApiError(401, "Video file is required");
  }
  if (!imgUrlLocalPath) {
    throw new ApiError(401, "Image file is required");
  }

  const tagsArr = tags ? tags.split(",").map(tag => tag.trim()) : [];

  try {
    // Upload video and image in parallel
    const [videoUpload, imageUpload] = await Promise.all([
      uploadOnCloudinary(videoUrlLocalPath),
      uploadOnCloudinary(imgUrlLocalPath)
    ]);

    const videoUrl = videoUpload?.url;
    const imgUrl = imageUpload?.url;

    // Save video details in the database
    const saveVideo = await Video.create({
      userId: req.user.id,
      videoUrl,
      imgUrl,
      tags: tagsArr,
      title,
      des
    });

    res.status(201).json(new ApiResponse(201, saveVideo, "Video uploaded successfully"));
  } catch (error) {
    console.error("Error uploading files:", error);
    throw new ApiError(500, "File upload failed");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (req.user.id === video.userId) {
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(200)
      .json(new ApiResponse(201, updatedVideo, "Video updated successfully"));
  } else {
    new ApiError(400, "You can update only your video");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (req.user.id === video.userId) {
    await Video.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(201, null, "Video deleted successfully"));
  } else {
    new ApiError(400, "You can delete only your video");
  }
});

const getVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  console.log(video);
  
  res.status(200).json(new ApiResponse(200, video));
});

const addView = asyncHandler(async (req, res) => {
  await Video.findByIdAndUpdate(req.params.id, {
    $inc: { views: 1 },
  });
  res.status(200).json(new ApiResponse(200, "The view has been increased."));
});

const random = asyncHandler(async (req, res) => {
  const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
  res.status(200).json(new ApiResponse(200, videos));
});

const trends = asyncHandler(async (req, res) => {
  const videos = await Video.find().sort({ views: -1 });
  res.status(200).json(new ApiResponse(200, videos));
});

const sub = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const subChannenls = user.subscribedUsers;
  const list = await Promise.all(
    subChannenls.map((channelId) => {
      return Video.find({ userId: channelId });
    })
  );
  res.status(200).json(
    new ApiResponse(
      201,
      list.flat().sort((a, b) => b.createdAt - a.createdAt)
    )
  );
});

const getByTags = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

const search = asyncHandler(async (req, res) => {
  const query = req.query.q;
  const videos = await Video.find({
    title: { $regex: query, $options: "i" },
  }).limit(40);
  res.status(200).json(new ApiResponse(200, videos));
});

export {
  addVideo,
  updateVideo,
  search,
  deleteVideo,
  getVideo,
  addView,
  getByTags,
  random,
  trends,
  sub,
};
