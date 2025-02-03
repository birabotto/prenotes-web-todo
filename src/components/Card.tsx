import { Articles } from "../types/articles";
import { RxCrossCircled } from "react-icons/rx";
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
              <p className="text-sm text-gray-600 font-semibold flex justify-between items-center">
                <span className="flex-1 truncate">{article.name}</span>
                <span className="flex items-center gap-2 ml-4">
                  {article.location?.trim() ? (
                    <span className="text-gray-500">{article.location}</span>
                  ) : (
                    <span>
                      <RxCrossCircled color="red" />
                    </span>
                  )}
                  {article.status === "in_progress" && (
                    <span className="text-yellow-500">(In Progress)</span>
                  )}
                </span>
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
