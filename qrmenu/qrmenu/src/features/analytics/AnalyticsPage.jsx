import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalytics, getMenu } from '../../api/menus';

export default function AnalyticsPage() {
  const { id } = useParams();
  
  const [data, setData] = useState(null);
  const [menuTitle, setMenuTitle] = useState('');
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const [analyticsRes, menuRes] = await Promise.all([
          getAnalytics(id, days),
          getMenu(id)
        ]);
        
        if (isMounted) {
          setData(analyticsRes.data);
          setMenuTitle(menuRes.data.menu.title);
        }
      } catch (err) {
        if (isMounted) setError('خطا در دریافت اطلاعات آمار.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => { isMounted = false; };
  }, [id, days]);

  // Safely find the max views
  const maxViews = data?.views_per_day?.length > 0 
    ? Math.max(...data.views_per_day.map(d => d.count || 0), 1) 
    : 1;

  // Helper to safely get the date string
  const getDateString = (day) => {
    const val = day.date || day.data || ''; // Fallback to 'data' if backend used it
    return typeof val === 'string' ? val.substring(5) : '?';
  };

  return (
    <div className="container" dir="rtl" style={{ paddingTop: 32, paddingBottom: 64 }}>
      
      <div className="section-header mb-4">
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>آمار بازدید</h1>
          <p className="text-muted" style={{ fontSize: 14 }}>
            عملکرد منوی <strong>{menuTitle}</strong> را بررسی کنید.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard" className="btn btn-ghost">بازگشت به داشبورد</Link>
        </div>
      </div>

      {error && <div className="error mb-4">{error}</div>}

      <div className="card mb-4 flex items-center justify-between">
        <span style={{ fontWeight: 600 }}>بازه زمانی:</span>
        <select 
          className="input" 
          style={{ width: 'auto', marginBottom: 0 }}
          value={days} 
          onChange={(e) => setDays(parseInt(e.target.value, 10))}
        >
          <option value={7}>۷ روز گذشته</option>
          <option value={30}>۳۰ روز گذشته</option>
          <option value={90}>۹۰ روز گذشته</option>
          <option value={365}>یک سال گذشته</option>
        </select>
      </div>

      {loading ? (
        <div className="card skeleton" style={{ height: 300 }}></div>
      ) : data ? (
        <>
          <div className="grid grid-2 mb-4">
            <div className="card text-center" style={{ background: 'var(--surface-subtle)' }}>
              <h4 className="text-muted mb-2" style={{ fontSize: 14 }}>کل بازدیدها</h4>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                {data.total_views}
              </div>
            </div>
            
            <div className="card text-center" style={{ background: 'var(--surface-subtle)' }}>
              <h4 className="text-muted mb-2" style={{ fontSize: 14 }}>بازدید امروز</h4>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary-light)' }}>
                {data.today_views}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4" style={{ fontSize: '1.1rem' }}>بازدید روزانه</h3>
            
            {!data.views_per_day || data.views_per_day.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <p>در این بازه زمانی هیچ بازدیدی ثبت نشده است.</p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                  {data.views_per_day.map((day, index) => {
                    const heightPercent = (day.count / maxViews) * 100;
                    
                    return (
                      <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                        <div 
                          style={{ 
                            width: '100%', maxWidth: 40,
                            height: `${heightPercent}%`, 
                            minHeight: day.count > 0 ? 4 : 0,
                            background: 'linear-gradient(to top, var(--color-primary-dark), var(--color-primary-light))',
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.3s ease',
                            position: 'relative'
                          }}
                        >
                          <div style={{ position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)', background: 'var(--surface-input)', padding: '2px 6px', borderRadius: 4, fontSize: 10, whiteSpace: 'nowrap', opacity: day.count > 0 ? 1 : 0 }}>
                            {day.count}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {data.views_per_day.map((day, index) => (
                    <div key={index} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', direction: 'ltr' }}>
                      {getDateString(day)}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {data.peak_day && (
              <div className="mt-4" style={{ background: 'rgba(39, 131, 77, 0.1)', padding: 12, borderRadius: 8, border: '1px solid var(--color-primary-light)' }}>
                <p style={{ margin: 0, fontSize: 14 }}>
                  🏆 <strong>پر بازدیدترین روز:</strong> {getDateString(data.peak_day)} با {data.peak_day.count} بازدید
                </p>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}