import { useState, useEffect } from "react";
import axiosConfig from "../shared/axiosConfig";
import io from "socket.io-client";

interface ArticleType {
  done: boolean;
  id: number;
  name: string;
  status: string;
}

const apiBaseUrl = import.meta.env.VITE_API_URL;
const socket = io(apiBaseUrl, {
  transports: ["websocket"],
});

export const useArticles = (id: string | undefined) => {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadArticles = async () => {
      try {
        const response = await axiosConfig.get(`v1/api/articles/prenote/${id}`);
        setArticles(response.data.data);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();

    const handleProgressUpdated = async () => {
      const response = await axiosConfig.get(`v1/api/articles/prenote/${id}`);
      setArticles(response.data.data);
    };

    socket.on("progressUpdated", handleProgressUpdated);

    return () => {
      socket.off("progressUpdated", handleProgressUpdated);
    };
  }, [id]);

  return { articles, isLoading };
};
