"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function AddBookmark({ user, onBookmarkAdded }: any) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const addBookmark = async () => {
    if (!title || !url) return alert("Enter title and URL");

    const { data } = await supabase
      .from("bookmarks")
      .insert([{ title, url, user_id: user.id }])
      .select();

    if (data) onBookmarkAdded(data[0]);

    setTitle("");
    setUrl("");
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl mb-6 border">
      <h2 className="font-semibold text-lg mb-3 text-black">
        Add New Bookmark
      </h2>

      <div className="flex flex-col gap-3">
        <input
          className="border p-3 rounded-lg"
          placeholder="Bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-3 rounded-lg"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={addBookmark}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
        >
          Add Bookmark
        </button>
      </div>
    </div>
  );
}
