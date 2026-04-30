import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () =>
    loginWithRedirect({
      appState: { returnTo: "/dashboard" }, 
      authorizationParams: { screen_hint: "login" },
    });

  const handleSignup = () =>
    loginWithRedirect({
      appState: { returnTo: "/dashboard" },
      authorizationParams: { screen_hint: "signup" },
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#03040e] flex items-center justify-center px-5">
        <div className="w-6 h-6 rounded-full border-2 border-[#3de8c0] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#03040e] px-4 pt-8 pb-10 text-white flex items-center justify-start">
      <div className="w-full max-w-[92vw] sm:max-w-md rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 shadow-[0_0_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <div className="mb-6 text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-[#7a8aaa] mb-3">
            cosmos.study
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#9ab0d5]">
            Log in to continue building your study cosmos.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full rounded-2xl bg-gradient-to-r from-[#3de8c0] to-[#7c6fff] py-4 text-sm font-semibold text-[#03040e] shadow-[0_12px_36px_rgba(61,232,192,0.22)]"
          >
            Log in
          </button>
          <button
            onClick={handleSignup}
            className="w-full rounded-2xl border border-white/15 bg-white/5 py-4 text-sm font-medium text-[#d7e4ff] hover:bg-white/10"
          >
            Create an account
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-[#7a8aaa]">
          <p>
            New here?{" "}
            <Link to="/" className="text-[#3de8c0] hover:text-[#7c6fff]">
              Return to landing
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
