import { Server } from "socket.io";

export function setupRaceSocket(io: Server): void {
  const raceNs = io.of("/race");

  raceNs.on("connection", (socket) => {
    socket.on("room:create", (data, cb) => {
      const roomId = `room_${Date.now()}`;
      socket.join(roomId);
      cb?.({ roomId, message: "Room created (Phase 2)" });
    });

    socket.on("room:join", (data: { roomId: string }, cb) => {
      if (data?.roomId) socket.join(data.roomId);
      cb?.({ joined: data?.roomId });
    });
  });
}
