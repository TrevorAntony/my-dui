import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password.");
      }

      const data = await response.json();
      const { access, refresh } = data;
      login(access, refresh);
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="mr-2 h-8 w-8"
            src="./public/images/DUFT.png"
            alt="logo"
          />
          DUFT
        </div>
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Sign in
            </h1>
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  User Name
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-gray-900 focus:border-highlight-600 focus:ring-highlight-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-highlight-500 dark:focus:ring-highlight-500"
                  placeholder="admin"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="abcd1234"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-gray-900 focus:border-highlight-600 focus:ring-highlight-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-highlight-500 dark:focus:ring-highlight-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-highlight-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-highlight-700 focus:outline-none focus:ring-4 focus:ring-highlight-300 dark:bg-highlight-600 dark:hover:bg-highlight-700 dark:focus:ring-highlight-800"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
