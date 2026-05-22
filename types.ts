import { Channel, Member, Profile, Server } from "./lib/generated/prisma";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type MemberWithProfile = Member & {
  profile: Profile;
};

export type ServerWithMembersWithProfiles = Server & {
  channels: Channel[];
  members: MemberWithProfile[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
