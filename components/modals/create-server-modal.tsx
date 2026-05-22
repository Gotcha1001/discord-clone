// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { FileUpload } from "../file-upload";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { useModal } from "@/hooks/use-modal-store";

// const formSchema = z.object({
//   name: z.string().min(1, { message: "Server name is required" }),
//   imageUrl: z.string().min(1, { message: "Server image is required" }),
// });

// export const CreateServerModal = () => {
//   const { isOpen, onClose, type } = useModal();
//   const router = useRouter();

//   const isModalOpen = isOpen && type === "createServer";

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       imageUrl: "",
//     },
//   });

//   const isLoading = form.formState.isSubmitting;

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       await axios.post("/api/servers", values);
//       form.reset();
//       router.refresh();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleClose = () => {
//     form.reset();
//     onClose();
//   };

//   return (
//     <Dialog open={isModalOpen} onOpenChange={handleClose}>
//       <DialogContent className="bg-white text-black p-0 overflow-hidden">
//         <DialogHeader className="pt-8 px-6">
//           <DialogTitle className="text-center text-2xl font-bold">
//             Customize your server
//           </DialogTitle>
//           <DialogDescription className="text-center text-zinc-500 mt-2">
//             Give your server a personality with a name and an image. You can
//             always change it later.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <div className="space-y-8 px-6">
//               <div className="flex items-center justify-center text-center">
//                 <FormField
//                   control={form.control}
//                   name="imageUrl"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <FileUpload
//                           endpoint="serverImage"
//                           value={field.value}
//                           onChange={field.onChange}
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
//                       Server name
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         disabled={isLoading}
//                         className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
//                         placeholder="Enter server name"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <DialogFooter className="bg-gray-100 px-6 py-4">
//               <Button type="submit" variant={"primary"} disabled={isLoading}>
//                 Create
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// };

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  name: z.string().min(1, { message: "Server name is required" }),
  imageUrl: z.string().min(1, { message: "Server image is required" }),
});

export const CreateServerModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "createServer";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("[CREATE_SERVER] 🚀 onSubmit fired with values:", values);
    try {
      console.log("[CREATE_SERVER] 📡 POSTing to /api/servers...");
      const response = await axios.post("/api/servers", values);
      console.log(
        "[CREATE_SERVER] ✅ Server created successfully:",
        response.data,
      );
      form.reset();
      router.refresh();
      onClose();
    } catch (error: any) {
      console.error("[CREATE_SERVER] ❌ Failed to create server:", {
        message: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      });
    }
  };

  // Log whenever the form's validity/values change
  const watchedValues = form.watch();
  console.log("[CREATE_SERVER] 👁 Form state:", {
    values: watchedValues,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
  });

  const handleClose = () => {
    console.log("[CREATE_SERVER] 🔒 Modal closing, resetting form");
    form.reset();
    onClose();
  };

  const handleInvalidSubmit = (errors: any) => {
    console.warn("[CREATE_SERVER] ⚠️ Form validation failed:", errors);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 mt-2">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, handleInvalidSubmit)}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={(url) => {
                            console.log(
                              "[CREATE_SERVER] 🖼 imageUrl field updated:",
                              url,
                            );
                            field.onChange(url);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button type="submit" variant={"primary"} disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
