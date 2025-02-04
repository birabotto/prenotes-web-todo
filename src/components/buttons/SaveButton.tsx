interface SaveButtonProps {
  isUploading: boolean;
  name: string;
  nameLoading: string;
  handleSubmit: (e: React.FormEvent) => void;
}

const SaveButton = ({
  isUploading,
  name,
  nameLoading,
  handleSubmit,
}: SaveButtonProps) => {
  return (
    <button
      onClick={handleSubmit}
      disabled={isUploading}
      className="w-full px-6 py-3 bg-uploadButton text-black hover:text-black font-bold border rounded-lg shadow-md hover:bg-uploadButtonHover"
    >
      {isUploading ? nameLoading : name}
    </button>
  );
};

export default SaveButton;
