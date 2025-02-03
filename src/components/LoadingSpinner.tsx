import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <FaSpinner className="animate-spin text-4xl text-white" />
  </div>
);

export default LoadingSpinner;
