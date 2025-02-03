import Card from "../components/Card";
import { Articles } from "../types/articles";

interface ArticlesListProps {
  articles: Articles[];
  seeArticle: (id: number) => void;
  handleClick: (id: number) => void;
}

const ArticlesList: React.FC<ArticlesListProps> = ({
  articles,
  seeArticle,
  handleClick,
}) => {
  return (
    <div className="fade-in">
      <Card
        articles={articles}
        seeArticle={seeArticle}
        handleClick={handleClick}
      />
    </div>
  );
};

export default ArticlesList;
