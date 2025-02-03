import { useState } from "react";
import showToast from "../utils/showToast";
import axiosConfig from "../shared/axiosConfig";

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
      showToast("Please, choose a file to send.", "warning");
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
    <div className="mb-4">
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center w-full px-6 py-3 mb-2 bg-buttonGray text-black font-medium rounded-lg cursor-pointer shadow-md hover:bg-buttonGrayHover focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {selectedFile ? selectedFile.name : "Choose file"}
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden z-10"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default FileUploader;
