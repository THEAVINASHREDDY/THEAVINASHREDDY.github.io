import React from 'react';

export const renderRichText = (segments = []) => segments.map((seg, i) => {
  const classes = [
    seg.annotations?.bold ? 'font-semibold' : '',
    seg.annotations?.italic ? 'italic' : '',
    seg.annotations?.underline ? 'underline' : '',
    seg.annotations?.strikethrough ? 'line-through' : '',
    seg.annotations?.code ? 'font-mono text-cyan-300 bg-slate-800/70 px-1.5 py-0.5 rounded' : ''
  ].filter(Boolean).join(' ');

  const content = (
    <span key={i} className={classes}>
      {seg.text}
    </span>
  );

  if (seg.href) {
    return (
      <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">
        {content}
      </a>
    );
  }

  return content;
});

export const renderBlocks = (blocks = []) => {
  const output = [];
  let listBuffer = null;

  const flushList = () => {
    if (!listBuffer) return;
    const { type, items, keyBase } = listBuffer;
    const ListTag = type === 'numbered_list_item' ? 'ol' : 'ul';
    output.push(
      <ListTag key={keyBase} className={`ml-6 my-4 ${ListTag === 'ol' ? 'list-decimal' : 'list-disc'} text-slate-300 space-y-2`}>
        {items.map((item, index) => (
          <li key={`${keyBase}-item-${index}`}>{renderRichText(item.rich_text)}</li>
        ))}
      </ListTag>
    );
    listBuffer = null;
  };

  blocks.forEach((block, idx) => {
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      if (!listBuffer || listBuffer.type !== block.type) {
        flushList();
        listBuffer = { type: block.type, items: [], keyBase: `list-${idx}` };
      }
      listBuffer.items.push(block);
      return;
    }

    flushList();

    if (block.type === 'paragraph') {
      output.push(
        <p key={`p-${idx}`} className="text-slate-300 leading-relaxed my-4">
          {renderRichText(block.rich_text)}
        </p>
      );
      return;
    }

    if (block.type === 'heading_1') {
      output.push(
        <h1 key={`h1-${idx}`} className="text-3xl md:text-4xl font-bold text-white mt-10 mb-4">
          {renderRichText(block.rich_text)}
        </h1>
      );
      return;
    }

    if (block.type === 'heading_2') {
      output.push(
        <h2 key={`h2-${idx}`} className="text-2xl md:text-3xl font-bold text-white mt-8 mb-3">
          {renderRichText(block.rich_text)}
        </h2>
      );
      return;
    }

    if (block.type === 'heading_3') {
      output.push(
        <h3 key={`h3-${idx}`} className="text-xl md:text-2xl font-semibold text-white mt-6 mb-3">
          {renderRichText(block.rich_text)}
        </h3>
      );
      return;
    }

    if (block.type === 'quote') {
      output.push(
        <blockquote key={`q-${idx}`} className="border-l-4 border-cyan-500/60 pl-4 my-6 text-slate-300 italic">
          {renderRichText(block.rich_text)}
        </blockquote>
      );
      return;
    }

    if (block.type === 'code') {
      const code = block.rich_text.map(seg => seg.text).join('');
      output.push(
        <pre key={`code-${idx}`} className="bg-slate-900 border border-slate-700 rounded-xl p-4 my-6 overflow-x-auto">
          <code className="text-sm text-cyan-200 font-mono">{code}</code>
        </pre>
      );
      return;
    }

    if (block.type === 'image') {
      output.push(
        <figure key={`img-${idx}`} className="my-8">
          <img src={block.url} alt="" className="w-full rounded-2xl border border-slate-800" />
          {block.caption?.length ? (
            <figcaption className="text-xs text-slate-500 mt-2">
              {renderRichText(block.caption)}
            </figcaption>
          ) : null}
        </figure>
      );
      return;
    }
  });

  flushList();
  return output;
};
