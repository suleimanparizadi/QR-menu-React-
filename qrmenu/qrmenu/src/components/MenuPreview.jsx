import '../features/public-menu/PublicMenu.css';
import { formatPrice } from '../utils/formatPrice';

export default function MenuPreview({ menu, sections }) {
  if (!menu) return null;

  // Sort sections by 'order' before rendering
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="public-menu-container">
      {/* Header */}
      <div 
        className="menu-header"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80)' }}
      >
        <div className="menu-header-content">
          <h1>{menu.title}</h1>
          {menu.description && <p>{menu.description}</p>}
        </div>
      </div>

      {/* Sections */}
      <div className="menu-section-list">
        {sortedSections.length === 0 ? (
          <div className="menu-empty">
            <div className="menu-empty-icon">🍽️</div>
            <p>هنوز هیچ آیتمی به این منو اضافه نشده است.</p>
          </div>
        ) : (
          sortedSections.map((section) => ( // <-- Use sortedSections here
            <div key={section.id} className="menu-section-group">
              <h2 className="menu-section-title">
                {section.name}
                {section.start_time && (
                  <span className="menu-section-time">
                    ({section.start_time} - {section.end_time})
                  </span>
                )}
              </h2>

              <div>
                {section.items.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    آیتمی در این بخش ثبت نشده است.
                  </p>
                ) : (
                  section.items.map((item) => (
                    <div key={item.id} className={`menu-item ${!item.available ? 'unavailable' : ''}`}>
                      <div className="menu-item-info">
                        <div className="menu-item-name">
                          {item.item}
                          {!item.available && <span className="unavailable-badge">ناموجود</span>}
                        </div>
                        {item.description && <div className="menu-item-desc">{item.description}</div>}
                      </div>
                      <div className="menu-item-price">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}