import { useState, useMemo } from 'react';
import type { ClientGroup } from '../types';

interface GroupSearchProps {
  groups: ClientGroup[];
  loading: boolean;
  onSelect: (group: ClientGroup) => void;
  onBack: () => void;
}

export function GroupSearch({ groups, loading, onSelect, onBack }: GroupSearchProps) {
  const [query, setQuery] = useState('');

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    return groups.filter((g) => g.name.toLowerCase().includes(q));
  }, [groups, query]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backButton}>
            ← Settings
          </button>
          <h2 style={styles.title}>Select Client Group</h2>
          <p style={styles.subtitle}>
            Search for a client group to generate its structure diagram
          </p>
        </div>

        <div style={styles.searchBox}>
          <input
            style={styles.searchInput}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search client groups..."
            autoFocus
          />
        </div>

        {loading && <p style={styles.loading}>Loading client groups...</p>}

        {!loading && filteredGroups.length === 0 && (
          <p style={styles.empty}>
            {query ? `No groups matching "${query}"` : 'No client groups found'}
          </p>
        )}

        <div style={styles.list}>
          {filteredGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => onSelect(group)}
              style={styles.groupItem}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#f0f9ff';
                (e.target as HTMLElement).style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#ffffff';
                (e.target as HTMLElement).style.borderColor = '#e5e7eb';
              }}
            >
              <div style={styles.groupName}>{group.name}</div>
              <div style={styles.groupMeta}>
                ID: {group.id.substring(0, 8)}...
                {group.taxable && <span style={styles.badge}>Taxable</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    background: '#ffffff',
    borderRadius: 12,
    padding: 32,
    maxWidth: 600,
    width: '100%',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: 13,
    cursor: 'pointer',
    padding: 0,
    marginBottom: 8,
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: '#1f2937',
  },
  subtitle: {
    margin: '6px 0 0',
    fontSize: 14,
    color: '#6b7280',
  },
  searchBox: {
    marginBottom: 16,
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 15,
    color: '#1f2937',
    outline: 'none',
    boxSizing: 'border-box',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxHeight: 400,
    overflowY: 'auto',
  },
  groupItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s',
    width: '100%',
  },
  groupName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1f2937',
  },
  groupMeta: {
    fontSize: 12,
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    background: '#dbeafe',
    color: '#2563eb',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 600,
  },
  loading: {
    textAlign: 'center',
    color: '#6b7280',
    padding: 40,
  },
  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: 40,
  },
};
