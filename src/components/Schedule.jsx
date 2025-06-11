import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SchPost = () => {
  const [accessToken, setAccessToken] = useState('');
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState('photo');

  const handleFacebookLogin = () => {
    const appId = '24700456586221475';
    const redirectUri = 'http://localhost:5173/schedulePost';
    const scopes = 'pages_show_list,pages_read_engagement,pages_manage_posts';

    window.location.href =
      `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token`;
  };

  const fetchPages = async (userAccessToken) => {
    const res = await axios.get(`https://graph.facebook.com/me/accounts?access_token=${userAccessToken}`);
    setPages(res.data.data);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = new URLSearchParams(hash.substring(1)).get('access_token');
      if (token) {
        setAccessToken(token);
        fetchPages(token);
      }
    }
  }, []);

  const handleSchedulePost = async () => {
    if (!mediaFile) return alert('Please select a media file.');
    if (!selectedPage) return alert('Select a valid page.');
    if (!scheduledTime) return alert('Select a scheduled time.');

    const timestamp = Math.floor(new Date(scheduledTime).getTime() / 1000);

    const formData = new FormData();
    formData.append('pageId', selectedPage);
    formData.append('pageAccessToken', pages.find(p => p.id === selectedPage)?.access_token);
    formData.append('message', message);
    formData.append('scheduledTime', timestamp);
    formData.append('mediaType', mediaType);
    formData.append('media', mediaFile);

    try {
      const res = await axios.post('http://localhost:5000/schedulePost/timing', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Scheduled Post ID: ' + res.data.postId);
    } catch (err) {
      alert('Failed to schedule post: ' + (err.response?.data?.error || err.message));
    }
  };

  const handlePostNow = async () => {
    if (!mediaFile) return alert('Please select a media file.');
    if (!selectedPage) return alert('Select a valid page.');

    const formData = new FormData();
    formData.append('pageId', selectedPage);
    formData.append('pageAccessToken', pages.find(p => p.id === selectedPage)?.access_token);
    formData.append('message', message);
    formData.append('mediaType', mediaType);
    formData.append('file', mediaFile);

    try {
      const res = await axios.post('http://localhost:5000/schedulePost/instantly', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post ID: ' + res.data.postId);
    } catch (err) {
      alert('Failed to post instantly: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f6f9',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      {!accessToken ? (
        <button
          onClick={handleFacebookLogin}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1877F2',
            color: 'white',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Login with Facebook
        </button>
      ) : (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          width: '100%'
        }}>
          {/* Title Section */}
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #ddd', paddingBottom: '12px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center'
            }}>
              Schedule a Facebook Post
            </h2>
          </div>

          {/* Form Section */}
          <div>
            <label style={{ fontWeight: '600', color: '#555' }}>Select Page</label>
            <select
              value={selectedPage}
              onChange={e => setSelectedPage(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '16px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            >
              <option value="">-- Choose a Page --</option>
              {pages.map(page => (
                <option key={page.id} value={page.id}>{page.name}</option>
              ))}
            </select>

            <label style={{ fontWeight: '600', color: '#555' }}>Message / Caption</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write your message..."
              style={{
                width: '100%',
                height: '80px',
                padding: '8px',
                marginBottom: '16px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            />

            <label style={{ fontWeight: '600', color: '#555' }}>Media Type</label>
            <select
              value={mediaType}
              onChange={e => setMediaType(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '16px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            >
              <option value="photo">Photo</option>
              <option value="video">Video</option>
            </select>

            <label style={{ fontWeight: '600', color: '#555' }}>Upload Media</label>
            <input
              type="file"
              accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
              onChange={e => setMediaFile(e.target.files[0])}
              style={{ marginBottom: '16px' }}
            />

            <label style={{ fontWeight: '600', color: '#555' }}>Schedule Time</label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '20px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSchedulePost}
                style={{
                  flex: 1,
                  backgroundColor: '#10B981',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Schedule Later
              </button>
              <button
                onClick={handlePostNow}
                style={{
                  flex: 1,
                  backgroundColor: '#6366F1',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Post Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchPost;