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
      className="px-6 py-3 bg-[#0058a3] w-full text-[#d6bf00] font-semibold rounded-lg shadow-md hover:bg-[#004080] hover:text-[#ffd700] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d6bf00] focus:ring-opacity-50"
      onClick={handleSubmit}
      disabled={isUploading}
    >
      {isUploading ? nameLoading : name}
    </button>
  );
};

export default SaveButton;
