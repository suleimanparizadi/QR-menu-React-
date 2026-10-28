
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const steps = [
  {
    n: '۱',
    title: 'منو بسازید',
    description:
      'با شماره موبایل ثبت‌نام کنید. نام کافه، توضیحات و آیتم‌های منو را اضافه کنید.',
    icon: '✦',
  },
  {
    n: '۲',
    title: 'بر اساس زمان دسته‌بندی کنید',
    description:
      'بخش‌هایی مثل صبحانه، ناهار، شام یا نوشیدنی بسازید. هر بخش فقط در ساعت مشخصی نمایش داده می‌شود.',
    icon: '◷',
  },
  {
    n: '۳',
    title: 'کد QR بگیرید',
    description:
      'ما یک کد QR اختصاصی برای منوی شما می‌سازیم. آن را چاپ کنید و روی هر میز بگذارید.',
    icon: '▦',
  },
  {
    n: '۴',
    title: 'مشتری اسکن می‌کند',
    description:
      'مشتری با گوشی کد QR را اسکن می‌کند و بلافاصله منو را می‌بیند — بدون نصب اپلیکیشن.',
    icon: '↗',
  },
];

const features = [
  'زمان‌بندی منو بر اساس ساعت (صبحانه، ناهار، شام)',
  'منو، بخش و آیتم نامحدود',
  'ساخت خودکار کد QR',
  'آمار بازدید — ببینید چند نفر منوی شما را دیده‌اند',
  'مخفی کردن آیتم‌های ناموجود با یک کلیک',
  'روی هر گوشی کار می‌کند — بدون نیاز به اپلیکیشن',
];

export default function WelcomePage() {
  const { user } = useAuth();

  const primaryPath = user ? '/dashboard' : '/register';
  const primaryLabel = user
    ? 'رفتن به داشبورد'
    : 'شروع کنید — رایگان';

  return (
    <div className="welcome-page" dir="rtl">
      <nav className="welcome-nav" aria-label="ناوبری اصلی">
        <div className="welcome-nav-inner">
          <Link
            to="/"
            className="welcome-brand"
            aria-label="QRMenu - صفحه اصلی"
          >
            <span className="welcome-brand-icon" aria-hidden="true">
              ☕
            </span>
            <span>QRMenu</span>
          </Link>

          <div className="welcome-nav-actions">
            {user ? (
              <Link
                to="/dashboard"
                className="btn btn-sm welcome-nav-register"
              >
                داشبورد
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  ورود
                </Link>
                <Link
                  to="/register"
                  className="btn btn-sm welcome-nav-register"
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        <section
          className="welcome-hero"
          aria-labelledby="welcome-title"
        >
          <div
            className="welcome-hero-overlay"
            aria-hidden="true"
          />

          <div className="welcome-hero-content">
            <span className="welcome-eyebrow">
              تجربه‌ای ساده‌تر برای کافه شما
            </span>

            <h1 id="welcome-title">
              منوی دیجیتال کافه و رستوران شما
            </h1>

            <p>
              در چند دقیقه منوی QR بسازید، قیمت‌ها را هر زمان
              تغییر دهید و بخش‌های مختلف (صبحانه، ناهار، شام)
              را بر اساس ساعت روز نمایش دهید.
            </p>

            <div className="welcome-hero-actions">
              <Link
                to={primaryPath}
                className="btn btn-accent btn-lg"
              >
                {primaryLabel}
                <span aria-hidden="true">←</span>
              </Link>
            </div>

            <div className="welcome-hero-note">
              <span aria-hidden="true">✓</span>
              <span>بدون نیاز به نصب اپلیکیشن</span>
              <span
                className="welcome-note-divider"
                aria-hidden="true"
              >
                ·
              </span>
              <span>راه‌اندازی آسان</span>
            </div>
          </div>

          <div
            className="welcome-hero-decoration"
            aria-hidden="true"
          >
            <span>☕</span>
          </div>
        </section>

        <section
          className="welcome-section welcome-how"
          aria-labelledby="welcome-how-title"
        >
          <div className="welcome-section-heading">
            <span className="welcome-section-kicker">
              شروع آسان
            </span>
            <h2 id="welcome-how-title">چطور کار می‌کند؟</h2>
            <p>
              در چهار قدم ساده، منوی کافه‌تان را دیجیتال کنید
            </p>
          </div>

          <div className="welcome-steps-grid">
            {steps.map((step) => (
              <article
                className="welcome-step-card"
                key={step.n}
              >
                <div className="welcome-step-top">
                  <span className="welcome-step-number">
                    {step.n}
                  </span>
                  <span
                    className="welcome-step-icon"
                    aria-hidden="true"
                  >
                    {step.icon}
                  </span>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="welcome-features-section"
          aria-labelledby="welcome-features-title"
        >
          <div className="welcome-section welcome-features-inner">
            <div className="welcome-section-heading">
              <span className="welcome-section-kicker">
                امکانات کاربردی
              </span>
              <h2 id="welcome-features-title">
                همه‌چیز برای یک منوی حرفه‌ای
              </h2>
            </div>

            <div className="welcome-features-grid">
              {features.map((feature) => (
                <div
                  className="welcome-feature-item"
                  key={feature}
                >
                  <span
                    className="welcome-feature-check"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="welcome-cta-section"
          aria-labelledby="welcome-cta-title"
        >
          <div className="welcome-cta-card">
            <div
              className="welcome-cta-symbol"
              aria-hidden="true"
            >
              ☕
            </div>

            <span className="welcome-section-kicker">
              وقت شروع است
            </span>

            <h2 id="welcome-cta-title">
              {user
                ? 'به داشبورد خود برگردید'
                : 'آماده‌اید منوی کافه‌تان را دیجیتال کنید؟'}
            </h2>

            <p>
              {user
                ? 'منوهای خود را مدیریت کنید و آمار بازدید را ببینید.'
                : 'رایگان ثبت‌نام کنید و در ۵ دقیقه منوی آنلاین داشته باشید.'}
            </p>

            <Link
              to={primaryPath}
              className="btn btn-accent btn-lg"
            >
              {user ? 'رفتن به داشبورد' : 'ساخت منوی من'}
              <span aria-hidden="true">←</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="welcome-footer">
        <Link
          to="/"
          className="welcome-footer-brand"
          aria-label="QRMenu - صفحه اصلی"
        >
          <span aria-hidden="true">☕</span>
          QRMenu
        </Link>
        <p>ساخته شده با Django و React</p>
      </footer>
    </div>
  );
}
