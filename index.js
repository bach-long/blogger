const { Server } = require("socket.io");

const io = new Server({ cors: {
    origin : "http://localhost:3000"
}});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const removeByUsername = (username) => {
  onlineUsers = onlineUsers.filter((user) => user.username !== username);
}

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    if(getUser(username)) {
      removeByUsername(username);
    }
    addNewUser(username, socket.id);
    console.log(onlineUsers, socket.id);
  });

  socket.on("sendNotification", (data) => {
    delete data.pivot.sender;
    console.log(data);
    const receiver = getUser(data.receiverName);
    if(receiver) {
      io.to(receiver.socketId).emit("getNotification",
        data
      );
    }
  });

  //socket.on("sendText", ({ senderName, receiverName, text }) => {
  //  const receiver = getUser(receiverName);
  //  io.to(receiver.socketId).emit("getText", {
  //    senderName,
  //    text,
  //  });
  //});
  socket.on("logout", () => {
    removeUser(socket.id);
    console.log(onlineUsers);
  })
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log(onlineUsers);
  });
});

io.listen(5000);