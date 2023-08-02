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

//socket for real time chat
const admins = [];
let activeChats = [];
function get_random(array) {
   return array[Math.floor(Math.random() * array.length)]; 
}

io.on("connection", (socket) => {
  socket.on("admin connected with server", (adminName) => {
    admins.push({ id: socket.id, admin: adminName });
  });
  socket.on("client sends message", (msg) => {
    if (admins.length === 0) {
      socket.emit("no admin", "");
    } else {
       let client = activeChats.find((client) => client.clientId === socket.id);
        let targetAdminId;
        if (client) {
           targetAdminId = client.adminId; 
        } else {
           let admin = get_random(admins); 
           activeChats.push({ clientId: socket.id, adminId: admin.id });
           targetAdminId = admin.id;
        }
      socket.broadcast.to(targetAdminId).emit("server sends message from client to admin", {
          user: socket.id,
        message: msg,
      });
    }
  });

  socket.on("admin sends message", ({ user,message }) => {
    socket.broadcast.to(user).emit("server sends message from admin to client", message);
  });

  socket.on("disconnect", (reason) => {
    // admin disconnected
    const removeIndex = admins.findIndex((item) => item.id === socket.id);
    if (removeIndex !== -1) {
      admins.splice(removeIndex, 1);
    }
  });
});


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
