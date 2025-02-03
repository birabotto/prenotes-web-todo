import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import S3 from "./pages/s3/S3";
import Login from "./pages/login/Login";
import Articles from "./pages/articles/Articles";
import Article from "./pages/articles/Article";
import NavBar from "./components/Navbar";
import GoodsFlow from "./pages/gf/GoodsFlow";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <>
              <nav>
                <NavBar />
              </nav>
              <div className="w-full flex flex-col items-center bg-white mt-12 sm:mt-0">
                <div className="w-full max-w-[1280px] bg-white p-4 sm:p-6 rounded-lg shadow-md">
                  <Routes>
                    <Route path="/" element={<S3 />} />
                    <Route path="s3" element={<S3 />} />
                    <Route path="gf" element={<GoodsFlow />} />
                    <Route path="articles/prenote/:id" element={<Articles />} />
                    <Route path="article/:id" element={<Article />} />
                  </Routes>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
