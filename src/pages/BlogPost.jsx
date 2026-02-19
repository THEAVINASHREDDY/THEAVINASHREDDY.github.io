import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { renderBlocks } from '../lib/notion.jsx';
import { getVisiblePostBySlug } from '../lib/posts';

const BlogPost = () => {
  const { slug } = useParams();
  const post = getVisiblePostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <Link to="/blog" className="text-cyan-300 hover:text-cyan-200 font-mono text-sm">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <Link to="/blog" className="text-cyan-300 hover:text-cyan-200 font-mono text-sm">← Back to Blog</Link>

        <div className="mt-8">
          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mb-4">
            <span>{post.publishedAt || 'Draft'}</span>
            <span>•</span>
            <span>{post.readingTime} min read</span>
            {!post.published ? (
              <span className="ml-auto text-amber-300">Draft</span>
            ) : null}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
          {post.excerpt ? (
            <p className="text-slate-400 text-lg max-w-3xl">{post.excerpt}</p>
          ) : null}
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags?.map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-xs font-mono rounded-full bg-slate-800 border border-slate-700 text-cyan-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {post.coverUrl ? (
          <div className="mt-10">
            <img src={post.coverUrl} alt="" className="w-full rounded-2xl border border-slate-800" />
          </div>
        ) : null}

        {post.coverUrls && post.coverUrls.length > 1 ? (
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {post.coverUrls.slice(1).map((url, idx) => (
              <img
                key={`${post.id}-cover-${idx}`}
                src={url}
                alt=""
                className="w-full rounded-2xl border border-slate-800"
              />
            ))}
          </div>
        ) : null}

        <article className="mt-12 max-w-3xl">
          {renderBlocks(post.blocks)}
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
