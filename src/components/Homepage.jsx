import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPages, setSelectedPage } from '../store/pagesSlice';
import SchPost from './Schedule';
import Posts from './Posts';
import Analytics from './Analytics';

function Homepage() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [activeSection, setActiveSection] = useState('home');

  const dispatch = useDispatch();
  const pages = useSelector((state) => state.pages.pages);
  const selectedPage = useSelector((state) => state.pages.selectedPage);

  const fetchPages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/auth/facebook/pages', {
        withCredentials: true,
      });
      dispatch(setPages(res.data.pages));
    } catch (err) {
      console.error('Error fetching pages:', err);
      alert('Failed to fetch pages');
    }
  };

  const fetchPosts = async () => {
    if (!selectedPage) return;
    const page = pages.find((p) => p.id === selectedPage);
    if (!page) return;

    try {
      const res = await axios.get('http://localhost:5000/posts/getallpostsfilter', {
        params: {
          pageId: selectedPage,
          accessToken: page.access_token,
          sortBy,
          order,
        },
        withCredentials: true,
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      alert('Failed to fetch posts');
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      fetchPosts();
    }
  }, [selectedPage, sortBy, order]);

  return (
    <>
      <style>{`
        body, html, #root {
          margin: 0; padding: 0; height: 100%;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(to bottom right, #121212, #1e1e1e);
          color: #eaeaea;
          overflow-x: hidden;
        }
        .background-stars {
          position: fixed;
          top: 0; left: 0;
          width: 100vw;
          height: 100vh;
          background: url('https://grainy-gradients.vercel.app/noise.svg');
          background-size: cover;
          z-index: -1;
          opacity: 0.08;
        }
        .sidebar {
          transform: translateX(-80%);
        }
        .sidebar:hover {
          transform: translateX(0);
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.15);
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
          white-space: nowrap;
        }
      `}</style>

      <div className="background-stars"></div>

      <nav className="bg-gradient-to-r from-[#0d0d0d] to-[#2c2c2c] px-8 py-4 flex justify-between items-center shadow-md">
        <div className="text-[#f5f5f5] text-5xl font-extrabold tracking-wider animate-pulse">
          Socialsuite
        </div>
        <div className="text-gray-400 font-light italic">Empower your social presence</div>
      </nav>

      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="sidebar transition-transform duration-300 absolute h-full z-10 w-64 p-6 bg-gradient-to-b from-[#1a1a1a] to-[#111111] backdrop-blur-md rounded-r-3xl shadow-lg">
          <nav className="space-y-8 text-lg text-white">
            {[
              { title: 'Homepage', href: 'home', links: ['All Post', 'Analytics'] },
              { title: 'Post', href: 'post', links: ['Scheduling Post', 'Posts'] },
              { title: 'Analytics', href: 'analytics', links: ['Likes', 'Followers', 'Comments'] },
              { title: 'Earning', href: 'earning', links: ['Views Per Video', 'Likes Per Post'] },
              { title: 'Trending', href: 'trending', links: ['Trending Reels', 'Trending Post'] },
            ].map(section => (
              <div key={section.title}>
                <a
                  href="#"
                  onClick={() => setActiveSection(section.href)}
                  className="text-xl font-bold uppercase tracking-wide text-purple-400 mb-1 block hover:text-purple-300"
                >
                  {section.title}
                </a>
                <div className="flex flex-col space-y-1 pl-2 text-sm text-gray-300">
                  {section.links.map(link => (
                    <a
                      key={link}
                      href="#"
                      onClick={() => {
                        if (link === 'Scheduling Post') {
                          setActiveSection('schedule');
                        } else if (link === 'Posts') {
                          setActiveSection('all-posts');
                        } else if (link === 'Analytics') {
                          setActiveSection('Analytics');
                        } else {
                          setActiveSection('home');
                        }
                      }}
                      className="hover:text-white hover:underline"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 ml-20 flex flex-col gap-10">
          {activeSection === 'schedule' ? (
            <SchPost />
          ) : activeSection === 'all-posts' ? (
            <Posts />
          ) : activeSection === 'Analytics' ? (
            <Analytics />
          ) : (
            <>
              <div
                id="post"
                className="max-w-[95vw] bg-[#1f1f1f]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-semibold text-white">FACEBOOK POSTS</h2>
                  <div className="flex flex-wrap gap-4 items-center">
                    <select
                      className="p-2 rounded-md bg-[#2b2b2b] text-white"
                      value={selectedPage || ''}
                      onChange={(e) => dispatch(setSelectedPage(e.target.value))}
                    >
                      <option value="">-- Select Page --</option>
                      {pages.map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="p-2 rounded-md bg-[#2b2b2b] text-white"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date">Sort by Date</option>
                      <option value="likes">Sort by Likes</option>
                      <option value="comments">Sort by Comments</option>
                    </select>
                    <select
                      className="p-2 rounded-md bg-[#2b2b2b] text-white"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-hidden w-full">
                  <div className="animate-marquee flex gap-6">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white text-black rounded-xl shadow-lg overflow-hidden min-w-[300px] max-w-[300px] mr-4"
                      >
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300">
                          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                          <div>
                            <div className="font-semibold">{post.from?.name || 'Facebook Page'}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(post.created_time).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-2 text-sm">
                          {post.message ? post.message.slice(0, 100) + '...' : 'No content'}
                        </div>
                        {post.full_picture && (
                          <img
                            src={post.full_picture}
                            alt="Post"
                            className="w-full object-cover h-48"
                          />
                        )}
                        <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-500 border-t border-b border-gray-300">
                          <div>
                            <span role="img" aria-label="like">👍</span> {post.likes?.summary?.total_count || 0}
                          </div>
                          <div>{post.comments?.summary?.total_count || 0} Comments</div>
                        </div>
                        <div className="flex justify-around py-2">
                          <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600">
                            👍 Like
                          </button>
                          <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600">
                            💬 Comment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instagram Section */}
              <div
                id="homepage"
                className="h-[350px] bg-[#1f1f1f]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              >
                <h2 className="text-2xl font-semibold text-white">INSTAGRAM</h2>
                <div className="flex justify-end">
                  <a href="#" className="text-blue-400 hover:text-blue-200 underline">
                    View All
                  </a>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Homepage;