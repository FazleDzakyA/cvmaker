export async function downloadCVPdf(elementId: string, filename: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    return false;
  }

  try {
    const { toPng } = await import('html-to-image');
    const { jsPDF } = await import('jspdf');

    // Render using native browser SVG foreignObject (supports modern Tailwind v4 oklab/lab colors seamlessly!)
    const imgData = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });

    const img = new Image();
    img.src = imgData;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210;
    const pageHeight = 297;
    const imgHeight = (img.height * pdfWidth) / img.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const cleanFilename = filename.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'cvgenie_resume';
    pdf.save(`${cleanFilename}.pdf`);
    return true;
  } catch (error) {
    console.warn('html-to-image export encountered error, triggering vector print dialog:', error);
    // Fallback to window.print()
    window.print();
    return false;
  }
}

export function triggerPrintDialog(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
