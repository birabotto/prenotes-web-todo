import { useState, useEffect, useRef } from "react";
import axiosConfig from "../shared/axiosConfig";
import showToast from "../utils/showToast";
import { Prenote } from "../types/prenote";

export const usePrenotes = () => {
  const [prenotes, setPrenotes] = useState<Prenote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchPrenotes();
    }
  }, []);

  const fetchPrenotes = async () => {
    setIsLoading(true);
    try {
      const response = await axiosConfig.get("/v1/api/prenotes");
      setPrenotes(response.data.data);

      if (response.data.data.length === 0) {
        showToast("No prenotes available.", "warning");
        return;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast("An unexpected error occurred.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { prenotes, isLoading, fetchPrenotes };
};
