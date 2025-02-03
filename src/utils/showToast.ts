import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

type ToastType = "error" | "success" | "warning";

const showToast = (message: string, type: ToastType) => {
  const toastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
    style: {
      fontSize: "16px",
      borderRadius: "8px",
      padding: "12px 20px",
      height: "auto",
    },
  };

  // Ajuste para mobile
  if (window.innerWidth <= 768) {
    toastOptions.style = {
      ...toastOptions.style,
      fontSize: "14px",
      padding: "10px 15px",
      maxWidth: "50%",
      margin: "0 20px 10px 0",
      height: "auto",
    };
  }

  switch (type) {
    case "error":
      toast.error(message, toastOptions);
      break;
    case "success":
      toast.success(message, toastOptions);
      break;
    case "warning":
      toast.warn(message, toastOptions);
      break;
    default:
      toast.info(message, toastOptions);
  }
};

export default showToast;
