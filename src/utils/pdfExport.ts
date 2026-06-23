export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Pop-up blocked. Allow pop-ups to download PDF.');
  }

  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n');
      } catch {
        return '';
      }
    })
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          ${styles}
          body { margin: 0; padding: 20px; background: white; }
          @media print {
            body { padding: 0; }
            @page { margin: 12mm; }
          }
        </style>
      </head>
      <body>${element.outerHTML}</body>
    </html>
  `);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
}
