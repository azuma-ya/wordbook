import { Toaster } from "@/components/ui/toaster";

interface Props {
  children: React.ReactNode;
}

const ToastProvider = ({ children }: Props) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default ToastProvider;
