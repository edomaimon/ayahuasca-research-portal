'use client';

import { useState, useRef, useEffect } from 'react';

function formatAPA(article) {
  const authors = (article.authors || []).join(', ');
  return `${authors} (${article.year}). ${article.title}. ${article.journal}.${article.doi ? ` https://doi.org/${article.doi}` : ''}`;
}

function formatBibTeX(article) {
  const firstAuthor = (article.authors?.[0] || 'Unknown').split(' ').pop();
  const key = `${firstAuthor}${article.year}`;
  return `@article{${key},
  title = {${article.title}},
  author = {${(article.authors || []).join(' and ')}},
  journal = {${article.journal}},
  year = {${article.year}},${article.doi ? `\n  doi = {${article.doi}},` : ''}
}`;
}

function formatRIS(article) {
  let ris = `TY  - JOUR\nTI  - ${article.title}\n`;
  (article.authors || []).forEach(a => { ris += `AU  - ${a}\n`; });
  ris += `JO  - ${article.journal}\nPY  - ${article.year}\n`;
  if (article.doi) ris += `DO  - ${article.doi}\n`;
  if (article.abstract) ris += `AB  - ${article.abstract}\n`;
  ris += 'ER  - \n';
  return ris;
}

const FORMATS = [
  { id: 'apa', label: 'APA', fn: formatAPA },
  { id: 'bibtex', label: 'BibTeX', fn: formatBibTeX },
  { id: 'ris', label: 'RIS', fn: formatRIS },
];

export default function CiteButton({ article }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCopy = async (format) => {
    const text = format.fn(article);
    await navigator.clipboard.writeText(text);
    setToast(format.label);
    setOpen(false);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="cite-btn" ref={ref}>
      <button
        className="cite-btn__trigger"
        onClick={() => setOpen(!open)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
        </svg>
        Cite
      </button>
      {open && (
        <div className="cite-btn__dropdown">
          {FORMATS.map(f => (
            <button
              key={f.id}
              className="cite-btn__option"
              onClick={() => handleCopy(f)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
      {toast && (
        <div className="cite-btn__toast">
          Copied {toast}!
        </div>
      )}
    </div>
  );
}
