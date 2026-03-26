import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

export const loadPDF = async (filePath: string) => {
  try {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    const buffer = fs.readFileSync(absolutePath);
    const uint8Array = new Uint8Array(buffer);

    const pdfDoc = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    const totalPages = pdfDoc.numPages;
    const textPages: string[] = [];

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      textPages.push(pageText);
    }

    const text = textPages.join('\n\n');

    return {
      title: path.basename(filePath, '.pdf'),
      text,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
