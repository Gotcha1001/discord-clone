// import { currentProfile } from "@/lib/current-profile";
// import { db } from "@/lib/db";
// import { MemberRole } from "@/lib/generated/prisma";
// import { NextResponse } from "next/server";
// import { v4 as uuid4 } from "uuid";

// export async function POST(req: Request) {
//   try {
//     const { name, imageUrl } = await req.json();
//     const profile = await currentProfile();

//     if (!profile) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const server = await db.server.create({
//       data: {
//         profileId: profile.id,
//         name,
//         imageUrl,
//         inviteCode: uuid4(),
//         channels: {
//           create: [{ name: "general", profileId: profile.id }],
//         },
//         members: {
//           create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
//         },
//       },
//     });
//     return NextResponse.json(server);
//   } catch (error) {
//     console.log("[SERVERS_POST]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";
import { v4 as uuid4 } from "uuid";

export async function POST(req: Request) {
  console.log("[SERVERS_POST] 🚀 Request received");

  try {
    const body = await req.json();
    console.log("[SERVERS_POST] 📦 Request body:", body);

    const { name, imageUrl } = body;

    if (!name || !imageUrl) {
      console.warn("[SERVERS_POST] ⚠️ Missing fields:", {
        hasName: !!name,
        hasImageUrl: !!imageUrl,
      });
    }

    console.log("[SERVERS_POST] 🔐 Fetching current profile...");
    const profile = await currentProfile();
    console.log(
      "[SERVERS_POST] 👤 Profile result:",
      profile?.id ?? "NOT FOUND",
    );

    if (!profile) {
      console.error("[SERVERS_POST] ❌ Unauthorized — no profile found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("[SERVERS_POST] 💾 Creating server in DB with:", {
      name,
      imageUrl,
      profileId: profile.id,
    });

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuid4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    console.log("[SERVERS_POST] ✅ Server created successfully:", {
      serverId: server.id,
      name: server.name,
      profileId: server.profileId,
    });

    return NextResponse.json(server);
  } catch (error: any) {
    console.error("[SERVERS_POST] ❌ Error:", {
      message: error?.message,
      code: error?.code, // Prisma error code e.g. P2002 (unique constraint)
      meta: error?.meta, // Prisma error meta e.g. which field caused it
      stack: error?.stack,
    });
    return new NextResponse("Internal error", { status: 500 });
  }
}
