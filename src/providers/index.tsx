import type React from "react";

import AuthProvider from "./auth-provider";
import ToastProvider from "./toast-provider";
import QueryProvider from "./query-provider";
import SheetProvider from "./sheet-provider";
import DrawerProvider from "./drawer-provider";

interface Pros {
  children: React.ReactNode;
}

const Provider = ({ children }: Pros) => {
  return (
    <AuthProvider>
      <QueryProvider>
        <ToastProvider>
          <SheetProvider />
          <DrawerProvider />
          {children}
        </ToastProvider>
      </QueryProvider>
    </AuthProvider>
  );
};

export default Provider;
