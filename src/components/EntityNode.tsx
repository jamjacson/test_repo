import { Handle, Position } from '@xyflow/react';
import type { EntityNodeData } from '../types';
import { getColorForStructure } from '../types';

interface EntityNodeProps {
  data: EntityNodeData;
  selected?: boolean;
}

function CompanyShape({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 180,
        minHeight: 80,
        background: '#ffffff',
        border: `3px solid ${color}`,
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {children}
    </div>
  );
}

function TrustShape({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width: 200, height: 120 }}>
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <polygon
          points="100,5 195,115 5,115"
          fill="#ffffff"
          stroke={color}
          strokeWidth="3"
        />
      </svg>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 30,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function IndividualShape({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 140,
        height: 140,
        background: '#ffffff',
        border: `3px solid ${color}`,
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {children}
    </div>
  );
}

function DiamondShape({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width: 150, height: 150 }}>
      <svg
        width="150"
        height="150"
        viewBox="0 0 150 150"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <polygon
          points="75,5 145,75 75,145 5,75"
          fill="#ffffff"
          stroke={color}
          strokeWidth="3"
        />
      </svg>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function HexagonShape({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width: 180, height: 100 }}>
      <svg
        width="180"
        height="100"
        viewBox="0 0 180 100"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <polygon
          points="30,5 150,5 175,50 150,95 30,95 5,50"
          fill="#ffffff"
          stroke={color}
          strokeWidth="3"
        />
      </svg>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function EntityNode({ data, selected }: EntityNodeProps) {
  const color = getColorForStructure(data.entityType);
  const shape = data.shape;

  const content = (
    <>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: color,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: 2,
        }}
      >
        {data.entityType}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#1f2937',
          textAlign: 'center',
          lineHeight: 1.2,
          wordBreak: 'break-word',
        }}
      >
        {data.label}
      </div>
    </>
  );

  const outline = selected ? '3px solid #2563eb' : 'none';

  const ShapeComponent = (() => {
    switch (shape) {
      case 'square':
        return CompanyShape;
      case 'triangle':
        return TrustShape;
      case 'circle':
        return IndividualShape;
      case 'diamond':
        return DiamondShape;
      case 'hexagon':
        return HexagonShape;
      default:
        return CompanyShape;
    }
  })();

  return (
    <div style={{ outline, outlineOffset: 4, borderRadius: shape === 'circle' ? '50%' : 8 }}>
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <ShapeComponent color={color}>{content}</ShapeComponent>
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  );
}
