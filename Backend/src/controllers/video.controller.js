import multer from "multer";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import fs from "fs"
import path from "path";

const tempDir = path.join(process.cwd(), 'public', 'temp');
const chunksDir = path.join(process.cwd(), 'public', 'chunks');

// Ensure directories exist
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

if (!fs.existsSync(chunksDir)) {
  fs.mkdirSync(chunksDir, { recursive: true });
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename to avoid collisions
    const uniqueFilename = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit each chunk to 10MB
});

// Handler for receiving chunks
export const uploadChunk = asyncHandler(async (req, res) => {
  const { chunkIndex, totalChunks, fileName, fileType, fieldName, fileId } = req.body;
  
  // If this is the first chunk, generate a new fileId
  const uploadId = fileId || uuidv4();
  const uploadDir = path.join(chunksDir, uploadId);
  
  // Create directory for this upload if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Move the uploaded chunk from temp to chunks directory
  const chunk = req.files?.chunk?.[0];
  if (!chunk) {
    throw new ApiError(400, "No chunk found in the request");
  }
  
  // Save chunk with its index
  const chunkPath = path.join(uploadDir, `chunk-${chunkIndex}`);
  fs.renameSync(chunk.path, chunkPath);
  
  // If this is the first chunk, save the metadata
  if (parseInt(chunkIndex) === 0) {
    fs.writeFileSync(
      path.join(uploadDir, "metadata.json"),
      JSON.stringify({
        fileName,
        fileType,
        fieldName,
        totalChunks: parseInt(totalChunks),
        uploadDate: new Date(),
        ...((fieldName === "video" && req.body.title) ? {
          title: req.body.title,
          des: req.body.des,
          tags: req.body.tags
        } : {})
      })
    );
  }
  
  // Return the fileId and chunk status
  res.status(200).json(
    new ApiResponse(
      200, 
      { 
        fileId: uploadId, 
        chunkIndex, 
        received: true 
      }, 
      "Chunk received successfully"
    )
  );
});

// Function to merge chunks into a complete file
const mergeChunks = async (fileId) => {
  const uploadDir = path.join(chunksDir, fileId);
  const metadataPath = path.join(uploadDir, "metadata.json");
  
  if (!fs.existsSync(metadataPath)) {
    throw new ApiError(404, "Upload metadata not found");
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const { fileName, totalChunks } = metadata;
  
  // Create a destination file
  const destPath = path.join(tempDir, fileName);
  const destStream = fs.createWriteStream(destPath);
  
  // Read and append each chunk in order
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(uploadDir, `chunk-${i}`);
    if (!fs.existsSync(chunkPath)) {
      throw new ApiError(400, `Chunk ${i} is missing`);
    }
    
    // Read the chunk and append to destination file
    await new Promise((resolve, reject) => {
      const chunkStream = fs.createReadStream(chunkPath);
      chunkStream.pipe(destStream, { end: false });
      chunkStream.on('end', resolve);
      chunkStream.on('error', reject);
    });
  }
  
  // Close the destination file
  await new Promise((resolve) => {
    destStream.end(resolve);
  });
  
  // Clean up chunks
  fs.rmSync(uploadDir, { recursive: true, force: true });
  
  return { path: destPath, metadata };
};

// Handler to finalize the upload and save the video
const addVideo = asyncHandler(async (req, res) => {
  const { videoFileId, thumbnailFileId, title, des, tags } = req.body;
  
  if (!videoFileId || !thumbnailFileId) {
    throw new ApiError(400, "Video and thumbnail file IDs are required");
  }
  
  if (!title) {
    throw new ApiError(400, "Title is required");
  }
  
  if (!des) {
    throw new ApiError(400, "Description is required");
  }
  
  try {
    // Merge video chunks
    const { path: videoPath } = await mergeChunks(videoFileId);
    
    // Merge thumbnail chunks
    const { path: thumbnailPath } = await mergeChunks(thumbnailFileId);
    
    // Upload to Cloudinary
    const [videoUpload, imageUpload] = await Promise.all([
      uploadOnCloudinary(videoPath),
      uploadOnCloudinary(thumbnailPath)
    ]);
    
    const videoUrl = videoUpload?.url;
    const imgUrl = imageUpload?.url;
    
    if (!videoUrl || !imgUrl) {
      throw new ApiError(500, "Failed to upload files to storage");
    }
    
    // Parse tags
    const tagsArr = tags ? tags.split(",").map(tag => tag.trim()) : [];
    
    // Save video details in the database
    const saveVideo = await Video.create({
      userId: req.user.id,
      videoUrl,
      imgUrl,
      tags: tagsArr,
      title,
      des
    });
    
    // Clean up temporary files
    fs.unlinkSync(videoPath);
    fs.unlinkSync(thumbnailPath);
    
    res.status(201).json(
      new ApiResponse(201, saveVideo, "Video uploaded successfully")
    );
    
  } catch (error) {
    console.error("Error processing upload:", error);
    throw new ApiError(500, `File upload failed: ${error.message}`);
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
