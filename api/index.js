import express from "express";
import userRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import likesRoutes from "./routes/likes.js";
import commentsRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
const app = express();

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage
  // fileFilter: function(req, file, cb) {
  //   // Allowed audio MIME types
  //   const filetypes = /audio\/(mpeg|mp3|wav|ogg)/;
  //   // Check MIME type
  //   const mimetype = filetypes.test(file.mimetype);

  //   if (mimetype) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Only audio files are allowed!'), false);
  //   }
  // }
});

app.post("/api/upload", upload.single("file"), (req, resp) => {
  const file = req.file;
  resp.status(200).send(file.filename);
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/auth", authRoutes);

app.listen(8800, () => {
  console.log("API funciona!");
});
