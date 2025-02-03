// pages/articles/Articles.tsx

import { useArticles } from "../../hooks/useArticles";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/buttons/BackButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import ArticlesList from "../../components/ArticlesList";
import io from "socket.io-client";

const Articles = () => {
  const { id } = useParams();
  const { articles, isLoading } = useArticles(id);
  const navigation = useNavigate();

  const handleClick = (id: number) => {
    console.log(`chamou socket ${id}`);
    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    });
    socket.emit("updateInProgress", id);
  };

  const back = () => {
    navigation("/s3");
  };

  const seeArticle = (id: number) => {
    navigation(`/article/${id}`);
  };

  return (
    <>
      <BackButton back={back} />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ArticlesList
          articles={articles}
          seeArticle={seeArticle}
          handleClick={handleClick}
        />
      )}
    </>
  );
};

export default Articles;
