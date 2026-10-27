import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMenus, createMenu, deleteMenu } from '../../api/menus';
import { formatPrice } from '../../utils/formatPrice';

export default function DashboardPage() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadMenus = async () => {
    setLoading(true);
    try {
      const res = await getMenus();
      setMenus(res.data.menus);
    } catch (err) {
      setError('Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createMenu({ title: newTitle, description: newDescription });
      setNewTitle('');
      setNewDescription('');
      setShowForm(false);
      loadMenus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create menu');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu?')) return;
    try {
      await deleteMenu(id);
      loadMenus();
    } catch (err) {
      setError('Failed to delete menu');
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>My Menus</h2>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Menu'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="card">
          <form onSubmit={handleCreate}>
            <input className="input" placeholder="Menu title"
              value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
            <input className="input" placeholder="Description (optional)"
              value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            <button className="btn" type="submit">Create</button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : menus.length === 0 ? (
        <p>No menus yet. Create your first menu.</p>
      ) : (
        menus.map((menu) => (
          <div key={menu.id} className="card">
            <div className="section-header">
              <div>
                <h3>{menu.title}</h3>
                <p style={{ color: '#666' }}>{menu.description}</p>
                <p style={{ fontSize: 12, color: '#999' }}>
                  {menu.sections?.length || 0} sections
                </p>
              </div>
              <div>
                <Link to={`/menus/${menu.id}`}>
                  <button className="btn">Edit</button>
                </Link>
                <Link to={`/menus/${menu.id}/analytics`}>
                  <button className="btn btn-secondary">Analytics</button>
                </Link>
                <button className="btn btn-danger" onClick={() => handleDelete(menu.id)}>
                  Delete
                </button>
              </div>
            </div>
            {menu.qr_code && (
              <img src={menu.qr_code} alt="QR" className="qr-img" />
            )}
          </div>
        ))
      )}
    </div>
  );
}