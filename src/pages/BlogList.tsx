import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogPosts";
import { Helmet } from "react-helmet"; // Assuming they might use helmet for SEO, or I'll just use raw DOM or skip it if not installed. 
// Actually, I won't assume react-helmet is installed. I will just build the UI.

const BlogList = () => {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4"
          >
            Executive Identity Intelligence Blog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Insights, analysis, and threat research from the E-VARA Engineering and Intelligence teams.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-colors duration-300 flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-sm text-gray-400 mb-4 space-x-4">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold mb-3 text-gray-100 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-400 mb-6 flex-1 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">{post.author}</span>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors"
                  >
                    Read Article →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default BlogList;
