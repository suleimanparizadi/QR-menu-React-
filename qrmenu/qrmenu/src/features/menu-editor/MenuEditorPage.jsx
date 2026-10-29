import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMenu, getMenuPreview } from '../../api/menus';
import SectionList from './SectionList';
import MenuPreview from '../../components/MenuPreview';

export default function MenuEditorPage() {
  const { id } = useParams();
  
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [mode, setMode] = useState('edit'); 
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

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
    setPreviewLoading(true);
    setError('');
    try {
      const res = await getMenuPreview(id);
      setPreviewData(res.data);
      setMode('preview'); // Only switch mode if successful
    } catch (err) {
      setError('خطا در دریافت پیش‌نمایش منو. لطفا دوباره تلاش کنید.');
      setMode('edit'); // Stay in edit mode if it fails
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [id]);

  if (loading) return <div className="container text-center mt-5"><div className="spinner" style={{ margin: '0 auto' }}></div></div>;
  if (error && mode === 'edit') return <div className="container mt-4"><div className="error">{error}</div></div>;
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
            <button className="btn btn-accent" onClick={loadPreview} disabled={previewLoading}>
              {previewLoading ? 'در حال آماده‌سازی...' : 'پایان و مشاهده کد QR ←'}
            </button>
          ) : (
            <button className="btn" onClick={() => setMode('edit')}>
              بازگشت به ویرایش
            </button>
          )}
        </div>
      </div>

      {error && mode === 'preview' && <div className="error mb-3">{error}</div>}

      {/* EDIT MODE */}
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

      {/* PREVIEW & QR MODE */}
      {mode === 'preview' && previewData && (
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          
          {/* Left side: Public Menu Preview (Now using the component) */}
          <div>
            <h3 className="mb-3">پیش‌نمایش منو (آنچه مشتری می‌بیند)</h3>
            <MenuPreview 
              menu={previewData.menu} 
              sections={previewData.sections} 
            />
          </div>

          {/* Right side: QR Code */}
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
                href={`/menu/${menu.id}/`} 
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