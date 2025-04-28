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
  // Get the search query from the request
  const query = req.query.q;
  
  // Handle empty query
  if (!query || query.trim() === "") {
    return res
      .status(400)
      .json(new ApiResponse(400, [], "Search query cannot be empty"));
  }
  
  // Sanitize the query to prevent regex injection
  const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  try {
    // Search in both title, description and tags using aggregation
    const videos = await Video.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: sanitizedQuery, $options: "i" } },
            { tags: { $in: [new RegExp(sanitizedQuery, "i")] } },
            { des: { $regex: sanitizedQuery, $options: "i" } }
          ]
        }
      },
      // Add user details lookup
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      // Project only needed fields
      {
        $project: {
          _id: 1,
          title: 1,
          des: 1,
          imgUrl: 1,
          videoUrl: 1,
          views: 1,
          tags: 1,
          likes: { $size: "$likes" },
          dislikes: { $size: "$dislikes" },
          createdAt: 1,
          "userDetails.name": 1,
          "userDetails.avatar": 1,
          "userDetails.subscribers": 1
        }
      },
      // Sort by most relevant and popular
      {
        $sort: {
          views: -1, // Sort by views (most popular first)
          createdAt: -1 // Then by date (newest first)
        }
      },
      // Limit results
      {
        $limit: 40
      }
    ]);
    
    // Format the response to match expected structure
    const formattedVideos = videos.map(video => ({
      _id: video._id,
      title: video.title,
      description: video.des,
      thumbnail: video.imgUrl,
      videoFile: video.videoUrl,
      views: video.views,
      likes: video.likes,
      dislikes: video.dislikes,
      tags: video.tags,
      createdAt: video.createdAt,
      owner: video.userDetails ? {
        _id: video.userDetails._id,
        name: video.userDetails.name,
        avatar: video.userDetails.avatar,
        subscribers: video.userDetails.subscribers
      } : null
    }));
    
    // Return the results
    return res.status(200).json(new ApiResponse(
      200, 
      formattedVideos,
      `Found ${formattedVideos.length} results for "${query}"`
    ));
  } catch (error) {
    // Log the error for server-side debugging
    console.error("Search error:", error);
    
    // Return appropriate error
    return res
      .status(500)
      .json(new ApiResponse(500, [], "Error performing search. Please try again."));
  }
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
