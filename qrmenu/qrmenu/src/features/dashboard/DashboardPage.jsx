import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { getMenus, createMenu, deleteMenu } from '../../api/menus';

export default function DashboardPage() {
  const navigate = useNavigate(); 
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadMenus = async () => {
    setLoading(true);
    try {
      const res = await getMenus();
      setMenus(res.data.menus);
    } catch (err) {
      setError('خطا در دریافت لیست منوها.');
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
    setCreating(true);
    try {
      const res = await createMenu({ title: newTitle, description: newDescription });
      
      if (res.data && res.data.menu) {
        navigate(`/menus/${res.data.menu.id}`); 
      } else {
        loadMenus(); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ساخت منو.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این منو مطمئن هستید؟ تمام بخش‌ها و آیتم‌های آن نیز حذف خواهند شد.')) return;
    try {
      await deleteMenu(id);
      loadMenus();
    } catch (err) {
      setError('خطا در حذف منو.');
    }
  };

  // --- New Download & Print Functions ---
  const handleDownload = async (url, title) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `QR-${title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('خطا در دانلود تصویر. لطفا دوباره تلاش کنید.');
    }
  };

  const handlePrint = (url, title) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>چاپ کد QR - ${title}</title>
          <style>
            body { 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0; 
              font-family: Tahoma, sans-serif; 
            }
            img { 
              width: 350px; 
              height: 350px; 
              margin-bottom: 20px; 
            }
            h1 { 
              font-size: 24px; 
              margin: 0; 
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <img src="${url}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  // -------------------------------------

  return (
    <div className="container" dir="rtl" style={{ paddingTop: 32, paddingBottom: 32 }}>
      
      {/* Header */}
      <div className="section-header" style={{ marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>منوهای من</h1>
          <p className="text-muted">منوهای خود را مدیریت کنید و کد QR آن‌ها را دریافت کنید.</p>
        </div>
        <button 
          className={`btn ${showForm ? 'btn-ghost' : 'btn-accent'}`} 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'انصراف' : '+ منوی جدید'}
        </button>
      </div>

      {error && <div className="error mb-4">{error}</div>}

      {/* Create Form */}
      {showForm && (
        <div className="card mb-4" style={{ borderColor: 'var(--color-primary-light)' }}>
          <h3 className="mb-3">ساخت منوی جدید</h3>
          <form onSubmit={handleCreate}>
            <div className="row">
              <div style={{ flex: '1 1 300px' }}>
                <label className="label">نام منو (نام کافه یا رستوران)</label>
                <input 
                  className="input" 
                  placeholder="مثلاً: کافه سنتی گل‌ها"
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  required 
                />
              </div>
              <div style={{ flex: '2 1 400px' }}>
                <label className="label">توضیحات (اختیاری)</label>
                <input 
                  className="input" 
                  placeholder="مثلاً: بهترین قهوه در قلب شهر"
                  value={newDescription} 
                  onChange={(e) => setNewDescription(e.target.value)} 
                />
              </div>
            </div>
            <div className="mt-3">
              <button className="btn" type="submit" disabled={creating}>
                {creating ? 'در حال ساخت...' : 'ساخت منو و دریافت کد QR'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-2">
          <div className="card skeleton" style={{ height: 200 }}></div>
          <div className="card skeleton" style={{ height: 200 }}></div>
        </div>
      ) : menus.length === 0 ? (
        /* Empty State */
        <div className="card empty-state">
          <div style={{ fontSize: 48, marginBottom: 16 }}>☕</div>
          <h3>هنوز منویی نساخته‌اید</h3>
          <p>اولین منوی دیجیتال خود را بسازید و کد QR آن را روی میزهایتان قرار دهید.</p>
          <button className="btn btn-accent mt-3" onClick={() => setShowForm(true)}>
            ساخت اولین منو
          </button>
        </div>
      ) : (
        /* Menus Grid */
        <div className="grid grid-2">
          {menus.map((menu) => (
            <div key={menu.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: 4 }}>{menu.title}</h3>
                  <p className="text-muted" style={{ fontSize: 13, minHeight: 20 }}>
                    {menu.description || 'بدون توضیحات'}
                  </p>
                </div>
                <span className="badge">آیدی: {menu.id}</span>
              </div>

              <div className="flex gap-4 mt-auto" style={{ 
                background: 'var(--surface-input)', 
                padding: 16, 
                borderRadius: 'var(--radius-md)',
                flexWrap: 'wrap', 
              }}>
                
                {/* QR Code Preview + Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '0 auto' }}>
                  {menu.qr_code && menu.qr_code.startsWith('http') ? (
                    <img 
                      src={menu.qr_code} 
                      alt={`QR code for ${menu.title}`} 
                      style={{ width: 100, height: 100, borderRadius: 8, border: '2px solid white', objectFit: 'contain' }} 
                    />
                  ) : (
                    <div style={{ width: 100, height: 100, background: '#334', borderRadius: 8, display: 'grid', placeItems: 'center', fontSize: 10, color: '#999', textAlign: 'center', padding: 8 }}>
                      در حال ساخت...
                    </div>
                  )}
                  
                  {/* Download & Print Buttons */}
                  {menu.qr_code && menu.qr_code.startsWith('http') && (
                    <div className="flex gap-2 w-full">
                      <button 
                        className="btn btn-sm btn-secondary" 
                        style={{ padding: '4px 8px', fontSize: 11, flex: 1 }}
                        onClick={() => handleDownload(menu.qr_code, menu.title)}
                        title="دانلود تصویر"
                      >
                        دانلود
                      </button>
                      <button 
                        className="btn btn-sm btn-secondary" 
                        style={{ padding: '4px 8px', fontSize: 11, flex: 1 }}
                        onClick={() => handlePrint(menu.qr_code, menu.title)}
                        title="چاپ کد"
                      >
                        چاپ
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
                  <Link to={`/menus/${menu.id}`} className="btn btn-sm btn-block">
                    ویرایش منو
                  </Link>
                  <div className="flex gap-2">
                    <Link to={`/menus/${menu.id}/analytics`} className="btn btn-sm btn-secondary" style={{ flex: 1 }}>
                      آمار
                    </Link>
                    <button 
                      className="btn btn-sm btn-danger" 
                      style={{ flex: 1 }}
                      onClick={() => handleDelete(menu.id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}