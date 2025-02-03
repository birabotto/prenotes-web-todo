import { usePrenotes } from "../../hooks/usePrenotes";
import FileUploader from "../../components/FileUploader";
import PrenotesList from "../../components/PrenotesList";
import LoadingSpinner from "../../components/LoadingSpinner";
import ToastProvider from "../../components/ToastProvider";

export default function S3() {
  const { prenotes, isLoading, fetchPrenotes } = usePrenotes();

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ToastProvider />
      <FileUploader onUploadSuccess={fetchPrenotes} />
      <PrenotesList prenotes={prenotes} />
    </>
  );
}
