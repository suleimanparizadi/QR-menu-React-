import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicMenu } from '../../api/PublicMenu';
import MenuPreview from '../../components/MenuPreview';

export default function PublicMenuPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicMenu(id)
      .then((res) => setData(res.data))
      .catch(() => setError('منو یافت نشد.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="container" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div className="spinner"></div>
    </div>
  );

  if (error || !data) return (
    <div className="container menu-empty" style={{ minHeight: '100vh' }}>
      <div className="menu-empty-icon">☕</div>
      <h2>منو یافت نشد</h2>
      <p>{error || 'این منو وجود ندارد یا در حال حاضر غیرفعال است.'}</p>
    </div>
  );

  return (
    <MenuPreview 
      menu={data.menu} 
      sections={data.sections} 
    />
  );
}