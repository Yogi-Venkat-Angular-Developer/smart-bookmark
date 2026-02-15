"use client";

import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-95 text-center">
        <h1 className="text-3xl font-bold text-black mb-2">Smart Bookmark</h1>

        <p className="text-gray-600 mb-8">
          Save and manage your links securely
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
