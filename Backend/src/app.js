import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET","POST","PATCH","PUT","DELETE"],
    credentials: true,
  })
);


app.get("/",(req, res)=>{
  res.send("hello")
})

// ⁡⁢⁣⁢+⁡ configuration of data: -

// if data is comming as a json
  app.use(
    express.json({
      // Middleware
      limit: "16kb",
    })
  );

// if data is comming from URL
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// if pdf is come or some comming like public accests:-
app.use(express.static("public"));

// to perform CRUD operation on cookies:-
app.use(cookieParser());

// ⁡⁢⁣⁢+⁡ routes import
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/comment", commentRouter);
// url: -http://localhost:8000/api/v1/users/${route}

export { app };
