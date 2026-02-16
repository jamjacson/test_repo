import type { Node, Edge } from '@xyflow/react';
import type { Client, EntityNodeData, RelationshipEdgeData } from '../types';
import { getShapeForStructure, getColorForStructure } from '../types';
import { layoutGraph } from './layoutGraph';

/**
 * Converts a list of clients (within a group) into ReactFlow nodes and edges,
 * then applies dagre layout for hierarchical positioning.
 */
export function buildDiagramFromClients(
  clients: Client[],
  direction: 'TB' | 'LR' = 'TB'
): { nodes: Node<EntityNodeData>[]; edges: Edge<RelationshipEdgeData>[] } {
  const clientMap = new Map(clients.map((c) => [c.id, c]));

  // Create nodes
  const nodes: Node<EntityNodeData>[] = clients.map((client) => ({
    id: client.id,
    type: 'entityNode',
    position: { x: 0, y: 0 }, // will be set by layout
    data: {
      label: client.name,
      entityType: client.businessStructure,
      shape: getShapeForStructure(client.businessStructure),
      client,
    },
  }));

  // Create edges from relationships
  // We create directed edges: source -> target with relationship label
  const edgeSet = new Set<string>();
  const edges: Edge<RelationshipEdgeData>[] = [];

  clients.forEach((client) => {
    client.relationships.forEach((rel) => {
      // Only create edge if the related client is in this group
      if (!clientMap.has(rel.relatedClientId)) return;

      // Determine direction based on relationship type:
      // "X Of" relationships mean this client has a role in the related entity
      // e.g., "Director Of" means client -> relatedClient
      const edgeId = `${client.id}-${rel.relatedClientId}-${rel.relationshipType}`;
      if (edgeSet.has(edgeId)) return;
      edgeSet.add(edgeId);

      const label = rel.shares
        ? `${rel.relationshipType} (${rel.shares}%)`
        : rel.relationshipType;

      edges.push({
        id: edgeId,
        source: client.id,
        target: rel.relatedClientId,
        type: 'smoothstep',
        animated: false,
        label,
        style: {
          stroke: getColorForStructure(client.businessStructure),
          strokeWidth: 2,
        },
        labelStyle: {
          fontSize: 11,
          fontWeight: 500,
          fill: '#374151',
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
        },
        labelBgPadding: [6, 4] as [number, number],
        data: {
          relationshipType: rel.relationshipType,
          shares: rel.shares,
        },
      });
    });
  });

  return layoutGraph(nodes, edges, direction) as {
    nodes: Node<EntityNodeData>[];
    edges: Edge<RelationshipEdgeData>[];
  };
}
