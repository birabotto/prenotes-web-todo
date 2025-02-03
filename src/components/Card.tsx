import { Articles } from "../types/articles";

interface CardProps {
  articles: Articles[];
  seeArticle: (id: number) => void;
  handleClick: (id: number) => void;
}

export default function Card({ articles, seeArticle, handleClick }: CardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles &&
        articles.map((article) => (
          <div
            key={article.id}
            className={`p-4 shadow-md rounded-lg flex flex-col justify-between ${
              article.done ? "bg-green-100" : "bg-orange-100"
            }`}
            onClick={() => {
              if (article.status === "in_progress") {
                return;
              }

              seeArticle(article.id);
              handleClick(article.id);
            }}
            style={{
              cursor:
                article.status === "in_progress" ? "not-allowed" : "pointer",
            }}
          >
            <div className="mb-2">
              <p className="text-sm text-gray-600 font-semibold">
                {article.name}
                {article.status === "in_progress" && "(In Progress)"}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
