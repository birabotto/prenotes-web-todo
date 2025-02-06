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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
      {prenotes.length > 0 ? (
        prenotes.map((note) => (
          <div
            key={note.id}
            className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-xl flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
            onClick={() => seeArticles(note.id)}
          >
            <div className="mb-4 flex justify-between items-center">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {dateFormat(note.createdAt)}
              </p>
              <p className="text-lg font-bold text-gray-800">
                {note.departament}
              </p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className={`h-2.5 rounded-full ${
                  note.doneCount === 0
                    ? "bg-red-500"
                    : note.doneCount < note.totalArticles
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${note.donePercentage}%` }}
              ></div>
            </div>

            {/* Texto de Progresso */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  Progress: {note.donePercentage}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  {note.doneCount}/{note.totalArticles} done
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full py-8">
          No prenotes available.
        </p>
      )}
    </div>
  );
};

export default PrenotesList;
