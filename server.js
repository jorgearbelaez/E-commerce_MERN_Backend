const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/apiRoutes");
const port = process.env.PORT || 8080;

const app = express();

const httpServer = createServer(app);
global.io = new Server(httpServer);

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

app.get("/", async (req, res, next) => {
  res.json({ message: "API running..." });
});

// mongodb connection
connectDB();

app.use("/api", apiRoutes);

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error);
});
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  } else {
    res.status(500).json({
      message: error.message,
    });
  }
});

httpServer.listen(port, () => {
  console.log(`server runing on port  ${port}`);
});
