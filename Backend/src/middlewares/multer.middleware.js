import multer from "multer";
import path from "path"
import { ApiError } from "../utils/ApiError.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})


function checkVideoFileType(file, cb) {
  const filetypes = /mp4|mkv|mov/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Videos Only!');
  }
}

function checkImageFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|avif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const uploadVideo = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkVideoFileType(file, cb);
  }
});

const uploadImage = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkImageFileType(file, cb);
  }
});

export const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'imgUrl' || file.fieldname === "avatar") {
      checkImageFileType(file, cb);
    } else if (file.fieldname === 'videoUrl') {
      checkVideoFileType(file, cb);
    }
  }
})