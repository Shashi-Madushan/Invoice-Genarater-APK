import * as Sharing from 'expo-sharing';
// @ts-ignore
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { InvoiceData } from '../types/invoice';

export async function generateInvoicePDF(data: InvoiceData) {
  // Simple HTML template for PDF
  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        </style>
      </head>
      <body>
        <h1>Invoice</h1>
        <p><strong>Store Name:</strong> ${data.storeName}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <h2>Shop Details</h2>
        <p>Name: ${data.shopDetails?.name}<br />Address: ${data.shopDetails?.address}<br />Phone: ${data.shopDetails?.phone}<br />Email: ${data.shopDetails?.email}</p>
        <h2>Customer Details</h2>
        <p>Name: ${data.customerDetails?.name}<br />Address: ${data.customerDetails?.address}<br />Phone: ${data.customerDetails?.phone}<br />Email: ${data.customerDetails?.email}</p>
        <table>
          <tr><th>Item</th><th>Qty</th><th>Price</th><th>Discount</th><th>Amount</th></tr>
          ${data.items.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price}</td><td>$${item.discount || 0}</td><td>$${item.price * item.quantity - (item.discount || 0)}</td></tr>`).join('')}
        </table>
        <p><strong>Subtotal:</strong> $${data.totals.subtotal}<br />
        <strong>Discount:</strong> $${data.totals.discount}<br />
        <strong>Grand Total:</strong> $${data.totals.grandTotal}</p>
      </body>
    </html>
  `;

  try {
    const options = {
      html,
      fileName: `Invoice_${Date.now()}`,
      base64: false,
    };
    const pdf = await RNHTMLtoPDF.convert(options);
    if (pdf.filePath) {
      await Sharing.shareAsync(pdf.filePath);
    }
  } catch (err) {
    console.error('PDF generation error:', err);
  }
}
