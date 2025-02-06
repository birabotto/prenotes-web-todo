import { FaArrowCircleLeft } from "react-icons/fa";
interface BackButtonProps {
  back: () => void;
}

const BackButton = ({ back }: BackButtonProps) => {
  return (
    <FaArrowCircleLeft
      size={24}
      className="text-menu bg-menuText rounded-full cursor-pointer"
      onClick={back}
    />
  );
};

export default BackButton;
