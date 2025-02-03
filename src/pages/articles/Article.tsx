import { useParams, useNavigate } from "react-router-dom";
import useSocket from "../../hooks/useSocket";
import { useState, useEffect, useRef } from "react";
import axiosConfig from "../../shared/axiosConfig";
import { FaSpinner } from "react-icons/fa";
import BackButton from "../../components/buttons/BackButton";

type FormDataType = {
  name: string;
  location: string;
  order_qty: number;
  item: number;
  qty_in_sales: number;
  assq: number;
  mpq: number;
  palq: number;
  ms: boolean;
  bts: boolean;
  top_up: boolean;
  done: boolean;
  image_url: string;
  file: File | null;
  imagePreview: string | null;
  notes: string;
};

const Article = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [prenotes_id, setPrenotes_id] = useState("");
  const { id } = useParams();
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paths, setPaths] = useState<{ x: number; y: number }[][]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>(
    []
  );
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    location: "",
    order_qty: 0,
    item: 0,
    qty_in_sales: 0,
    assq: 0,
    mpq: 0,
    palq: 0,
    ms: false,
    bts: false,
    top_up: false,
    done: false,
    image_url: "",
    file: null,
    imagePreview: null,
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageScale] = useState(1);
  const [imageOffsetX] = useState(0);
  const [imageOffsetY] = useState(0);

  useEffect(() => {
    if (!socket) {
      console.error("Socket instance is not available.");
      return;
    }

    if (!socket.connected) {
      console.warn("Socket is not connected. Attempting to connect...");
      socket.connect();
    }

    articleFindById();

    return () => {
      if (socket.connected) {
        socket.emit("updateAvailable", id);
        socket.disconnect();
      }
    };
  }, [id, socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (formData.imagePreview) {
      const img = new Image();
      img.src = formData.imagePreview;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        paths.forEach((path) => {
          ctx.beginPath();
          for (let i = 0; i < path.length; i++) {
            const { x, y } = path[i];
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });
      };
    }
  }, [formData.imagePreview, paths]);

  const back = () => {
    const parsedId = Number(id);
    const parsedPrenotesId = Number(prenotes_id);

    if (!socket) {
      console.error("Socket is not connected. Attempting to connect...");
      return;
    }

    if (!parsedId || !parsedPrenotesId) {
      console.error("Missing or invalid id or prenotes_id for back action");
      return;
    }

    if (!socket.connected) {
      console.warn("Socket is not connected. Attempting to connect...");
      socket.connect();
    }

    socket.emit("updateAvailable", parsedId);

    navigate(`/articles/prenote/${parsedPrenotesId}`);
  };

  const articleFindById = async () => {
    try {
      setIsLoading(true);
      const response = await axiosConfig.get(`v1/api/articles/${id}`);
      const data = response.data.data;
      setPrenotes_id(data.prenoteId);
      setFormData({
        name: data.name || "",
        location: data.location || "",
        order_qty: data.order_qty || 0,
        qty_in_sales: data.qty_in_sales || 0,
        item: data.item || 0,
        assq: data.assq || 0,
        mpq: data.mpq || 0,
        palq: data.palq || 0,
        ms: data.ms || false,
        top_up: data.top_up || false,
        bts: data.bts || false,
        done: data.done || false,
        notes: data.notes || "",
        image_url: data.image_url || "",
        file: null,
        imagePreview: null,
      });
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL("image/png");
      const blob = await fetch(dataURL).then((res) => res.blob());
      const file = new File([blob], "edited-image.png", { type: "image/png" });
      setFormData((prevData) => ({
        ...prevData,
        file,
      }));
      formDataToSend.append("file", file);
    }

    formDataToSend.append("ms", formData.ms ? "true" : "false");
    formDataToSend.append("bts", formData.bts ? "true" : "false");
    formDataToSend.append("top_up", formData.top_up ? "true" : "false");
    formDataToSend.append("done", formData.done ? "true" : "false");
    formDataToSend.append("notes", formData.notes);

    try {
      setIsSubmitting(true);
      await axiosConfig.put(`v1/api/articles/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!socket) {
        console.error("Socket is not connected. Attempting to connect...");
        return;
      }

      if (socket.connected) {
        socket.emit("updateAvailable", id);
      } else {
        console.error("Socket is not connected");
      }

      navigate(`/articles/prenote/${prenotes_id}`);
    } catch (error) {
      console.error("Error submitting the form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imagePreview = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        file,
        imagePreview,
      }));
    } else {
      console.log("No file selected");
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const adjustedX = (x - imageOffsetX) / imageScale;
    const adjustedY = (y - imageOffsetY) / imageScale;

    ctx.beginPath();
    ctx.moveTo(adjustedX, adjustedY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const adjustedX = (x - imageOffsetX) / imageScale;
    const adjustedY = (y - imageOffsetY) / imageScale;

    setCurrentPath((prev) => [...prev, { x: adjustedX, y: adjustedY }]);

    ctx.lineTo(adjustedX, adjustedY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setPaths((prevPaths) => [...prevPaths, currentPath]);
    setCurrentPath([]);
  };

  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Impede o scroll
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const adjustedX = (x - imageOffsetX) / imageScale;
    const adjustedY = (y - imageOffsetY) / imageScale;

    ctx.beginPath();
    ctx.moveTo(adjustedX, adjustedY);
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Impede o scroll
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const adjustedX = (x - imageOffsetX) / imageScale;
    const adjustedY = (y - imageOffsetY) / imageScale;

    ctx.lineTo(adjustedX, adjustedY);
    ctx.stroke();
  };

  const stopDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Impede o scroll
    setIsDrawing(false);
  };

  useEffect(() => {
    const preventTouchScroll = (e: TouchEvent) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventTouchScroll, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventTouchScroll);
    };
  }, [isDrawing]);

  return (
    <>
      <BackButton back={back} />

      <h2 className="text-xl font-semibold mb-4"></h2>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Article
            </label>
            <input
              disabled
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex-1">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="location"
                >
                  Location
                </label>
                <input
                  disabled
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
                />
              </div>

              <div className="flex-1">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="item"
                >
                  Item
                </label>
                <input
                  disabled
                  type="text"
                  id="item"
                  name="item"
                  value={formData.item}
                  onChange={handleInputChange}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex-1">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="OrderQty"
                >
                  Order Qty
                </label>
                <input
                  disabled
                  type="text"
                  id="order_qty"
                  name="order_qty"
                  value={formData.order_qty}
                  onChange={handleInputChange}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
                />
              </div>

              <div className="flex-1">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="qty_in_sales"
                >
                  Qty In Sales
                </label>
                <input
                  disabled
                  type="text"
                  id="qty_in_sales"
                  name="qty_in_sales"
                  value={formData.qty_in_sales}
                  onChange={handleInputChange}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
                />
              </div>

              <div className="flex-1">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="ASSQ"
                >
                  ASSQ
                </label>
                <input
                  disabled
                  type="text"
                  id="assq"
                  name="assq"
                  value={formData.assq}
                  onChange={handleInputChange}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex-1">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="mpq"
                >
                  MPQ
                </label>
                <input
                  disabled
                  type="text"
                  id="mpq"
                  name="mpq"
                  value={formData.mpq}
                  onChange={handleInputChange}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
                />
              </div>

              <div className="flex-1">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="item"
                >
                  PALQ
                </label>
                <input
                  disabled
                  type="text"
                  id="palq"
                  name="palq"
                  value={formData.palq}
                  onChange={handleInputChange}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="ms"
                checked={formData.ms}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-green-500"
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-700">MS</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="bts"
                checked={formData.bts}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-green-500"
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-700">BTS</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="top_up"
                checked={formData.top_up}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-green-500"
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-700">
                TOP UP
              </span>
            </label>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="article"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full h-32 text-xs sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="article"
            >
              Photo
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
            />
          </div>

          {formData.imagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Draw on the Image
              </label>
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawingTouch}
                onTouchMove={drawTouch}
                onTouchEnd={stopDrawingTouch}
                className="border bg-white touch-none"
              />
            </div>
          )}

          {formData.image_url && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Current Image
              </label>
              <img
                src={formData.image_url}
                alt="Uploaded"
                className="mt-1 w-full rounded-md"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="done"
                checked={formData.done}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-green-500"
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-700">
                DONE
              </span>
            </label>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg"
              disabled={isLoading || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex justify-center items-center">
                  <FaSpinner className="animate-spin text-white mr-2" />
                  Submitting...
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default Article;
