import { FaArrowCircleLeft } from "react-icons/fa";
interface BackButtonProps {
  back: () => void;
}

const BackButton = ({ back }: BackButtonProps) => {
  return (
    <FaArrowCircleLeft
      size={20}
      className="text-menu bg-menuText rounded-full"
      onClick={back}
    />
  );
};

export default BackButton;
