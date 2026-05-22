"use client";
import { FileIcon, X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
// import "@uploadthing/react/styles.css";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image src={value} alt="Uploaded file" fill className="rounded-full" />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-0 right-0 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 transition shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 transition shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      config={{ mode: "auto" }} // 👈 ADD THIS
      onUploadBegin={(name) => {
        console.log("[FILE_UPLOAD] ⏳ Upload started:", {
          endpoint,
          fileName: name,
        });
      }}
      onClientUploadComplete={(res) => {
        console.log("[FILE_UPLOAD] ✅ Upload complete. Raw response:", res);
        console.log(
          "[FILE_UPLOAD] 🔍 Keys:",
          res?.[0] ? Object.keys(res[0]) : "empty",
        );

        const url = res?.[0]?.ufsUrl ?? res?.[0]?.url; // 👈 CHANGE THIS

        if (!url) {
          console.error("[FILE_UPLOAD] ❌ No URL in response:", res);
          return;
        }
        console.log("[FILE_UPLOAD] 🔗 Calling onChange with URL:", url);
        onChange(url);
      }}
      onUploadError={(error: Error) => {
        console.error("[FILE_UPLOAD] ❌ Upload error:", {
          message: error.message,
          cause: (error as any).cause,
          data: (error as any).data,
        });
      }}
      onUploadProgress={(progress) => {
        console.log("[FILE_UPLOAD] 📶 Progress:", progress + "%");
      }}
    />
  );
};
