import React from 'react';
import { Link } from 'react-router-dom';
import postsData from '../data/posts.json';

const BlogIndex = () => {
  const posts = postsData.posts || [];

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

        {posts.length === 0 ? (
          <div className="text-slate-500 font-mono text-sm border border-slate-800 rounded-2xl p-8 text-center">
            No posts yet. Add your first Notion post to see it here.
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
