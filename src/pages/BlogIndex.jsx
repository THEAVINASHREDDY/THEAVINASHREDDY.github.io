import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVisiblePosts } from '../lib/posts';

const BlogIndex = () => {
  const posts = getVisiblePosts();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold">Signal Logs</h1>
            <p className="text-slate-400 mt-3">Deep dives, experiments, and lessons learned.</p>
          </div>
          <Link to="/" className="text-cyan-300 hover:text-cyan-200 font-mono text-sm">Back to Home</Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="h-48 w-full skeleton-line"></div>
                <div className="p-6">
                  <div className="skeleton-line w-2/3 h-3 mb-4"></div>
                  <div className="skeleton-line w-4/5 h-6 mb-4"></div>
                  <div className="skeleton-line w-full h-4 mb-2"></div>
                  <div className="skeleton-line w-10/12 h-4 mb-5"></div>
                  <div className="flex gap-2">
                    <div className="skeleton-line w-16 h-6 rounded-full"></div>
                    <div className="skeleton-line w-16 h-6 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-slate-500 font-mono text-sm border border-slate-800 rounded-2xl p-8 text-center">
            No posts yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden hover:bg-slate-800/70 transition-colors"
              >
                {post.coverUrl ? (
                  <img src={post.coverUrl} alt="" className="h-48 w-full object-cover" />
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"></div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mb-4">
                    <span>{post.publishedAt || 'Draft'}</span>
                    <span>•</span>
                    <span>{post.readingTime} min read</span>
                    {!post.published ? (
                      <span className="ml-auto text-amber-300">Draft</span>
                    ) : null}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 line-clamp-3">
                    {post.excerpt || 'No excerpt provided yet.'}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags?.slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 text-xs font-mono rounded-full bg-slate-900 border border-slate-700 text-cyan-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogIndex;
