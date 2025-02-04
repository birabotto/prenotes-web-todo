import { useState } from "react";
import showToast from "../utils/showToast";
import axiosConfig from "../shared/axiosConfig";
import SaveButton from "./buttons/SaveButton";

interface FileUploaderProps {
  onUploadSuccess: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Please, choose a file to send.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);
    try {
      await axiosConfig.post("/v1/api/prenotes/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSelectedFile(null);
      onUploadSuccess();
      showToast("The file was imported successfully.", "success");
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message || "Failed to upload file.", "error");
      } else {
        showToast("An unexpected error occurred.", "error");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-4 mt-2">
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center w-full px-6 py-3 mb-4 bg-fileButton border text-black  rounded-lg hover:text-black font-bold  cursor-pointer shadow-md hover:bg-fileButtonHover focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {selectedFile ? selectedFile.name : "Choose file"}
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden z-10"
        onChange={handleFileChange}
      />
      <SaveButton
        handleSubmit={handleUpload}
        isUploading={isUploading}
        name="Upload"
        nameLoading="Uploading..."
      />
    </div>
  );
};

export default FileUploader;
