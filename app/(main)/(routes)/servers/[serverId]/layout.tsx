// import { currentProfile } from "@/lib/current-profile";
// import { db } from "@/lib/db";
// import { RedirectToSignIn } from "@clerk/nextjs";
// import { redirect } from "next/navigation";

// const ServerIdLayout = async ({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: { serverId: string };
// }) => {
//   const profile = await currentProfile();

//   if (!profile) {
//     return <RedirectToSignIn />;
//   }

//   const server = await db.server.findUnique({
//     where: {
//       id: params.serverId,
//       members: {
//         some: {
//           profileId: profile.id,
//         },
//       },
//     },
//   });

//   if (!server) {
//     return redirect("/");
//   }

//   return (
//     <div className="h-full">
//       <div className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0"></div>
//       <main className="h-full md:pl-60">{children}</main>
//     </div>
//   );
// };

// export default ServerIdLayout;

import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>; // 👈 now a Promise
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return <RedirectToSignIn />;
  }

  const { serverId } = await params; // 👈 await it

  if (!serverId) {
    console.error("[SERVER_ID_LAYOUT] ❌ No serverId in params");
    return redirect("/");
  }

  console.log("[SERVER_ID_LAYOUT] 🔍 Looking up serverId:", serverId);

  const server = await db.server.findUnique({
    where: {
      id: serverId, // 👈 use the awaited value
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  console.log("[SERVER_ID_LAYOUT] 🏠 Server found:", server?.id ?? "NOT FOUND");

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={(await params).serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
