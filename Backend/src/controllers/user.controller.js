import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const options = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'development',
	sameSite: 'none',
	path: '/',
	maxAge: 15 * 60 * 1000,
};


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: name, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { email, name, password } = req.body;
  //console.log("email: ", email);

  if ([email, name, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or name already exists");
  }
  console.log(req.files);

  // let avatarLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.avatar) &&
  //   req.files.avatar.length > 0
  // ) {
  //   avatarLocalPath = req.files.avatar[0]?.path;
  // }

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);

  // if (!avatar) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  const user = await User.create({
    email,
    password,
    name,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // name or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { name, password } = req.body;
  console.log(name);

  if (!name) {
    throw new ApiError(400, "username is required");
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(name || email)) {
  //     throw new ApiError(400, "name or email is required")

  // }

  const user = await User.findOne({ name });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );


  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }



    const {
      accessToken,
      newRefreshToken,
    } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req?.user, "User fetched successfully"));
});

const getUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return next(new ApiError(400, "User ID is required"));
  }

  try {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      return next(new ApiError(404, "User Not Found"));
    }

    res.status(200).json(new ApiResponse(200, user, "User found successfully"));
  } catch (err) {
    next(err);
  }
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  //TODO: delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  //TODO: delete old image - assignment

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { name } = req.params;
  console.log(name);
  if (!name?.trim()) {
    throw new ApiError(400, "name is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        name: name,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        name: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    name: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

const deleteUser = asyncHandler(async (req, res) => {
  if (!req.params.id === req.user.id) {
    throw new ApiError(400, "User not found");
  }
  await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new ApiError(500, "Fail to delete account");
  }
  return res
    .status(200)
    .json(new ApiResponse(201, "User deleted successfully."));
});

const subscribe = asyncHandler(async (req, res, next) => {
  console.log("Channel ID to subscribe:", req.params.id);

  try {
    const userId = req.user.id;
    const channelId = req.params.id;

    const channelUser = await User.findById(channelId);


    if (channelUser.subscribedUsers.includes(channelId)) {
      throw new ApiError(400, "You are already subscribed to this channel.")
    }


    await User.findByIdAndUpdate(channelId, {
      $addToSet: { subscribedUsers: userId },
    });

    const updatedChannelUser = await User.findByIdAndUpdate(
      channelId,
      { $inc: { subscribers: 1 } },
      { new: true }
    );

    console.log("Updated Channel User:", updatedChannelUser);

    res.status(200).json(new ApiResponse(200, null, "Subscription successful."));
  } catch (err) {
    next(err);
  }
});

const unsubscribe = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { subscribedUsers: req.params.id },
  });
  await User.findByIdAndUpdate(req.params.id, {
    $inc: { subscribers: -1 },
  });

  res.status(200).json(new ApiResponse(201, null, "Unsubscription successfully"));
});

const like = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  await Video.findByIdAndUpdate(
    videoId,
    {
      $addToSet: { likes: id },
      $pull: { dislikes: id }
    }
  )
  res.status(200).json(new ApiResponse(201, null, "the video has been liked"))
});

const dislike = asyncHandler(async (req, res) => {
  const id = req.user.id;
  // console.log(id);
  const videoId = req.params.videoId;
  // console.log(videoId);
  const data = await Video.findByIdAndUpdate(
    videoId,
    {
      $addToSet: { dislikes: id },
      $pull: { likes: id }
    }
  )
  // console.log(data)
  res.status(200).json(new ApiResponse(201, null, "the video has been disliked"))
});

const getMyVideos = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const videos = await Video.aggregate([
    {
      $match: { userId: userId }
    }
  ])

  return res.status(200).json(new ApiResponse(201, videos, "Vid fetched"))
});

const getSubs = asyncHandler(async (req, res) => {
  const userId = req.user._id
  console.log(req.user);

  // const subs = await User.aggregate([
  //   {
  //     $match: {
  //       subscribedUsers: userId
  //     }
  //   }
  // ])

  const subscribedChannels = await User.find({
    subscribedUsers: { $in: [userId] }
  }).select('name email avatar subscribers');

  return res.status(200).json(new ApiResponse(201, subscribedChannels, "fetched Subscribed channels"))
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getUser,
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
  getSubs,
  getMyVideos
};
