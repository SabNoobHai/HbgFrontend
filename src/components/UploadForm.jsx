// src/components/UploadForm.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const UploadForm = () => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!video) return alert("Missing token or video");

    const formData = new FormData();
    formData.append('video', video);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('scheduledAt', scheduledAt);

    try {
      const res = await axios.post('http://localhost:5000/api/youtube/schedule', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`✅ Scheduled: https://youtube.com/watch?v=${res.data.videoId}`);
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('❌ Upload Failed');
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4 bg-white p-6 rounded shadow">
      <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} required />
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload & Schedule</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UploadForm;
