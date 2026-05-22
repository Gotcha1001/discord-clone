// import { currentProfile } from "@/lib/current-profile";
// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function PATCH(
//   req: Request,
//   { params }: { params: { serverId: string } },
// ) {
//   try {
//     const profile = await currentProfile();
//     const { name, imageUrl } = await req.json();

//     if (!profile) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const server = await db.server.update({
//       where: {
//         id: params.serverId,
//         profileId: profile.id,
//       },
//       data: {
//         name,
//         imageUrl,
//       },
//     });
//     return NextResponse.json(server);
//   } catch (error) {
//     console.log("[SERVER_ID_PATCH]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> },
) {
  try {
    const { serverId } = await params;
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }, // 👈 Promise type
) {
  try {
    const { serverId } = await params; // 👈 await before use
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return new NextResponse("Bad Request: expected JSON body", {
        status: 400,
      });
    }

    const body = await req.text();
    if (!body) {
      return new NextResponse("Bad Request: empty body", { status: 400 });
    }

    const { name, imageUrl } = JSON.parse(body);

    if (!name) {
      return new NextResponse("Bad Request: name is required", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId, // 👈 use destructured value, not params.serverId
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
