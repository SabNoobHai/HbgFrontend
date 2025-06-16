// src/components/Analytics.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function Analytics() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [period, setPeriod] = useState("day");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/facebook/pages", {
          withCredentials: true,
        });
        const pageList = res.data.pages || [];
        setPages(pageList);
        if (pageList.length > 0) {
          setSelectedPage(pageList[0].id || pageList[0].pageId);
        }
      } catch (err) {
        console.error("Failed to fetch pages", err);
        setPages([]);
      }
    };
    fetchPages();
  }, []);

  useEffect(() => {
    if (!selectedPage) return;
    setLoading(true);
    axios
      .get("http://localhost:5000/insights/page", {
        params: {
          pageId: selectedPage,
          metrics: "page_impressions_unique,page_post_engagements,page_follows",
          period,
        },
        withCredentials: true,
      })
      .then((res) => {
        setAnalytics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch analytics", err);
        setAnalytics(null);
        setLoading(false);
      });
  }, [selectedPage, period]);

  let growth = [];
  let maxValue = 1;
  if (analytics?.data) {
    growth = analytics.data.map((metric) => ({
      label: metric.title || metric.name,
      value: metric.values?.[0]?.value || 0,
    }));
    maxValue = Math.max(...growth.map((item) => item.value), 1);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-16" style={{ background: "#23272f" }}>
      <style>{`
        .analytics-container {
          background: #23283a;
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.18);
          margin-top: 32px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 900px;
        }
        .analytics-label {
          color: #2563eb;
          font-weight: 600;
        }
        .analytics-select {
          background: #181c24;
          color: #fff;
          border: 1px solid #2563eb;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          margin-right: 0.5rem;
        }
        .analytics-overview-card {
          background: #181c24;
          border-radius: 12px;
          padding: 1.2rem 1rem;
          color: #fff;
          min-width: 150px;
          flex: 1;
          box-shadow: 0 2px 8px #0002;
          border-left: 4px solid #2563eb;
        }
        .analytics-bar {
          background: linear-gradient(180deg, #2563eb 60%, #1e293b 100%);
        }
        .analytics-bar-label {
          color: #2563eb;
        }
      `}</style>

      <div className="analytics-container">
        <div className="flex flex-wrap gap-6 mb-8 justify-between items-center">
          <div>
            <label className="analytics-label mr-2">Select Page:</label>
            <select
              className="analytics-select"
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
            >
              {pages.map((page) => (
                <option key={page.id || page.pageId} value={page.id || page.pageId}>
                  {page.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="analytics-label mr-2">Period:</label>
            <select
              className="analytics-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="days_28">Monthly</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-blue-400 text-center py-10">Loading analytics...</div>
        ) : analytics && growth.length > 0 ? (
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#2563eb] mb-4">Overview</h3>
              <div className="flex flex-wrap gap-8">
                {growth.map((item) => (
                  <div key={item.label} className="analytics-overview-card">
                    <div className="text-sm text-blue-300">{item.label}</div>
                    <div className="text-2xl font-bold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#181c24] rounded-lg p-6 mt-6">
              <h4 className="text-lg font-semibold text-[#2563eb] mb-4">Growth Chart</h4>
              <div className="flex items-end h-40 w-full gap-4">
                {growth.map((item) => {
                  const barHeight = Math.max((item.value / maxValue) * 120 + 10, 10);
                  return (
                    <div key={item.label} className="flex flex-col items-center flex-1">
                      <div
                        className="analytics-bar rounded-t w-8"
                        style={{
                          height: `${barHeight}px`,
                          transition: "height 0.3s",
                        }}
                        title={item.value}
                      ></div>
                      <span className="text-xs analytics-bar-label mt-2">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-blue-400 text-center py-10">No analytics data found.</div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
