// "use client";

// import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";

// export function ThemeProvider({
//   children,
//   ...props
// }: React.ComponentProps<typeof NextThemesProvider>) {
//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
// }

// "use client";

// import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";

// export function ThemeProvider({
//   children,
//   ...props
// }: React.ComponentProps<typeof NextThemesProvider>) {
//   return (
//     <NextThemesProvider
//       {...props}
//       scriptProps={{ "data-cfasync": "false" }} // 👈 suppresses the script warning
//     >
//       {children}
//     </NextThemesProvider>
//   );
// }

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Suppress React 19 + Turbopack false positive for next-themes script injection
const _consoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Cannot render a sync or defer <script>") ||
      args[0].includes("Encountered a script tag"))
  )
    return;
  _consoleError(...args);
};

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
