import PptxGenJS from 'pptxgenjs';
import type { Client } from '../types';
import { getColorForStructure, getShapeForStructure } from '../types';

/**
 * Exports the structure diagram to a PowerPoint file using pptxgenjs.
 * Creates shapes matching the diagram: squares for companies, triangles for trusts, etc.
 */
export async function exportToPowerPoint(
  clients: Client[],
  groupName: string
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches

  const slide = pptx.addSlide();

  // Title
  slide.addText(groupName, {
    x: 0.5,
    y: 0.2,
    w: 12,
    h: 0.6,
    fontSize: 24,
    fontFace: 'Arial',
    color: '1f2937',
    bold: true,
  });

  slide.addText('Structure Diagram', {
    x: 0.5,
    y: 0.7,
    w: 12,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    color: '6b7280',
  });

  // Categorize clients by type for layout
  const companies = clients.filter((c) => c.businessStructure === 'Company');
  const trusts = clients.filter((c) => c.businessStructure === 'Trust');
  const individuals = clients.filter((c) => c.businessStructure === 'Individual' || c.businessStructure === 'Sole Trader');
  const partnerships = clients.filter((c) => c.businessStructure === 'Partnership');
  const funds = clients.filter((c) => c.businessStructure === 'Fund');
  const others = clients.filter((c) => c.businessStructure === 'Other');

  // Layout rows: Individuals on top, then Companies/Trusts, then Partnerships/Funds/Others
  const rows: { label: string; clients: Client[] }[] = [
    { label: 'Individuals', clients: individuals },
    { label: 'Companies', clients: companies },
    { label: 'Trusts', clients: trusts },
    { label: 'Partnerships', clients: partnerships },
    { label: 'Funds', clients: funds },
    { label: 'Other', clients: others },
  ].filter((r) => r.clients.length > 0);

  let currentY = 1.3;

  rows.forEach((row) => {
    // Row label
    slide.addText(row.label, {
      x: 0.3,
      y: currentY,
      w: 2,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      color: '9ca3af',
      italic: true,
    });
    currentY += 0.35;

    const spacing = Math.min(2.5, 12 / Math.max(row.clients.length, 1));

    row.clients.forEach((client, idx) => {
      const x = 0.5 + idx * spacing;
      const color = getColorForStructure(client.businessStructure).replace('#', '');
      const shape = getShapeForStructure(client.businessStructure);

      // Draw shape
      if (shape === 'square') {
        slide.addShape(pptx.ShapeType.rect, {
          x,
          y: currentY,
          w: 2,
          h: 1,
          fill: { color: 'FFFFFF' },
          line: { color, width: 2 },
          rectRadius: 0.05,
        });
      } else if (shape === 'triangle') {
        slide.addShape(pptx.ShapeType.triangle, {
          x,
          y: currentY,
          w: 2,
          h: 1.2,
          fill: { color: 'FFFFFF' },
          line: { color, width: 2 },
        });
      } else if (shape === 'circle') {
        slide.addShape(pptx.ShapeType.ellipse, {
          x,
          y: currentY,
          w: 1.5,
          h: 1,
          fill: { color: 'FFFFFF' },
          line: { color, width: 2 },
        });
      } else if (shape === 'diamond') {
        slide.addShape(pptx.ShapeType.diamond, {
          x,
          y: currentY,
          w: 1.8,
          h: 1,
          fill: { color: 'FFFFFF' },
          line: { color, width: 2 },
        });
      } else if (shape === 'hexagon') {
        slide.addShape(pptx.ShapeType.hexagon, {
          x,
          y: currentY,
          w: 2,
          h: 1,
          fill: { color: 'FFFFFF' },
          line: { color, width: 2 },
        });
      }

      // Entity type label
      slide.addText(client.businessStructure.toUpperCase(), {
        x,
        y: currentY + 0.15,
        w: 2,
        h: 0.25,
        fontSize: 8,
        fontFace: 'Arial',
        color,
        bold: true,
        align: 'center',
      });

      // Entity name
      slide.addText(client.name, {
        x,
        y: currentY + 0.35,
        w: 2,
        h: 0.5,
        fontSize: 10,
        fontFace: 'Arial',
        color: '1f2937',
        bold: true,
        align: 'center',
        valign: 'middle',
      });
    });

    currentY += 1.5;
  });

  // Add relationship lines on a second slide if there are relationships
  const clientsWithRelationships = clients.filter((c) => c.relationships.length > 0);
  if (clientsWithRelationships.length > 0) {
    const relSlide = pptx.addSlide();
    relSlide.addText(`${groupName} — Relationships`, {
      x: 0.5,
      y: 0.2,
      w: 12,
      h: 0.6,
      fontSize: 24,
      fontFace: 'Arial',
      color: '1f2937',
      bold: true,
    });

    const clientIds = new Set(clients.map((c) => c.id));
    let relY = 1.0;

    clientsWithRelationships.forEach((client) => {
      const relevantRels = client.relationships.filter((r) => clientIds.has(r.relatedClientId));
      if (relevantRels.length === 0) return;

      relSlide.addText(client.name, {
        x: 0.5,
        y: relY,
        w: 4,
        h: 0.3,
        fontSize: 12,
        fontFace: 'Arial',
        color: getColorForStructure(client.businessStructure).replace('#', ''),
        bold: true,
      });
      relY += 0.35;

      relevantRels.forEach((rel) => {
        const sharesText = rel.shares ? ` (${rel.shares}%)` : '';
        relSlide.addText(`→ ${rel.relationshipType}${sharesText}: ${rel.relatedClientName}`, {
          x: 0.8,
          y: relY,
          w: 10,
          h: 0.25,
          fontSize: 10,
          fontFace: 'Arial',
          color: '4b5563',
        });
        relY += 0.3;
      });

      relY += 0.15;
    });
  }

  // Legend slide
  const legendSlide = pptx.addSlide();
  legendSlide.addText('Legend', {
    x: 0.5,
    y: 0.3,
    w: 12,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Arial',
    color: '1f2937',
    bold: true,
  });

  const legendItems: { shape: string; label: string; color: string }[] = [
    { shape: 'rect', label: 'Company', color: '3b82f6' },
    { shape: 'triangle', label: 'Trust', color: '8b5cf6' },
    { shape: 'ellipse', label: 'Individual', color: '10b981' },
    { shape: 'diamond', label: 'Partnership', color: 'ef4444' },
    { shape: 'hexagon', label: 'Fund', color: '06b6d4' },
  ];

  legendItems.forEach((item, idx) => {
    const y = 1.2 + idx * 0.9;
    const shapeType = item.shape === 'rect' ? pptx.ShapeType.rect
      : item.shape === 'triangle' ? pptx.ShapeType.triangle
      : item.shape === 'ellipse' ? pptx.ShapeType.ellipse
      : item.shape === 'diamond' ? pptx.ShapeType.diamond
      : pptx.ShapeType.hexagon;

    legendSlide.addShape(shapeType, {
      x: 1,
      y,
      w: 1,
      h: 0.7,
      fill: { color: 'FFFFFF' },
      line: { color: item.color, width: 2 },
    });

    legendSlide.addText(`= ${item.label}`, {
      x: 2.3,
      y,
      w: 4,
      h: 0.7,
      fontSize: 14,
      fontFace: 'Arial',
      color: item.color,
      bold: true,
      valign: 'middle',
    });
  });

  const fileName = `${groupName.replace(/[^a-zA-Z0-9]/g, '_')}_Structure.pptx`;
  await pptx.writeFile({ fileName });
}
