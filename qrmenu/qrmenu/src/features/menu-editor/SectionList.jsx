import { useState } from 'react';
import { createSection, deleteSection } from '../../api/sections';
import ItemList from './ItemList';

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
      setError(err.response?.data?.message || 'Failed to create section');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this section and all its items?')) return;
    try {
      await deleteSection(id);
      onReload();
    } catch (err) {
      setError('Failed to delete section');
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: 12 }}>Sections</h3>

      <div className="card">
        <form onSubmit={handleCreate}>
          <div className="row">
            <input className="input" placeholder="Section name"
              value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="input" type="time" value={startTime}
              onChange={(e) => setStartTime(e.target.value)} />
            <input className="input" type="time" value={endTime}
              onChange={(e) => setEndTime(e.target.value)} />
            <button className="btn" type="submit">Add Section</button>
          </div>
        </form>
        {error && <div className="error">{error}</div>}
      </div>

      {menu.sections?.map((section) => (
        <div key={section.id} className="card">
          <div className="section-header">
            <div>
              <h4>{section.name}</h4>
              {section.start_time && (
                <p style={{ fontSize: 12, color: '#666' }}>
                  {section.start_time} — {section.end_time}
                </p>
              )}
            </div>
            <button className="btn btn-danger" onClick={() => handleDelete(section.id)}>
              Delete Section
            </button>
          </div>
          <ItemList section={section} onReload={onReload} />
        </div>
      ))}
    </div>
  );
}