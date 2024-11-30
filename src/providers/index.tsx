import type React from "react";

import AuthProvider from "./auth-provider";
import ToastProvider from "./toast-provider";
import QueryProvider from "./query-provider";

interface Pros {
  children: React.ReactNode;
}

const Provider = ({ children }: Pros) => {
  return (
    <AuthProvider>
      <QueryProvider>
        <ToastProvider>{children}</ToastProvider>
      </QueryProvider>
    </AuthProvider>
  );
};

export default Provider;
