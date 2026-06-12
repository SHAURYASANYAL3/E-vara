import React, { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    // Dynamic SEO update
    if (post) {
      document.title = `${post.title} | E-VARA Intelligence`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", post.excerpt);
      }
    }
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-emerald-400 transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all articles
        </Link>
        
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] border border-gray-800 rounded-2xl p-8 md:p-12"
        >
          <header className="mb-10">
            <div className="flex items-center text-sm text-emerald-400 mb-4 space-x-4 font-mono">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{post.author}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-400 font-medium">
              {post.excerpt}
            </p>
          </header>
          
          <div className="w-full h-px bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 mb-10"></div>
          
          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:text-emerald-50 prose-headings:font-bold prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-p:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.article>
      </div>
    </main>
  );
};

export default BlogPost;
