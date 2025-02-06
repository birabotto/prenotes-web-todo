import { useNavigate } from "react-router-dom";

import axiosConfig from "../shared/axiosConfig";
import { useEffect } from "react";

export default function ResetDataBase() {
  const navigation = useNavigate();
  useEffect(() => {
    deleteAll();
  }, []);

  const deleteAll = async () => {
    await axiosConfig.get("/delete");
    navigation("/s3");
  };

  return (
    <>
      <p>Reset</p>
    </>
  );
}
