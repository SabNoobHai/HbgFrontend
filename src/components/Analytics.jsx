import React, { useEffect, useState } from 'react';
import axios from 'axios';

const boxStyle = {
  padding: '20px',
  borderRadius: '15px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  transition: 'transform 0.2s ease-in-out',
};

const containerStyle = {
  minHeight: '100vh',
  backgroundColor: '#f3f3f3',
  padding: '40px',
  fontFamily: 'Arial, sans-serif',
};

const cardContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  maxWidth: '1000px',
  margin: '0 auto',
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '20px',
};

const headingStyle = {
  textAlign: 'center',
  fontSize: '32px',
  marginBottom: '30px',
  fontWeight: 'bold',
  color: '#333',
};

const dropdownStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #7d2ae8',
  fontSize: '16px',
  minWidth: '220px',
  background: '#fff',
  color: '#4b0082',
  fontWeight: 'bold',
  outline: 'none',
  boxShadow: '0 2px 8px rgba(125,42,232,0.08)',
};

const Analytics = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all pages on mount
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/facebook/pages', {
          withCredentials: true,
        });
        setPages(res.data.pages || []);
      } catch (err) {
        setPages([]);
   
      }
    };
    fetchPages();
  }, []);

  // Fetch analytics when a page is selected
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedPage) return;
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/insights/page', {
          
          params: {   metrics: 'page_views',pageId: selectedPage, period: 'day' },
          withCredentials: true,
        });
        setAnalytics(res.data.data || []);
      } catch (err) {
        setAnalytics([]);
        alert('Failed to fetch analytics');
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, [selectedPage]);

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Page Analytics</h1>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <select
          value={selectedPage}
          onChange={e => setSelectedPage(e.target.value)}
          style={dropdownStyle}
        >
          <option value="">-- Select a Page --</option>
          {pages.map(page => (
            <option key={page.id || page.pageId} value={page.id || page.pageId}>
              {page.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', fontSize: '18px' }}>Loading analytics...</div>
      ) : selectedPage && analytics.length > 0 ? (
        <div style={cardContainerStyle}>
          {analytics.map(metric => {
            const value =
              metric.values && metric.values.length > 0
                ? metric.values[0].value
                : 'N/A';
            return (
              <div key={metric.name} style={{ ...boxStyle, backgroundColor: '#e3e3fa' }}>
                <h2 style={{ color: '#4b0082', fontSize: '20px', marginBottom: '10px' }}>
                  {metric.title || metric.label || metric.name.replace(/_/g, ' ').toUpperCase()}
                </h2>
                <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2e0854' }}>{value}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
          Select a page to view analytics.
        </div>
      )}
    </div>
  );
};

export default Analytics;