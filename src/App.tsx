import { useState, useEffect, useCallback } from 'react';
import type { ODataConfig, ClientGroup, Client } from './types';
import { ODataClient } from './services/odataClient';
import { demoClientGroups, demoClients } from './services/demoData';
import { ConnectionSettings } from './components/ConnectionSettings';
import { GroupSearch } from './components/GroupSearch';
import { StructureDiagram } from './components/StructureDiagram';

type AppView = 'settings' | 'search' | 'diagram';

function App() {
  const [view, setView] = useState<AppView>('settings');
  const [config, setConfig] = useState<ODataConfig | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [odataClient, setOdataClient] = useState<ODataClient | null>(null);

  const [groups, setGroups] = useState<ClientGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ClientGroup | null>(null);
  const [groupClients, setGroupClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('odataConfig');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSaveConfig = useCallback((newConfig: ODataConfig) => {
    setConfig(newConfig);
    setIsDemo(false);
    localStorage.setItem('odataConfig', JSON.stringify(newConfig));
    const client = new ODataClient(newConfig);
    setOdataClient(client);
    setView('search');
  }, []);

  const handleUseDemo = useCallback(() => {
    setIsDemo(true);
    setOdataClient(null);
    setConfig(null);
    setView('search');
  }, []);

  // Load groups when entering search view
  useEffect(() => {
    if (view !== 'search') return;

    const loadGroups = async () => {
      setGroupsLoading(true);
      setError(null);
      try {
        if (isDemo) {
          setGroups(demoClientGroups);
        } else if (odataClient) {
          const result = await odataClient.getClientGroups();
          setGroups(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load client groups');
      }
      setGroupsLoading(false);
    };

    loadGroups();
  }, [view, isDemo, odataClient]);

  const handleSelectGroup = useCallback(
    async (group: ClientGroup) => {
      setSelectedGroup(group);
      setClientsLoading(true);
      setError(null);

      try {
        let clients: Client[];
        if (isDemo) {
          clients = demoClients.filter((c) =>
            c.groups.some((g) => g.id === group.id)
          );
        } else if (odataClient) {
          clients = await odataClient.getClientsByGroup(group.id);
        } else {
          clients = [];
        }
        setGroupClients(clients);
        setView('diagram');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load clients');
      }

      setClientsLoading(false);
    },
    [isDemo, odataClient]
  );

  return (
    <div style={styles.app}>
      {error && (
        <div style={styles.errorBanner}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={styles.errorDismiss}>
            Dismiss
          </button>
        </div>
      )}

      {clientsLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner}>Loading clients...</div>
        </div>
      )}

      {view === 'settings' && (
        <ConnectionSettings
          config={config}
          onSave={handleSaveConfig}
          onUseDemo={handleUseDemo}
        />
      )}

      {view === 'search' && (
        <GroupSearch
          groups={groups}
          loading={groupsLoading}
          onSelect={handleSelectGroup}
          onBack={() => setView('settings')}
        />
      )}

      {view === 'diagram' && selectedGroup && (
        <StructureDiagram
          group={selectedGroup}
          clients={groupClients}
          onBack={() => setView('search')}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    minHeight: '100vh',
    background: '#f9fafb',
  },
  errorBanner: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: '#fef2f2',
    borderBottom: '1px solid #fecaca',
    color: '#991b1b',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 14,
  },
  errorDismiss: {
    background: 'none',
    border: '1px solid #fecaca',
    borderRadius: 4,
    color: '#991b1b',
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: 12,
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255,255,255,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingSpinner: {
    background: '#ffffff',
    padding: '20px 32px',
    borderRadius: 10,
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    fontSize: 15,
    color: '#374151',
    fontWeight: 600,
  },
};

export default App;
