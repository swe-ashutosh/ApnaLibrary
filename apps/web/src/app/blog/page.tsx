"use client";
import React, { useState, useEffect } from "react";
import { API_URL } from "@/lib/supabase";
import Footer from "@/components/Footer";

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback images for blogs that don't have images
  const fallbackImages = [
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blogs`);
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <div className="flex-grow pt-20 px-4 md:px-20 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-bold mt-8 md:mt-10 mb-4">
          Latest <span className="text-brandPurple">Articles</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8 md:mb-10">
          Tips, updates, and insights for aspiring students
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-brandPurple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
            {blogs.map((post, idx) => (
              <div
                key={post.id}
                className="glass-card overflow-hidden hover:border-brandPurple transition-all cursor-pointer group"
              >
                <img
                  src={fallbackImages[idx % fallbackImages.length]}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-brandPurple font-bold uppercase">
                      {new Date(post.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[10px] text-gray-600">•</span>
                    <span className="text-[10px] text-gray-500">{post.author}</span>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-brandPurple transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {post.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-2">No articles yet</p>
            <p className="text-gray-600 text-sm">
              Check back soon for study tips and updates!
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
