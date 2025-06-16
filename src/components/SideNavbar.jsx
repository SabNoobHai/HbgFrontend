import React, { useRef } from 'react';

const icons = {
  Homepage: (
    <svg width="22" height="22" fill="currentColor" className="mr-3 text-purple-400" viewBox="0 0 20 20"><path d="M10 2L2 8.5V18a1 1 0 001 1h5v-5h4v5h5a1 1 0 001-1V8.5L10 2z"/></svg>
  ),
  Post: (
    <svg width="22" height="22" fill="currentColor" className="mr-3 text-purple-400" viewBox="0 0 20 20"><path d="M17 8h-6V2H9v6H3v2h6v6h2v-6h6z"/></svg>
  ),
  Analytics: (
    <svg width="22" height="22" fill="currentColor" className="mr-3 text-purple-400" viewBox="0 0 20 20"><path d="M3 17h2v-7H3v7zm4 0h2V7H7v10zm4 0h2v-4h-2v4zm4 0h2v-2h-2v2z"/></svg>
  ),
  Earning: (
    <svg width="22" height="22" fill="currentColor" className="mr-3 text-green-400" viewBox="0 0 20 20"><text x="2" y="16" fontSize="18" fontWeight="bold">$</text></svg>
  ),
  Trending: (
    <svg width="22" height="22" fill="currentColor" className="mr-3 text-pink-400" viewBox="0 0 20 20"><path d="M3 17l6-6 4 4 8-8-1.41-1.42L13 13.17l-4-4-7 7z"/></svg>
  ),
  Logout: (
    <svg width="22" height="22" fill="currentColor" className="mr-3 text-purple-400" viewBox="0 0 20 20"><path d="M7 17v-2h6v2a2 2 0 01-2 2H9a2 2 0 01-2-2zm7-7V7a5 5 0 00-10 0v3a5 5 0 0010 0zm-2 0a3 3 0 11-6 0V7a3 3 0 016 0v3z"/></svg>
  ),
};

function SideNavbar({
  activeSection,
  setActiveSection,
  postsDropdownOpen,
  setPostsDropdownOpen,
  setPostsPlatform,
  handleLogout,
}) {
  const postOptions = [
    { label: 'Facebook', value: 'Facebook' },
    { label: 'Youtube', value: 'Youtube' },
  ];

  const toggleDropdown = () => setPostsDropdownOpen(prev => !prev);
  const selectPlatform = (opt) => {
    setPostsPlatform(opt.value);
    setActiveSection(opt.value === 'Facebook' ? 'all-posts' : 'youtube-posts');
    setPostsDropdownOpen(false);
  };

  return (
    <aside className="sidebar transition-transform duration-300 absolute h-full z-10 p-6 rounded-r-3xl shadow-lg bg-white">
      <nav className="space-y-4 text-lg text-black">
        <div className="sidebar-section">
          <div className="custom-dropdown-label">Platform</div>
          <div className="custom-dropdown-selected" onClick={toggleDropdown}>
            <span>Posts</span>
            <span className="custom-dropdown-arrow">
              {postsDropdownOpen ? '▲' : '▼'}
            </span>
          </div>
          {postsDropdownOpen && (
            <div className="custom-dropdown-list">
              {postOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`custom-dropdown-option ${
                    (activeSection === 'all-posts' && opt.value === 'Facebook') ||
                    (activeSection === 'youtube-posts' && opt.value === 'Youtube') ? 'selected' : ''
                  }`}
                  onClick={() => selectPlatform(opt)}
                >
                  {opt.label}
                  {((activeSection === 'all-posts' && opt.value === 'Facebook') ||
                    (activeSection === 'youtube-posts' && opt.value === 'Youtube')) && '✔'}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="logout-btn mt-10 flex items-center" onClick={handleLogout}>
          {icons.Logout}
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default SideNavbar;
