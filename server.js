const app = require('express')();
const server = require('http').createServer(app);
const socketio = require('socket.io');
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = 4001;

io.on("connection", (socket) => {
    console.log(`New user: ${socket.id}`);

    // socket.emit("loadPlayer", socket.id);

    socket.on('squareClicked', (data) => {
        // console.log(socket.id + " clicked " + data.currentTurn);
        socket.broadcast.emit("squareClicked", data);
    })

    socket.on('resetClicked', (data) => {
        // console.log(socket.id + " reset ");
        socket.broadcast.emit("resetClicked", data);
    })

    socket.on('disconnect', () => {
        console.log(`Disconnected user: ${socket.id}`);
    })
})

server.listen(PORT, () => console.log("Listening on port " + PORT ));