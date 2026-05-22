// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
// import { auth } from "@clerk/nextjs/server";

// const f = createUploadthing();

// const handleAuth = () => {
//   const userId = auth();
//   if (!userId) throw new Error("Unauthorized");
//   return { userId: userId };
// };

// export const ourFileRouter = {
//   serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
//     .middleware(() => handleAuth())
//     .onUploadComplete(() => {}),
//   messageFile: f(["image", "pdf"])
//     .middleware(() => handleAuth())
//     .onUploadComplete(() => {}),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = async () => {
  console.log("[UPLOADTHING] 🔐 handleAuth called");

  const { userId } = await auth();
  console.log("[UPLOADTHING] 👤 userId from auth():", userId);

  if (!userId) {
    console.error("[UPLOADTHING] ❌ No userId found — throwing Unauthorized");
    throw new UploadThingError("Unauthorized");
  }

  console.log("[UPLOADTHING] ✅ Auth passed for userId:", userId);
  return { userId };
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      console.log("[UPLOADTHING] 🖼 serverImage middleware running");
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UPLOADTHING] ✅ serverImage upload complete:", {
        userId: metadata.userId,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: file.url,
      });
    }),
  messageFile: f(["image", "pdf"])
    .middleware(async () => {
      console.log("[UPLOADTHING] 📎 messageFile middleware running");
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UPLOADTHING] ✅ messageFile upload complete:", {
        userId: metadata.userId,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: file.url,
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
