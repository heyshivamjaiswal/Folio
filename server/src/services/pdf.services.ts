import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

export const loadPDF = async (buffer: Buffer, filename: string) => {
  try {
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

    return {
      title: filename.replace(/\.pdf$/i, ''),
      pages: textPages, // array, not joined — we need this for Step 1b (page-level metadata)
    };
  } catch (error) {
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};