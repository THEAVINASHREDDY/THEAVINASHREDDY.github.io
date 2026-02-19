import React from 'react';
import { Link } from 'react-router-dom';
import postsData from '../data/posts.json';

const BlogPreview = () => {
  const posts = postsData.posts || [];
  const latest = posts.slice(0, 3);

  return (
    <section id="blog" className="py-24 bg-slate-900 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Signal <span className="text-cyan-500">Logs</span>
            </h2>
            <p className="text-slate-400 max-w-2xl">
              Short notes, deep dives, and engineering reflections from the lab.
            </p>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 transition-all">
            View All Posts
          </Link>
        </div>

        {latest.length === 0 ? (
          <div className="text-slate-500 font-mono text-sm border border-slate-800 rounded-2xl p-8 text-center">
            No posts yet. Your first signal log will show up here.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-slate-800/40 border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/70 transition-colors"
              >
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
                  {post.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-xs font-mono rounded-full bg-slate-900 border border-slate-700 text-cyan-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPreview;
