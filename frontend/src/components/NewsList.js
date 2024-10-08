import React, { useState, useEffect } from 'react';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:8070/news');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        setMessage('Failed to fetch news');
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-gray-100 to-blue-50 rounded-lg shadow-lg mt-12">
      <h2 className="text-center text-5xl font-extrabold text-blue-800 mb-10 border-b-4 border-blue-600 pb-4">Company News</h2>
      {message && <p className="text-center text-red-700 text-2xl mb-6">{message}</p>}
      {news.length === 0 ? (
        <p className="text-center text-gray-600 text-2xl italic">No news available.</p>
      ) : (
        <div className="space-y-10">
          {news.map((newsItem) => (
            <div key={newsItem._id} className="p-8 bg-white shadow-lg rounded-md border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-3xl font-bold text-blue-700 mb-4 border-b-2 border-blue-400 pb-2">{newsItem.title}</h3>
              <p className="text-gray-800 leading-relaxed text-lg mb-6">{newsItem.content}</p>
              {newsItem.imageUrl && (
                <div className="flex justify-center mb-6">
                  <img src={newsItem.imageUrl} alt={newsItem.title} className="max-h-80 w-full object-cover rounded-md shadow-md" />
                </div>
              )}
              <p className="text-gray-500 italic text-lg text-right">Published on: {new Date(newsItem.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default NewsList;
