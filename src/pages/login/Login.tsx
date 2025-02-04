import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveButton from "../../components/buttons/SaveButton";
export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    navigate("/s3");
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <SaveButton
            handleSubmit={handleLogin}
            isUploading={isLoading}
            name="Login"
            nameLoading="Logging"
          />
        </form>
      </div>
    </div>
  );
}
