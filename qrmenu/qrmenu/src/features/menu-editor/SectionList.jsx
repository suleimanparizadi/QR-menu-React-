import { useState } from 'react';
import { createSection, deleteSection } from '../../api/sections';
import ItemList from './ItemList';

// Helper to generate 24-hour times from 00:00 to 23:30
const generateTimes = () => {
  const times = [];
  for (let h = 0; h <= 24; h++) {
    for (let m = 0; m < 60; m += 60) {
      const hourStr = String(h).padStart(2, '0');
      const minStr = String(m).padStart(2, '0');
      times.push(`${hourStr}:${minStr}`);
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimes();

export default function SectionList({ menu, onReload }) {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createSection(menu.id, {
        name,
        start_time: startTime || null,
        end_time: endTime || null,
      });
      setName('');
      setStartTime('');
      setEndTime('');
      onReload();
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ساخت بخش جدید.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این بخش مطمئن هستید؟ تمام آیتم‌های داخل آن نیز حذف می‌شوند.')) return;
    try {
      await deleteSection(id);
      onReload();
    } catch (err) {
      setError('خطا در حذف بخش.');
    }
  };

  return (
    <div>
      {error && <div className="error mb-3">{error}</div>}

      <div className="card mb-4" style={{ background: 'var(--surface-subtle)' }}>
        <h4 className="mb-3">افزودن بخش جدید</h4>
        <form onSubmit={handleCreate}>
          
          {/* First Row: Name */}
          <div className="mb-3">
            <label className="label">نام بخش</label>
            <input 
              className="input" 
              placeholder="مثلاً: صبحانه" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          {/* Second Row: Times (Grid) */}
          <div className="grid grid-2 mb-3">
            <div>
              <label className="label">ساعت شروع (اختیاری)</label>
              <select 
                className="input" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                style={{ direction: 'ltr', textAlign: 'right' }}
              >
                <option value="">همیشه فعال</option>
                {TIME_OPTIONS.map(time => (
                  <option key={`start-${time}`} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="label">ساعت پایان (اختیاری)</label>
              <select 
                className="input" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                style={{ direction: 'ltr', textAlign: 'right' }}
              >
                <option value="">همیشه فعال</option>
                {TIME_OPTIONS.map(time => (
                  <option key={`end-${time}`} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Third Row: Button */}
          <div>
            <button className="btn" type="submit" style={{ width: '100%' }}>
              افزودن بخش
            </button>
          </div>

        </form>
      </div>

      {menu.sections?.length === 0 ? (
        <div className="card empty-state" style={{ padding: 32 }}>
          <p>هنوز هیچ بخشی نساخته‌اید. اولین بخش را بالا اضافه کنید.</p>
        </div>
      ) : (
        menu.sections?.map((section) => (
          <div key={section.id} className="card mb-3" style={{ borderRight: '4px solid var(--color-primary)' }}>
            <div className="section-header" style={{ marginBottom: 12 }}>
              <div>
                <h4 style={{ fontSize: 16, margin: 0 }}>{section.name}</h4>
                {section.start_time && (
                  <span className="badge mt-2" style={{ fontSize: 10, direction: 'ltr', display: 'inline-block' }}>
                    ⏰ {section.start_time} - {section.end_time}
                  </span>
                )}
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(section.id)}>
                حذف بخش
              </button>
            </div>
            <ItemList section={section} onReload={onReload} />
          </div>
        ))
      )}
    </div>
  );
}