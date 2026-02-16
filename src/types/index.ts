// Business structure types from Xero Practice Manager
export type BusinessStructure =
  | 'Company'
  | 'Trust'
  | 'Individual'
  | 'Partnership'
  | 'Sole Trader'
  | 'Fund'
  | 'Other';

// Relationship types in XPM
export type RelationshipType =
  | 'Director Of'
  | 'Shareholder Of'
  | 'Trustee Of'
  | 'Beneficiary Of'
  | 'Partner Of'
  | 'Member Of'
  | 'Secretary Of'
  | 'Appointer Of';

// Shape mapping for diagram
export type EntityShape = 'square' | 'triangle' | 'circle' | 'diamond' | 'hexagon';

export interface ClientGroup {
  id: string;
  name: string;
  taxable: boolean;
}

export interface ClientRelationship {
  relatedClientId: string;
  relatedClientName: string;
  relationshipType: RelationshipType;
  shares?: number;
}

export interface Client {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  businessStructure: BusinessStructure;
  groups: { id: string; name: string }[];
  relationships: ClientRelationship[];
  isArchived: boolean;
  isDeleted: boolean;
  accountManagerName?: string;
}

// Diagram node data
export interface EntityNodeData {
  label: string;
  entityType: BusinessStructure;
  shape: EntityShape;
  client: Client;
}

// Diagram edge data
export interface RelationshipEdgeData {
  relationshipType: RelationshipType;
  shares?: number;
}

// OData connection settings
export interface ODataConfig {
  serverUrl: string;
  accountCode: string;
  modelCode: string;
  dataFileCode: string;
  username?: string;
  password?: string;
}

// Map business structure to shape
export function getShapeForStructure(structure: BusinessStructure): EntityShape {
  switch (structure) {
    case 'Company':
      return 'square';
    case 'Trust':
      return 'triangle';
    case 'Individual':
    case 'Sole Trader':
      return 'circle';
    case 'Partnership':
      return 'diamond';
    case 'Fund':
      return 'hexagon';
    default:
      return 'circle';
  }
}

// Color mapping for entity types
export function getColorForStructure(structure: BusinessStructure): string {
  switch (structure) {
    case 'Company':
      return '#3b82f6'; // blue
    case 'Trust':
      return '#8b5cf6'; // purple
    case 'Individual':
      return '#10b981'; // green
    case 'Sole Trader':
      return '#f59e0b'; // amber
    case 'Partnership':
      return '#ef4444'; // red
    case 'Fund':
      return '#06b6d4'; // cyan
    default:
      return '#6b7280'; // gray
  }
}
