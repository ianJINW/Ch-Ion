import { useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { useLoginApi, useRegisterApi } from "../lib/auth-api";

type Mode = "login" | "register";

export const FormAuth = () => {
  const [searchParams, setSearchParams] = useSearchParams({ mode: "login" })

  const { mutate: loginMutate, isPending: loginPending } = useLoginApi('/api/login');
  const { mutate: registerMutate, isPending: registerPending } = useRegisterApi('/api/');

  const mode: Mode = searchParams.get('mode') === "register" ? "register" : "login"
  const handleModeChange = (newMode: Mode) => { setSearchParams({ mode: newMode }) }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "login") {
      loginMutate({ email, password });
      setEmail(""); setPassword(""); setName("")
    } else {
      registerMutate({ username: name, email, password });
      setEmail(""); setPassword(""); setName("")
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-2xl border p-6 shadow">

        {/* Sliding container */}
        <div
          className={`flex transition-transform duration-500 ease-in-out ${mode === "login" ? "translate-x-0" : "-translate-x-1/2"
            }`}
          style={{ width: "200%" }}
        >
          {/* LOGIN */}
          <div className="w-1/2 pr-4">
            <h2 className="text-xl font-semibold mb-4">Login</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 {}" aria-disabled={loginPending}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border p-2 rounded"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border p-2 rounded"
              />

              <button className="bg-black text-white p-2 rounded">
                Login
              </button>
            </form>
          </div>

          {/* REGISTER */}
          <div className="w-1/2 pl-4">
            <h2 className="text-xl font-semibold mb-4">Register</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3" aria-disabled={registerPending} >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="border p-2 rounded"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border p-2 rounded"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border p-2 rounded"
              />

              <button className="bg-black text-white p-2 rounded">
                Register
              </button>
            </form>
          </div>
        </div>

        {/* TOGGLE */}
        <div className="mt-6 text-center">
          {mode === "login" ? (
            <p>
              Don’t have an account?{" "}
              <button
                onClick={() => {
                  handleModeChange("register")
                }}
                className="underline"
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => {
                  handleModeChange("login")
                }}
                className="underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};