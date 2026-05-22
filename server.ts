import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import next from "next";
import { Server as ServerIo } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      // Let Next.js handle everything EXCEPT the socket path
      const parsedUrl = parse(req.url!, true);

      if (parsedUrl.pathname?.startsWith("/api/socket/io")) {
        // Socket.IO handles this via its own middleware, just end non-upgrade requests
        res.writeHead(200);
        res.end();
        return;
      }

      handle(req, res, parsedUrl);
    },
  );

  const io = new ServerIo(httpServer, {
    path: "/api/socket/io",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  (global as any).io = io;

  httpServer.listen(3000, () => {
    console.log("✅ Server ready on http://localhost:3000");
    console.log("🔌 Socket.IO on /api/socket/io");
  });
});
