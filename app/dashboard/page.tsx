"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import AddBookmark from "../components/AddBookmark";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // fetch bookmarks
  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  // realtime + auth check
  useEffect(() => {
    let channel: any;

    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
      } else {
        setUser(data.session.user);
        fetchBookmarks(data.session.user.id);

        // realtime updates
        channel = supabase
          .channel("bookmarks-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "bookmarks",
              filter: `user_id=eq.${data.session.user.id}`,
            },
            () => {
              fetchBookmarks(data.session.user.id);
            },
          )
          .subscribe();
      }
    };

    loadUser();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // add bookmark instantly in UI
  const handleBookmarkAdded = (bookmark: any) => {
    setBookmarks((prev) => [bookmark, ...prev]);
  };

  // delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-black">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black flex justify-center py-10">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="bg-white shadow rounded-2xl p-6 mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Bookmarks</h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Add Bookmark */}
        <AddBookmark user={user} onBookmarkAdded={handleBookmarkAdded} />

        {/* Bookmark List */}
        <div className="space-y-4">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{b.title}</p>

                <a
                  href={b.url}
                  target="_blank"
                  className="text-blue-600 text-sm"
                >
                  {b.url}
                </a>
              </div>

              <button
                onClick={() => deleteBookmark(b.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
