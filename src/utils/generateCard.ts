import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadCardImage = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  try {
    const canvas = await html2canvas(element, {
      scale: 3, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: null
    });
    
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${fileName}.png`;
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
  }
};

export const downloadCardPDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF (landscape, mm, standard CR80 credit card size is roughly 85.6 x 53.98)
    // We'll use a proportional size
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 54);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
