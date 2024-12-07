import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const useConfirm = (
  title: string,
  message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolove: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolove) => {
      setPromise({ resolove });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolove(true);
    handleClose();
  };

  const handleChancel = () => {
    promise?.resolove(false);
    handleClose();
  };

  const ConfirmationDailog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleChancel} variant="outline">
            やめる
          </Button>
          <Button onClick={handleConfirm}>確認した</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDailog, confirm];
};

export default useConfirm;
