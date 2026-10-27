import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalytics } from '../../api/menus';

export default function AnalyticsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [days, setDays] = useState(7);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnalytics(id, days)
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load analytics'));
  }, [id, days]);

  return (
    <div>
      <div className="section-header">
        <h2>Analytics</h2>
        <Link to="/dashboard">
          <button className="btn btn-secondary">Back</button>
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <label>Date range: </label>
        <select value={days} onChange={(e) => setDays(parseInt(e.target.value, 10))}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {data && (
        <>
          <div className="card">
            <h3>Total Views: {data.total_views}</h3>
            <h3>Today: {data.today_views}</h3>
            {data.peak_day && (
              <p>Peak day: {data.peak_day.date} ({data.peak_day.count} views)</p>
            )}
          </div>

          <div className="card">
            <h3>Views Per Day</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: 8, textAlign: 'left' }}>Date</th>
                  <th style={{ padding: 8, textAlign: 'right' }}>Views</th>
                </tr>
              </thead>
              <tbody>
                {data.views_per_day.map((row) => (
                  <tr key={row.date} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: 8 }}>{row.date}</td>
                    <td style={{ padding: 8, textAlign: 'right' }}>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}