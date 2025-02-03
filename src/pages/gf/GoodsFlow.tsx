import { FaBarcode, FaCheckSquare, FaTimesCircle } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import axiosConfig from "../../shared/axiosConfig";
import { BrowserMultiFormatReader } from "@zxing/library";
import ToastProvider from "../../components/ToastProvider";
import showToast from "../../utils/showToast";
type GfTypes = {
  done: boolean;
  location: string;
  item: string;
  name: string;
  ms: boolean;
  bts: boolean;
  top_up: boolean;
  notes: string;
  image_url: string;
};

export default function GoodsFlow() {
  const [item, setItem] = useState<string | null>(null);
  const [article, setArticle] = useState<GfTypes | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scanner] = useState<BrowserMultiFormatReader>(
    new BrowserMultiFormatReader()
  );

  const [toastData, setToastData] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  async function handleSearch(itemCode: string) {
    if (!itemCode) return;
    try {
      const response = await axiosConfig.get(
        `v1/api/articles/item/${itemCode}`
      );
      if (response.data.data) {
        setArticle(response.data.data);
        showToast("Article found", "success");
      } else {
        showToast("Article found", "error");
        setToastData({ message: "Article not found!", type: "error" });
        setArticle(null);
      }
    } catch (error) {
      setToastData({
        message: "Error while fetching article data!",
        type: "error",
      });
      console.error(error);
    }
  }

  const handleScanToggle = () => {
    setScanning((prevScanning) => !prevScanning);
  };

  const handleBarcodeScan = (result: any) => {
    if (result?.text) {
      const stringFormat8digits = result.text.slice(0, 8);
      setItem(stringFormat8digits);
      handleSearch(stringFormat8digits);
    }
  };

  const startScanner = () => {
    if (videoRef.current) {
      scanner
        .decodeFromVideoDevice(null, videoRef.current, (result, error) => {
          if (result) {
            handleBarcodeScan(result);
          }
          if (error) {
            console.error("Error:", error);
          }
        })
        .catch((err) => {
          console.error("Error starting scanner:", err);
        });
    }
  };

  const stopScanner = () => {
    scanner.reset();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (scanning) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [scanning]);

  useEffect(() => {
    if (item && item.length === 8) {
      handleSearch(item);
    }
  }, [item]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Aceita apenas números
    if (/^\d*$/.test(inputValue)) {
      setItem(inputValue);
    }
  };

  return (
    <>
      {scanning && (
        <div className="mb-6 relative flex justify-center">
          <video
            ref={videoRef}
            width="300px"
            height="200px"
            className="border-2 border-blue-500 rounded-lg"
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "200px",
              height: "100px",
              border: "4px solid rgba(255, 255, 255, 0.7)",
              borderRadius: "8px",
              boxShadow: "0 0 0 1000px rgba(0, 0, 0, 0.5)",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      <div className="relative mb-6">
        <input
          type="text" // Alterado para "text" para evitar problemas com o tipo "number"
          name="item"
          value={item || ""}
          autoFocus
          placeholder="Article number..."
          onChange={handleInputChange}
          maxLength={8} // Limita o input a 8 caracteres
          className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500 px-4 py-3 pr-12"
        />
        <FaBarcode
          onClick={handleScanToggle}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-2xl text-blue-500"
        />
      </div>

      <button
        className="w-full mb-6 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={() => handleSearch(item || "")}
      >
        Find
      </button>

      {article && (
        <>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="article"
            >
              Article
            </label>
            <div
              id="article"
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full bg-gray-50 text-gray-900"
            >
              {article.name}
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="location"
            >
              <span className="inline-flex items-center">
                MS
                <span className="ml-2">
                  {article.ms ? (
                    <FaCheckSquare
                      style={{ color: "green", fontSize: "24px" }}
                    />
                  ) : (
                    <FaTimesCircle style={{ color: "red", fontSize: "24px" }} />
                  )}
                </span>
              </span>
            </label>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="location"
            >
              <span className="inline-flex items-center">
                BTS
                <span className="ml-2">
                  {article.bts ? (
                    <FaCheckSquare
                      style={{ color: "green", fontSize: "24px" }}
                    />
                  ) : (
                    <FaTimesCircle style={{ color: "red", fontSize: "24px" }} />
                  )}
                </span>
              </span>
            </label>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="location"
            >
              <span className="inline-flex items-center">
                TOP UP
                <span className="ml-2">
                  {article.top_up ? (
                    <FaCheckSquare
                      style={{ color: "green", fontSize: "24px" }}
                    />
                  ) : (
                    <FaTimesCircle style={{ color: "red", fontSize: "24px" }} />
                  )}
                </span>
              </span>
            </label>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="Notes"
            >
              Notes
            </label>
            <div
              id="notes"
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full bg-gray-50 text-gray-900"
            >
              {article.notes || "There is no notes"}
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="location"
            >
              Photo
            </label>
            <div
              id="location"
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full bg-gray-50 text-gray-900"
            >
              {article.image_url ? (
                <img
                  src={article.image_url}
                  alt="Preview"
                  className="mt-1 w-full rounded-md"
                />
              ) : (
                <span className="inline-flex items-center">
                  <span className="ml-2">There is no image</span>
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="location"
            >
              <span className="inline-flex items-center">
                DONE
                <span className="ml-2">
                  {article.done ? (
                    <FaCheckSquare
                      style={{ color: "green", fontSize: "24px" }}
                    />
                  ) : (
                    <FaTimesCircle style={{ color: "red", fontSize: "24px" }} />
                  )}
                </span>
              </span>
            </label>
          </div>
        </>
      )}

      {toastData && <ToastProvider />}
    </>
  );
}
