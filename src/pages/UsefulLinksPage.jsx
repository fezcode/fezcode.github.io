import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSeo from '../hooks/useSeo';

const UsefulLinksPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useSeo({
    title: 'Redirecting... | Fezcodex',
    description: 'Redirecting to a random log entry on Fezcodex.',
    keywords: ['Fezcodex', 'redirect', 'random', 'log'],
  });

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const logsResponse = await fetch('/logs/logs.json');

        const logs = await logsResponse.json();

        const allLogUrls = logs.map((log) => `/logs/${log.slug}`);

        const randomUrl =
          allLogUrls[Math.floor(Math.random() * allLogUrls.length)];
        navigate(randomUrl, { replace: true });
      } catch (error) {
        console.error('Error fetching content for redirection:', error);
        // Fallback or error message
        setLoading(false);
      }
    };

    fetchAndRedirect();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center py-16">Finding a random log for you...</div>
    );
  }

  return (
    <div className="text-center py-16">
      <p>
        If you are not redirected, please click <a href="/">here</a> to go to
        the homepage.
      </p>
    </div>
  );
};

export default UsefulLinksPage;
