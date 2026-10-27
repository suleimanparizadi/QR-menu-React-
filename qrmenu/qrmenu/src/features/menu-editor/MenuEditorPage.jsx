import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMenu, getMenuPreview } from '../../api/menus';
import SectionList from './SectionList';
import QrCodePanel from './QrCodePanel';

export default function MenuEditorPage() {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const res = await getMenu(id);
      setMenu(res.data.menu);
    } catch (err) {
      setError('Menu not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [id]);

  const loadPreview = async () => {
    try {
      const res = await getMenuPreview(id);
      setPreview(res.data);
    } catch (err) {
      setError('Failed to load preview');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!menu) return <p>{error || 'Menu not found'}</p>;

  return (
    <div>
      <div className="section-header">
        <h2>{menu.title}</h2>
        <Link to="/dashboard">
          <button className="btn btn-secondary">Back</button>
        </Link>
      </div>

      <QrCodePanel menu={menu} />

      <SectionList menu={menu} onReload={loadMenu} />

      <div className="card">
        <button className="btn" onClick={loadPreview}>Preview Public View</button>
        {preview && (
          <div style={{ marginTop: 16 }}>
            <h3>{preview.menu.title}</h3>
            <p>{preview.menu.description}</p>
            {preview.sections.map((s) => (
              <div key={s.id} style={{ marginTop: 12 }}>
                <h4>{s.name}</h4>
                <ul>
                  {s.items.map((item) => (
                    <li key={item.id}>
                      {item.item} — {item.price}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}