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
      setError(err.response?.data?.message || 'خطا در افزودن آیتم جدید.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این آیتم مطمئن هستید؟')) return;
    try {
      await deleteItem(id);
      onReload();
    } catch (err) {
      setError('خطا در حذف آیتم.');
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      await updateItem(item.id, { available: !item.available });
      onReload();
    } catch (err) {
      setError('خطا در بروزرسانی وضعیت آیتم.');
    }
  };

  return (
    <div style={{ background: 'var(--surface-input)', padding: 16, borderRadius: 'var(--radius-sm)' }}>
      {error && <div className="error mb-3">{error}</div>}

      {section.items?.length === 0 ? (
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 12 }}>آیتمی در این بخش وجود ندارد.</p>
      ) : (
        <div className="stack mb-3">
          {section.items?.map((item) => (
            <div key={item.id} style={{
              padding: '8px 12px', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8
            }}>
              <div>
                <strong style={{ fontSize: 14 }}>{item.item}</strong>
                {item.description && <span className="text-muted" style={{ fontSize: 12 }}> — {item.description}</span>}
                <span style={{ marginRight: 12, color: 'var(--color-primary-light)', fontSize: 13, fontWeight: 700 }}>{formatPrice(item.price)}</span>
                {!item.available && <span className="badge badge-danger" style={{ marginRight: 8, fontSize: 10 }}>ناموجود</span>}
              </div>
              <div className="flex gap-1">
                <button className="btn btn-sm btn-secondary" onClick={() => handleToggleAvailable(item)}>
                  {item.available ? 'مخفی کن' : 'نمایش بده'}
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} style={{ borderTop: section.items?.length ? '1px solid var(--border)' : 'none', paddingTop: section.items?.length ? 16 : 0 }}>
        <h5 style={{ fontSize: 13, marginBottom: 8, color: 'var(--text-muted)' }}>افزودن آیتم جدید</h5>
        <div className="row">
          <input className="input" placeholder="نام آیتم (مثلاً: اسپرسو)"
            value={item} onChange={(e) => setItem(e.target.value)} required 
            style={{ flex: '2 1 150px' }} />
          
          <input className="input" placeholder="توضیحات (اختیاری)"
            value={description} onChange={(e) => setDescription(e.target.value)} 
            style={{ flex: '2 1 200px' }} />
          
          <input className="input" type="number" placeholder="قیمت (تومان)"
            value={price} onChange={(e) => setPrice(e.target.value)} required 
            style={{ flex: '1 1 100px' }} />
          
          <button className="btn" type="submit" style={{ flex: '0 0 auto' }}>افزودن</button>
        </div>
      </form>
    </div>
  );
}