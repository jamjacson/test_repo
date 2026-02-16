import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import type { Client, ClientGroup } from '../types';
import { getColorForStructure } from '../types';
import { EntityNode } from './EntityNode';
import { buildDiagramFromClients } from '../utils/buildDiagram';
import { exportToPowerPoint } from '../utils/exportPowerPoint';
import { exportToPdf } from '../utils/exportPdf';

interface StructureDiagramProps {
  group: ClientGroup;
  clients: Client[];
  onBack: () => void;
}

const nodeTypes = { entityNode: EntityNode };

export function StructureDiagram({ group, clients, onBack }: StructureDiagramProps) {
  const [direction, setDirection] = useState<'TB' | 'LR'>('TB');
  const [exporting, setExporting] = useState<string | null>(null);

  const { initialNodes, initialEdges } = useMemo(() => {
    const { nodes, edges } = buildDiagramFromClients(clients, direction);
    return { initialNodes: nodes, initialEdges: edges };
  }, [clients, direction]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Re-layout when direction changes
  const handleDirectionChange = useCallback(
    (newDirection: 'TB' | 'LR') => {
      setDirection(newDirection);
      const { nodes: newNodes, edges: newEdges } = buildDiagramFromClients(clients, newDirection);
      setNodes(newNodes);
      setEdges(newEdges);
    },
    [clients, setNodes, setEdges]
  );

  const handleExportPptx = useCallback(async () => {
    setExporting('pptx');
    try {
      await exportToPowerPoint(clients, group.name);
    } catch (err) {
      console.error('PowerPoint export failed:', err);
      alert('Export failed. See console for details.');
    }
    setExporting(null);
  }, [clients, group.name]);

  const handleExportPdf = useCallback(async () => {
    setExporting('pdf');
    try {
      await exportToPdf(clients, group.name);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Export failed. See console for details.');
    }
    setExporting(null);
  }, [clients, group.name]);

  // Stats
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    clients.forEach((c) => {
      counts[c.businessStructure] = (counts[c.businessStructure] || 0) + 1;
    });
    return counts;
  }, [clients]);

  return (
    <div style={styles.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as { entityType?: string };
            return data.entityType
              ? getColorForStructure(data.entityType as Client['businessStructure'])
              : '#6b7280';
          }}
          maskColor="rgba(255,255,255,0.7)"
          style={{ borderRadius: 8 }}
        />

        {/* Top panel: title and navigation */}
        <Panel position="top-left">
          <div style={styles.topPanel}>
            <button onClick={onBack} style={styles.backButton}>
              ← Back
            </button>
            <div>
              <h2 style={styles.title}>{group.name}</h2>
              <div style={styles.statsRow}>
                {Object.entries(stats).map(([type, count]) => (
                  <span key={type} style={styles.statBadge}>
                    {count} {type}{count > 1 ? 's' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        {/* Top right: controls */}
        <Panel position="top-right">
          <div style={styles.controlPanel}>
            <div style={styles.controlGroup}>
              <span style={styles.controlLabel}>Layout</span>
              <button
                style={{
                  ...styles.controlButton,
                  ...(direction === 'TB' ? styles.controlButtonActive : {}),
                }}
                onClick={() => handleDirectionChange('TB')}
              >
                Vertical
              </button>
              <button
                style={{
                  ...styles.controlButton,
                  ...(direction === 'LR' ? styles.controlButtonActive : {}),
                }}
                onClick={() => handleDirectionChange('LR')}
              >
                Horizontal
              </button>
            </div>

            <div style={styles.controlGroup}>
              <span style={styles.controlLabel}>Export</span>
              <button
                style={styles.exportButton}
                onClick={handleExportPptx}
                disabled={exporting !== null}
              >
                {exporting === 'pptx' ? 'Exporting...' : 'PowerPoint'}
              </button>
              <button
                style={styles.exportButton}
                onClick={handleExportPdf}
                disabled={exporting !== null}
              >
                {exporting === 'pdf' ? 'Exporting...' : 'PDF'}
              </button>
            </div>
          </div>
        </Panel>

        {/* Bottom: legend */}
        <Panel position="bottom-right">
          <div style={styles.legend}>
            <div style={styles.legendTitle}>Legend</div>
            <div style={styles.legendGrid}>
              {[
                { shape: 'square', label: 'Company', color: '#3b82f6' },
                { shape: 'triangle', label: 'Trust', color: '#8b5cf6' },
                { shape: 'circle', label: 'Individual', color: '#10b981' },
                { shape: 'diamond', label: 'Partnership', color: '#ef4444' },
                { shape: 'hexagon', label: 'Fund', color: '#06b6d4' },
              ].map((item) => (
                <div key={item.label} style={styles.legendItem}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    {item.shape === 'square' && (
                      <rect x="2" y="4" width="16" height="12" fill="white" stroke={item.color} strokeWidth="2" rx="1" />
                    )}
                    {item.shape === 'triangle' && (
                      <polygon points="10,2 18,18 2,18" fill="white" stroke={item.color} strokeWidth="2" />
                    )}
                    {item.shape === 'circle' && (
                      <ellipse cx="10" cy="10" rx="8" ry="8" fill="white" stroke={item.color} strokeWidth="2" />
                    )}
                    {item.shape === 'diamond' && (
                      <polygon points="10,2 18,10 10,18 2,10" fill="white" stroke={item.color} strokeWidth="2" />
                    )}
                    {item.shape === 'hexagon' && (
                      <polygon points="5,2 15,2 19,10 15,18 5,18 1,10" fill="white" stroke={item.color} strokeWidth="2" />
                    )}
                  </svg>
                  <span style={{ color: item.color, fontSize: 11, fontWeight: 600 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100vh',
  },
  topPanel: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: 'rgba(255,255,255,0.95)',
    padding: '10px 16px',
    borderRadius: 10,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  backButton: {
    background: 'none',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: 13,
    color: '#374151',
  },
  title: {
    margin: 0,
    fontSize: 17,
    fontWeight: 700,
    color: '#1f2937',
  },
  statsRow: {
    display: 'flex',
    gap: 6,
    marginTop: 4,
  },
  statBadge: {
    background: '#f3f4f6',
    color: '#6b7280',
    padding: '1px 6px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 600,
  },
  controlPanel: {
    display: 'flex',
    gap: 12,
    background: 'rgba(255,255,255,0.95)',
    padding: '10px 16px',
    borderRadius: 10,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  controlLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#9ca3af',
    marginRight: 2,
  },
  controlButton: {
    padding: '5px 10px',
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: 5,
    fontSize: 12,
    cursor: 'pointer',
    color: '#374151',
  },
  controlButtonActive: {
    background: '#3b82f6',
    color: '#ffffff',
    borderColor: '#3b82f6',
  },
  exportButton: {
    padding: '5px 10px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 5,
    fontSize: 12,
    cursor: 'pointer',
    color: '#166534',
    fontWeight: 600,
  },
  legend: {
    background: 'rgba(255,255,255,0.95)',
    padding: '8px 14px',
    borderRadius: 10,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#9ca3af',
    marginBottom: 4,
  },
  legendGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
};
