import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useLoginApi, useRegisterApi } from "../lib/auth-api";

type Mode = "login" | "register";

export const FormAuth = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    mode: "login",
  });

  const mode: Mode =
    searchParams.get("mode") === "register"
      ? "register"
      : "login";

  // ---------------- API ----------------
  const { mutate: loginMutate, isPending: loginPending } =
    useLoginApi(import.meta.env.VITE_LOGIN_URL);

  const { mutate: registerMutate, isPending: registerPending } =
    useRegisterApi(import.meta.env.VITE_REGISTER_URL);

  const isPending = loginPending || registerPending;

  // ---------------- FORM STATE ----------------
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // ---------------- HELPERS ----------------
  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
    });

    setShowPassword(false);
  };

  const handleModeChange = (newMode: Mode) => {
    setSearchParams({ mode: newMode });
    resetForm();
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "login") {
      loginMutate({
        email: form.email,
        password: form.password,
      });

      return;
    }

    registerMutate({
      username: form.name,
      email: form.email,
      password: form.password,
    });
  };

  const isDisabled =
    isPending ||
    !form.email ||
    !form.password ||
    (mode === "register" && !form.name);

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        {/* HEADER */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              {mode === "login"
                ? "Welcome back"
                : "Create an account"}
            </h1>

            <p className="mt-2 text-sm text-neutral-400">
              {mode === "login"
                ? "Sign in to continue chatting with the community."
                : "Create a new account to start messaging in rooms."}
            </p>
          </div>

          {/* MODE SWITCH */}
          <div className="grid grid-cols-2 rounded-full bg-neutral-950 p-1 text-sm">
            <ModeButton
              active={mode === "login"}
              onClick={() => handleModeChange("login")}
            >
              Login
            </ModeButton>

            <ModeButton
              active={mode === "register"}
              onClick={() => handleModeChange("register")}
            >
              Register
            </ModeButton>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <InputField
              label="Name"
              placeholder="Your name"
              value={form.name}
              onChange={(value) => updateField("name", value)}
            />
          )}

          <InputField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(value) => updateField("email", value)}
          />

          <PasswordField
            value={form.password}
            show={showPassword}
            toggle={togglePassword}
            onChange={(value) =>
              updateField("password", value)
            }
          />

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Register"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-neutral-400">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => handleModeChange("register")}
                className="font-medium text-white hover:underline"
              >
                Register
              </button>
            </>
          ) : (
              <>
              Already have an account?{" "}
              <button
                  type="button"
                  onClick={() => handleModeChange("login")}
                  className="font-medium text-white hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

// ---------------- INPUT FIELD ----------------

type InputFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
};

const InputField = ({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: InputFieldProps) => {
  return (
    <label className="block text-sm text-neutral-200">
      {label}

      <input
        required
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
      />
    </label>
  );
};

// ---------------- PASSWORD FIELD ----------------

type PasswordFieldProps = {
  value: string;
  show: boolean;
  toggle: () => void;
  onChange: (value: string) => void;
};

const PasswordField = ({
  value,
  show,
  toggle,
  onChange,
}: PasswordFieldProps) => {
  return (
    <label className="block text-sm text-neutral-200">
      Password

      <div className="relative mt-2">
        <input
          required
          type={show ? "text" : "password"}
          value={value}
          placeholder="Password"
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 pr-12 text-white outline-none transition focus:border-sky-500"
        />

        <button
          type="button"
          onClick={toggle}
          aria-label={
            show ? "Hide password" : "Show password"
          }
          className="absolute inset-y-0 right-3 inline-flex items-center text-neutral-400"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
    </label>
  );
};

// ---------------- MODE BUTTON ----------------

type ModeButtonProps = {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

const ModeButton = ({
  active,
  children,
  onClick,
}: ModeButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        inline-flex items-center justify-center w-full
        rounded-2xl
        px-5 py-3
        text-sm font-medium tracking-tight
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-sky-400/40
        ${active
          ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
          : "text-neutral-400 hover:bg-white/5 hover:text-white"
        }
      `}
    >
      <span className="truncate">{children}</span>
    </button>
  );
};