import { useState } from 'react';
import type { ODataConfig } from '../types';

interface ConnectionSettingsProps {
  config: ODataConfig | null;
  onSave: (config: ODataConfig) => void;
  onUseDemo: () => void;
}

export function ConnectionSettings({ config, onSave, onUseDemo }: ConnectionSettingsProps) {
  const [serverUrl, setServerUrl] = useState(config?.serverUrl ?? 'https://nodata.odatalink.com');
  const [accountCode, setAccountCode] = useState(config?.accountCode ?? '');
  const [modelCode, setModelCode] = useState(config?.modelCode ?? '');
  const [dataFileCode, setDataFileCode] = useState(config?.dataFileCode ?? '');
  const [username, setUsername] = useState(config?.username ?? '');
  const [password, setPassword] = useState(config?.password ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      serverUrl,
      accountCode,
      modelCode,
      dataFileCode,
      username: username || undefined,
      password: password || undefined,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>ODataLink Connection</h2>
        <p style={styles.subtitle}>
          Connect to your Xero Practice Manager data via{' '}
          <a href="https://odatalink.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
            ODataLink
          </a>
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Server URL</label>
            <input
              style={styles.input}
              type="url"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="https://nodata.odatalink.com"
              required
            />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Account Code</label>
              <input
                style={styles.input}
                type="text"
                value={accountCode}
                onChange={(e) => setAccountCode(e.target.value)}
                placeholder="your-account-code"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Model Code</label>
              <input
                style={styles.input}
                type="text"
                value={modelCode}
                onChange={(e) => setModelCode(e.target.value)}
                placeholder="your-model-code"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Data File Code</label>
              <input
                style={styles.input}
                type="text"
                value={dataFileCode}
                onChange={(e) => setDataFileCode(e.target.value)}
                placeholder="your-data-file-code"
                required
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Username (optional)</label>
              <input
                style={styles.input}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Basic auth username"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password (optional)</label>
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Basic auth password"
              />
            </div>
          </div>

          <p style={styles.helpText}>
            Find your OData feed URL at{' '}
            <a href="https://odatalink.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
              odatalink.com
            </a>
            {' '}→ Models → your model's Feed URL.
            Format: https://server/account-code/model-code/data-file-code/
          </p>

          <div style={styles.actions}>
            <button type="submit" style={styles.primaryButton}>
              Connect
            </button>
            <button type="button" onClick={onUseDemo} style={styles.secondaryButton}>
              Use Demo Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: 24,
  },
  card: {
    background: '#ffffff',
    borderRadius: 12,
    padding: 32,
    maxWidth: 700,
    width: '100%',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: '#1f2937',
  },
  subtitle: {
    margin: '6px 0 24px',
    fontSize: 14,
    color: '#6b7280',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  row: {
    display: 'flex',
    gap: 12,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    fontSize: 14,
    color: '#1f2937',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  helpText: {
    fontSize: 12,
    color: '#9ca3af',
    margin: '4px 0',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
  actions: {
    display: 'flex',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    padding: '10px 24px',
    background: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '10px 24px',
    background: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
