import { FaArrowCircleLeft } from "react-icons/fa";
interface BackButtonProps {
  back: () => void;
}

const BackButton = ({ back }: BackButtonProps) => {
  return (
    <button
      className="px-3 py-2 bg-menu text-menuText rounded-full shadow    text-xs sm:text-sm cursor-pointer"
      onClick={back}
    >
      <FaArrowCircleLeft />
    </button>
  );
};

export default BackButton;
