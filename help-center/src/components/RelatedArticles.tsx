import React from 'react';

interface Article {
  title: string;
  description: string;
  href: string;
}

interface RelatedArticlesProps {
  articles: Article[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
  return (
    <section className="mt-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Related Articles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.href}
            className="block bg-light-cream p-6 rounded-2xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <h3 className="font-semibold text-lg text-text-primary mb-2">{article.title}</h3>
            <p className="text-text-secondary leading-relaxed">{article.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;