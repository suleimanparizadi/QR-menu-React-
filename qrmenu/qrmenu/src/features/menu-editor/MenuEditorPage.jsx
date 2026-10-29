import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMenu, getMenuPreview } from '../../api/menus';
import SectionList from './SectionList';
import { formatPrice } from '../../utils/formatPrice';

export default function MenuEditorPage() {
  const { id } = useParams();
  
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [mode, setMode] = useState('edit'); 
  const [previewData, setPreviewData] = useState(null);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const res = await getMenu(id);
      setMenu(res.data.menu);
    } catch (err) {
      setError('منو یافت نشد.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreview = async () => {
    try {
      const res = await getMenuPreview(id);
      setPreviewData(res.data);
      setMode('preview');
    } catch (err) {
      setError('خطا در دریافت پیش‌نمایش منو.');
    }
  };

  useEffect(() => {
    loadMenu();
  }, [id]);

  if (loading) return <div className="container text-center mt-5"><div className="spinner" style={{ margin: '0 auto' }}></div></div>;
  if (error) return <div className="container mt-4"><div className="error">{error}</div></div>;
  if (!menu) return <div className="container mt-4">منو یافت نشد.</div>;

  return (
    <div className="container" dir="rtl" style={{ paddingTop: 32, paddingBottom: 64 }}>
      
      <div className="section-header mb-4">
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>{menu.title}</h1>
          <p className="text-muted" style={{ fontSize: 14 }}>
            {mode === 'edit' ? 'بخش‌ها و آیتم‌های منو را مدیریت کنید.' : 'پیش‌نمایش منو و کد QR نهایی'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard" className="btn btn-ghost">بازگشت به داشبورد</Link>
          {mode === 'edit' ? (
            <button className="btn btn-accent" onClick={loadPreview}>
              پایان و مشاهده کد QR ←
            </button>
          ) : (
            <button className="btn" onClick={() => setMode('edit')}>
              بازگشت به ویرایش
            </button>
          )}
        </div>
      </div>

      {mode === 'edit' && (
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <div>
            <h3 className="mb-3">بخش‌های منو</h3>
            <SectionList menu={menu} onReload={loadMenu} />
          </div>
          
          <div className="card" style={{ background: 'var(--surface-subtle)', borderColor: 'var(--border)' }}>
            <h4 className="mb-2" style={{ color: 'var(--color-primary-light)' }}>💡 راهنما</h4>
            <p className="text-muted" style={{ fontSize: 14, lineHeight: 2 }}>
              شما می‌توانید بخش‌های مختلفی مثل «صبحانه»، «ناهار» و «شام» بسازید. 
              برای هر بخش می‌توانید ساعت شروع و پایان تعیین کنید. 
              وقتی مشتری کد QR را اسکن می‌کند، فقط بخش‌هایی که در آن ساعت فعال هستند را می‌بیند. 
              اگر ساعت را خالی بگذارید، آن بخش همیشه نمایش داده می‌شود.
            </p>
            <p className="text-muted" style={{ fontSize: 14, lineHeight: 2, marginTop: 12 }}>
              پس از افزودن آیتم‌ها، روی دکمه <strong>«پایان و مشاهده کد QR»</strong> کلیک کنید تا پیش‌نمایش نهایی و کد QR را دریافت کنید.
            </p>
          </div>
        </div>
      )}

      {mode === 'preview' && previewData && (
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <div>
            <h3 className="mb-3">پیش‌نمایش منو (آنچه مشتری می‌بیند)</h3>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="restaurant-hero" style={{ minHeight: 140, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
                <div className="restaurant-hero-content">
                  <h1 style={{ fontSize: '1.5rem' }}>{previewData.menu.title}</h1>
                  <p>{previewData.menu.description}</p>
                </div>
              </div>
              
              <div style={{ padding: 16 }}>
                {previewData.sections.length === 0 ? (
                  <p className="text-muted text-center py-4">هنوز هیچ بخشی برای این منو ساخته نشده است.</p>
                ) : (
                  previewData.sections.map(sec => (
                    <div key={sec.id} className="mb-4">
                      <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 12, color: 'var(--color-accent)' }}>
                        {sec.name}
                        {sec.start_time && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginRight: 8, fontWeight: 'normal', direction: 'ltr', display: 'inline-block' }}>
                            ({sec.start_time} - {sec.end_time})
                          </span>
                        )}
                      </h4>
                      {sec.items.length === 0 ? (
                        <p className="text-muted" style={{ fontSize: 12 }}>آیتمی در این بخش وجود ندارد.</p>
                      ) : (
                        <div className="stack">
                          {sec.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center" style={{ paddingBottom: 8 }}>
                              <div>
                                <div style={{ fontSize: 15, fontWeight: 700 }}>{item.item}</div>
                                {item.description && <div className="text-muted" style={{ fontSize: 12 }}>{item.description}</div>}
                              </div>
                              <div style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>
                                {formatPrice(item.price)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="card text-center" style={{ padding: 32 }}>
            <h3 className="mb-2">کد QR شما آماده است!</h3>
            <p className="text-muted mb-4" style={{ fontSize: 14 }}>
              این کد را چاپ کنید و روی میزهای کافه خود بگذارید. مشتریان با اسکن آن، منو را می‌بینند.
            </p>
            
            {menu.qr_code ? (
              <>
                <img 
                  src={menu.qr_code} 
                  alt="QR Code" 
                  className="qr-img" 
                  style={{ maxWidth: 220, margin: '0 auto 20px' }} 
                />
                <div className="flex gap-2 justify-center">
                  <a 
                    href={menu.qr_code} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    دانلود تصویر
                  </a>
                  <a 
                    href={`${import.meta.env.VITE_API_URL}/menu/${menu.id}/`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn"
                  >
                    مشاهده منو (لینک مستقیم)
                  </a>
                </div>
              </>
            ) : (
              <div style={{ padding: 40, background: 'var(--surface-input)', borderRadius: 8 }}>
                <p className="text-muted">کد QR در حال ساخت است...</p>
                <button className="btn btn-sm mt-2" onClick={loadMenu}>بررسی مجدد</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}