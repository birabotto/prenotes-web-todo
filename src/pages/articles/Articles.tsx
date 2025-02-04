import { useArticles } from "../../hooks/useArticles";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/buttons/BackButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import ArticlesList from "../../components/ArticlesList";
import useSocket from "../../hooks/useSocket";

const Articles = () => {
  const socket = useSocket();
  const { id } = useParams();
  const { articles, isLoading } = useArticles(id);
  const navigation = useNavigate();

  const handleClick = (articleId: number) => {
    if (!socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("updateInProgress", articleId);
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
