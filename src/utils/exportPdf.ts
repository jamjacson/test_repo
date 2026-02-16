import { jsPDF } from 'jspdf';
import type { Client } from '../types';
import { getColorForStructure, getShapeForStructure } from '../types';

/**
 * Exports the structure diagram to PDF using jsPDF.
 * Renders shapes directly to the PDF canvas.
 */
export async function exportToPdf(
  clients: Client[],
  groupName: string
): Promise<void> {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();

  // Title
  pdf.setFontSize(22);
  pdf.setTextColor(31, 41, 55);
  pdf.text(groupName, 15, 18);

  pdf.setFontSize(12);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Structure Diagram', 15, 26);

  // Categorize clients
  const categories: { label: string; clients: Client[] }[] = [
    { label: 'Individuals', clients: clients.filter((c) => c.businessStructure === 'Individual' || c.businessStructure === 'Sole Trader') },
    { label: 'Companies', clients: clients.filter((c) => c.businessStructure === 'Company') },
    { label: 'Trusts', clients: clients.filter((c) => c.businessStructure === 'Trust') },
    { label: 'Partnerships', clients: clients.filter((c) => c.businessStructure === 'Partnership') },
    { label: 'Funds', clients: clients.filter((c) => c.businessStructure === 'Fund') },
    { label: 'Other', clients: clients.filter((c) => c.businessStructure === 'Other') },
  ].filter((r) => r.clients.length > 0);

  let currentY = 34;

  categories.forEach((category) => {
    // Check if we need a new page
    if (currentY > 170) {
      pdf.addPage();
      currentY = 15;
    }

    // Category label
    pdf.setFontSize(9);
    pdf.setTextColor(156, 163, 175);
    pdf.text(category.label, 15, currentY);
    currentY += 5;

    const spacing = Math.min(55, (pageWidth - 30) / Math.max(category.clients.length, 1));

    category.clients.forEach((client, idx) => {
      const x = 15 + idx * spacing;
      const color = hexToRgb(getColorForStructure(client.businessStructure));
      const shape = getShapeForStructure(client.businessStructure);

      pdf.setDrawColor(color.r, color.g, color.b);
      pdf.setLineWidth(0.8);
      pdf.setFillColor(255, 255, 255);

      if (shape === 'square') {
        pdf.rect(x, currentY, 45, 22, 'FD');
      } else if (shape === 'triangle') {
        pdf.triangle(
          x + 22.5, currentY,       // top
          x + 45, currentY + 25,    // bottom right
          x, currentY + 25,          // bottom left
          'FD'
        );
      } else if (shape === 'circle') {
        pdf.ellipse(x + 18, currentY + 11, 18, 11, 'FD');
      } else if (shape === 'diamond') {
        const cx = x + 22.5;
        const cy = currentY + 12;
        const hw = 22;
        const hh = 12;
        pdf.lines(
          [
            [hw, hh],
            [-hw, hh],
            [-hw, -hh],
            [hw, -hh],
          ],
          cx,
          cy - hh,
          [1, 1],
          'FD',
          true
        );
      } else if (shape === 'hexagon') {
        const cx = x + 22.5;
        const cy = currentY + 12;
        const r = 14;
        const points: [number, number][] = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 2;
          points.push([cx + r * 1.5 * Math.cos(angle), cy + r * Math.sin(angle)]);
        }
        // Draw hexagon as lines
        pdf.setFillColor(255, 255, 255);
        const lines: [number, number][] = [];
        for (let i = 1; i < points.length; i++) {
          lines.push([points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]]);
        }
        lines.push([points[0][0] - points[points.length - 1][0], points[0][1] - points[points.length - 1][1]]);
        pdf.lines(lines, points[0][0], points[0][1], [1, 1], 'FD', true);
      }

      // Entity type text
      pdf.setFontSize(6);
      pdf.setTextColor(color.r, color.g, color.b);
      const typeX = shape === 'triangle' ? x + 22.5 : x + (shape === 'circle' ? 18 : 22.5);
      const typeY = shape === 'triangle' ? currentY + 12 : currentY + 7;
      pdf.text(client.businessStructure.toUpperCase(), typeX, typeY, { align: 'center' });

      // Entity name
      pdf.setFontSize(8);
      pdf.setTextColor(31, 41, 55);
      const nameY = shape === 'triangle' ? currentY + 17 : currentY + 14;
      const maxWidth = shape === 'circle' ? 30 : 40;
      const lines = pdf.splitTextToSize(client.name, maxWidth);
      pdf.text(lines, typeX, nameY, { align: 'center' });
    });

    currentY += 32;
  });

  // Relationships page
  const clientIds = new Set(clients.map((c) => c.id));
  const clientsWithRels = clients.filter((c) =>
    c.relationships.some((r) => clientIds.has(r.relatedClientId))
  );

  if (clientsWithRels.length > 0) {
    pdf.addPage();
    pdf.setFontSize(18);
    pdf.setTextColor(31, 41, 55);
    pdf.text(`${groupName} — Relationships`, 15, 18);

    let relY = 28;

    clientsWithRels.forEach((client) => {
      if (relY > 180) {
        pdf.addPage();
        relY = 15;
      }

      const color = hexToRgb(getColorForStructure(client.businessStructure));
      pdf.setFontSize(11);
      pdf.setTextColor(color.r, color.g, color.b);
      pdf.text(client.name, 15, relY);
      relY += 5;

      client.relationships
        .filter((r) => clientIds.has(r.relatedClientId))
        .forEach((rel) => {
          if (relY > 185) {
            pdf.addPage();
            relY = 15;
          }
          const sharesText = rel.shares ? ` (${rel.shares}%)` : '';
          pdf.setFontSize(9);
          pdf.setTextColor(75, 85, 99);
          pdf.text(`→ ${rel.relationshipType}${sharesText}: ${rel.relatedClientName}`, 20, relY);
          relY += 5;
        });

      relY += 3;
    });
  }

  // Legend page
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.setTextColor(31, 41, 55);
  pdf.text('Legend', 15, 18);

  const legendItems = [
    { label: 'Company', shape: 'square' as const, color: '#3b82f6' },
    { label: 'Trust', shape: 'triangle' as const, color: '#8b5cf6' },
    { label: 'Individual', shape: 'circle' as const, color: '#10b981' },
    { label: 'Partnership', shape: 'diamond' as const, color: '#ef4444' },
    { label: 'Fund', shape: 'hexagon' as const, color: '#06b6d4' },
  ];

  legendItems.forEach((item, idx) => {
    const y = 28 + idx * 20;
    const color = hexToRgb(item.color);
    pdf.setDrawColor(color.r, color.g, color.b);
    pdf.setLineWidth(0.8);
    pdf.setFillColor(255, 255, 255);

    if (item.shape === 'square') {
      pdf.rect(15, y, 25, 12, 'FD');
    } else if (item.shape === 'triangle') {
      pdf.triangle(15 + 12.5, y, 15 + 25, y + 14, 15, y + 14, 'FD');
    } else if (item.shape === 'circle') {
      pdf.ellipse(15 + 12, y + 6, 12, 6, 'FD');
    } else if (item.shape === 'diamond') {
      pdf.lines(
        [[12, 7], [-12, 7], [-12, -7], [12, -7]],
        15 + 12,
        y,
        [1, 1],
        'FD',
        true
      );
    } else {
      pdf.rect(15, y, 25, 12, 'FD'); // fallback
    }

    pdf.setFontSize(12);
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.text(`= ${item.label}`, 48, y + 8);
  });

  const fileName = `${groupName.replace(/[^a-zA-Z0-9]/g, '_')}_Structure.pdf`;
  pdf.save(fileName);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}
