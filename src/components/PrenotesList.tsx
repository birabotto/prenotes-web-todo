import { useNavigate } from "react-router-dom";
import dateFormat from "../utils/dateFormat";

import { Prenote } from "../types/prenote";

interface PrenotesListProps {
  prenotes: Prenote[];
}

const PrenotesList: React.FC<PrenotesListProps> = ({ prenotes }) => {
  const navigate = useNavigate();

  const seeArticles = (prenotes_id: number) => {
    navigate(`/articles/prenote/${prenotes_id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
      {prenotes.length > 0 ? (
        prenotes.map((note) => (
          <div
            key={note.id}
            className={`p-4 shadow-md rounded-lg flex flex-col justify-between cursor-pointer ${
              note.doneCount === 0
                ? "bg-red-100"
                : note.doneCount < note.totalArticles
                ? "bg-orange-100"
                : "bg-green-100"
            }`}
            onClick={() => seeArticles(note.id)}
          >
            <div className="mb-2">
              <p className="text-sm text-gray-600">
                {dateFormat(note.createdAt)}
              </p>
              <p className="text-sm text-gray-800">{note.departament}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No prenotes available.</p>
      )}
    </div>
  );
};

export default PrenotesList;
