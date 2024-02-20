const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require('fs-extra');
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (_req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  },
});

const multerFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

const productImgResize = async (req, _res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
      fs.removeSync(`public/images/products/${file.filename}`);
    })
  );
  next();
};

module.exports = { uploadPhoto, productImgResize };
