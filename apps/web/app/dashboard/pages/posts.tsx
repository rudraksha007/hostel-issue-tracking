"use client";

import React, { useState } from "react";
import { Card } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { User, Clock } from "lucide-react";

type Reaction = "like" | "love" | "laugh" | "wow";

type Post = {
  id: string;
  title: string;
  content: string;
  images: string[];
  author: string;
  createdAt: string;
  reactions: Record<Reaction, number>;
};

export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "🚰 Water Supply Shutdown",
      content:
        "Water supply will be unavailable tomorrow from 9AM–1PM due to maintenance work.",
      images: [
        "https://picsum.photos/700/400?1",
        "https://picsum.photos/700/400?2",
      ],
      author: "Admin",
      createdAt: new Date().toISOString(),
      reactions: {
        like: 4,
        love: 2,
        laugh: 1,
        wow: 0,
      },
    },
    {
      id: "2",
      title: "🎉 Hostel Cultural Fest",
      content:
        "Join us this Friday evening for music, food stalls, and games!",
      images: [
        "https://picsum.photos/700/400?3",
        "https://picsum.photos/700/400?4",
        "https://picsum.photos/700/400?5",
      ],
      author: "Warden",
      createdAt: new Date().toISOString(),
      reactions: {
        like: 10,
        love: 6,
        laugh: 3,
        wow: 4,
      },
    },
  ]);

  function handleReaction(postId: string, reaction: Reaction) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              reactions: {
                ...post.reactions,
                [reaction]: post.reactions[reaction] + 1,
              },
            }
          : post
      )
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <div className="space-y-5">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="group backdrop-blur-xl bg-linear-to-br from-white/95 to-white/90 dark:from-slate-900/95 dark:to-slate-900/90 border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 hover:scale-[1.01] overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl -z-10" />
            
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-linear-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                  {post.title}
                </h2>

                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {post.content}
              </p>

              {/* Images */}
              {post.images.length > 0 && (
                <div className="relative isolate z-0 rounded-xl overflow-hidden">
                  <div
                    id={`carousel-${post.id}`}
                    className="flex gap-0 overflow-x-auto snap-x snap-mandatory scrollbar-hide z-0 scroll-smooth"
                  >
                    {post.images.map((img, idx) => (
                      <div key={idx} className="min-w-full snap-start relative z-0">
                        <img
                          src={img}
                          alt={`Image ${idx + 1} of ${post.title}`}
                          className="h-72 w-full object-cover relative z-0"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Controls */}
                  {post.images.length > 1 && (
                    <>
                      <button
                        aria-label="Previous image"
                        onClick={() => {
                          const el = document.getElementById(`carousel-${post.id}`);
                          if (el) el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/20 dark:bg-slate-900/40 hover:bg-white/30 dark:hover:bg-slate-900/60 text-white border border-white/30 rounded-full p-2.5 z-10 transition-all duration-200 active:scale-90 shadow-lg"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      <button
                        aria-label="Next image"
                        onClick={() => {
                          const el = document.getElementById(`carousel-${post.id}`);
                          if (el) el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/20 dark:bg-slate-900/40 hover:bg-white/30 dark:hover:bg-slate-900/60 text-white border border-white/30 rounded-full p-2.5 z-10 transition-all duration-200 active:scale-90 shadow-lg"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Reactions */}
              <div className="flex gap-2 flex-wrap pt-2">
                {(
                  [
                    [
                      "like",
                      (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 21h4V9H2v12zM22 10.5c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 2 7.59 7.59C7.22 7.95 7 8.45 7 9v9c0 1.1.9 2 2 2h7c.78 0 1.45-.45 1.77-1.11L22 12.5v-2z" />
                        </svg>
                      ),
                      "text-blue-600 dark:text-blue-400",
                      "hover:bg-blue-50 dark:hover:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                    ],
                    [
                      "love",
                      (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.99 3.57 2.36h1.87C14.46 4.99 15.96 4 17.5 4 20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      ),
                      "text-red-600 dark:text-red-400",
                      "hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800"
                    ],
                    [
                      "laugh",
                      (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-4 8a1 1 0 110 2 1 1 0 010-2zm8 0a1 1 0 110 2 1 1 0 010-2zm-8.2 4.4c.9 1.3 2.6 2.1 4.2 2.1s3.3-.8 4.2-2.1c.18-.26.04-.61-.28-.68-.32-.07-.6.12-.7.4-.6 1-1.8 1.7-3.2 1.7s-2.6-.7-3.2-1.7c-.1-.28-.38-.47-.7-.4-.32.07-.46.42-.28.68z" />
                        </svg>
                      ),
                      "text-yellow-600 dark:text-yellow-400",
                      "hover:bg-yellow-50 dark:hover:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
                    ],
                    [
                      "wow",
                      (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 6a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 8a4 4 0 110-8 4 4 0 010 8z" />
                        </svg>
                      ),
                      "text-purple-600 dark:text-purple-400",
                      "hover:bg-purple-50 dark:hover:bg-purple-950/30 border-purple-200 dark:border-purple-800"
                    ],
                  ] as [Reaction, React.ReactNode, string, string][]
                ).map(([type, icon, colorClass, hoverClass]) => (
                  <button
                    key={type}
                    onClick={() => handleReaction(post.id, type)}
                    aria-label={`React ${type}`}
                    className={`flex items-center gap-2 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 ${hoverClass} px-3.5 py-2 rounded-full transition-all duration-200 border active:scale-95 ${colorClass} font-medium text-sm shadow-sm hover:shadow-md`}
                  >
                    <span aria-hidden>{icon}</span>
                    <span>{post.reactions[type]}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
