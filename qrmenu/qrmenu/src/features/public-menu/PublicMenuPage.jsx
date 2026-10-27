import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicMenu } from '../../api/PublicMenu';
import { formatPrice } from '../../utils/formatPrice';

export default function PublicMenuPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicMenu(id)
      .then((res) => setData(res.data))
      .catch(() => setError('Menu not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container">Loading...</div>;
  if (error || !data) return <div className="container"><div className="error">{error}</div></div>;

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div className="card">
        <h1>{data.menu.title}</h1>
        {data.menu.description && <p style={{ color: '#666' }}>{data.menu.description}</p>}
      </div>

      {data.sections.map((section) => (
        <div key={section.id} className="card">
          <h2>{section.name}</h2>
          {section.start_time && (
            <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>
              {section.start_time} — {section.end_time}
            </p>
          )}
          {section.items.map((item) => (
            <div key={item.id} style={{
              padding: '12px 0',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <div>
                <strong>{item.item}</strong>
                {item.description && <p style={{ color: '#666', fontSize: 14 }}>{item.description}</p>}
              </div>
              <div style={{ color: '#2563eb', fontWeight: 'bold' }}>
                {formatPrice(item.price)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}