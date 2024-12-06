import EditTestSheet from "@/features/tests/components/edit-test-sheet";
import NewTestSheet from "@/features/tests/components/new-test-sheet";

const SheetProvider = () => {
  return (
    <>
      <NewTestSheet />
      <EditTestSheet />
    </>
  );
};

export default SheetProvider;
