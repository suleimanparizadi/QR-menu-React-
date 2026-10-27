import { useState } from 'react';
import { addItems, deleteItem, updateItem } from '../../api/items';
import { formatPrice } from '../../utils/formatPrice';

export default function ItemList({ section, onReload }) {
  const [item, setItem] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addItems(section.id, [{
        item,
        description,
        price: parseInt(price, 10),
      }]);
      setItem('');
      setDescription('');
      setPrice('');
      onReload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await deleteItem(id);
      onReload();
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      await updateItem(item.id, { available: !item.available });
      onReload();
    } catch (err) {
      setError('Failed to update item');
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}

      {section.items?.map((item) => (
        <div key={item.id} style={{
          padding: 8, borderBottom: '1px solid #eee',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <strong>{item.item}</strong>
            {item.description && <span style={{ color: '#666' }}> — {item.description}</span>}
            <span style={{ marginLeft: 8, color: '#2563eb' }}>{formatPrice(item.price)}</span>
            {!item.available && <span style={{ marginLeft: 8, color: '#dc2626' }}>(unavailable)</span>}
          </div>
          <div>
            <button className="btn btn-secondary" onClick={() => handleToggleAvailable(item)}>
              {item.available ? 'Hide' : 'Show'}
            </button>
            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      <form onSubmit={handleAdd} style={{ marginTop: 12 }}>
        <div className="row">
          <input className="input" placeholder="Item name"
            value={item} onChange={(e) => setItem(e.target.value)} required />
          <input className="input" placeholder="Description"
            value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="input" type="number" placeholder="Price"
            value={price} onChange={(e) => setPrice(e.target.value)} required />
          <button className="btn" type="submit">Add Item</button>
        </div>
      </form>
    </div>
  );
}