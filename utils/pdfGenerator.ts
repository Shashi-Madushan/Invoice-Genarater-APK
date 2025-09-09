import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { saveInvoice } from '../services/invoiceService';
import { InvoiceData } from '../types/invoice';

export async function generateInvoicePDF(data: InvoiceData, templateId?: string, userId?: string|null) {
  // Save invoice to Firestore first
  // console.log('User ID in PDF generator:', userId);
  if (userId) {
    try {
      await saveInvoice(userId, data);
    } catch (err) {
      console.error('Failed to save invoice before PDF:', err);
    }
  }

  // Use templateId to select layout
  let html = '';
  if (templateId === 'template_2') {
    html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; }
            h1 { text-align: center; }
            .header { display: flex; align-items: center; margin-bottom: 24px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 16px; }
            .col { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            .totals { margin-top: 20px; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            ${data.logoUrl ? `<img src="${data.logoUrl}" style="width:40px;height:40px;border-radius:8px;margin-right:10px;object-fit:cover;" />` : ''}
            <span style="font-size: 20px; font-weight: bold; flex: 1;">${data.storeName}</span>
          </div>
          <h1>INVOICE</h1>
          <div style="text-align:center; color:#6b7280; margin-bottom:16px;">Date: ${data.date}</div>
          <div class="row">
            <div class="col">
              <b>Shop Details</b><br />
              Name: ${data.shopDetails?.name}<br />
              Address: ${data.shopDetails?.address}<br />
              Phone: ${data.shopDetails?.phone}<br />
              Email: ${data.shopDetails?.email}
            </div>
            <div class="col">
              <b>Customer Details</b><br />
              Name: ${data.customerDetails?.name}<br />
              Address: ${data.customerDetails?.address}<br />
              Phone: ${data.customerDetails?.phone}<br />
              Email: ${data.customerDetails?.email}
            </div>
          </div>
          <table>
            <tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr>
            ${data.items.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price}</td><td>$${item.price * item.quantity - (item.discount || 0)}</td></tr>`).join('')}
          </table>
          <div class="totals">
            Subtotal: $${data.totals.subtotal}<br />
            Discount: $${data.totals.discount}<br />
            <b>Total Due: $${data.totals.grandTotal}</b>
          </div>
        </body>
      </html>
    `;
  } else {
    // Default to template_1 layout
    html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { text-align: center; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 16px; }
            .col { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            .totals { margin-top: 20px; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            ${data.logoUrl ? `<img src="${data.logoUrl}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;" />` : ''}
            <span style="font-size: 22px; font-weight: bold;">INVOICE</span>
            <span style="font-size: 12px; color: #6b7280;">No. 000001</span>
          </div>
          <div style="font-weight:bold; font-size:16px; margin-bottom:2px;">${data.storeName}</div>
          <div style="color:#374151; margin-bottom:8px;">Date: ${data.date}</div>
          <div class="row">
            <div class="col">
              <b>Shop Details</b><br />
              Name: ${data.shopDetails?.name}<br />
              Address: ${data.shopDetails?.address}<br />
              Phone: ${data.shopDetails?.phone}<br />
              Email: ${data.shopDetails?.email}
            </div>
            <div class="col">
              <b>Customer Details</b><br />
              Name: ${data.customerDetails?.name}<br />
              Address: ${data.customerDetails?.address}<br />
              Phone: ${data.customerDetails?.phone}<br />
              Email: ${data.customerDetails?.email}
            </div>
          </div>
          <table>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr>
            ${data.items.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price}</td><td>$${item.price * item.quantity - (item.discount || 0)}</td></tr>`).join('')}
          </table>
          <div class="totals">
            Subtotal: $${data.totals.subtotal}<br />
            Discount: $${data.totals.discount}<br />
            <b>Total: $${data.totals.grandTotal}</b>
          </div>
          <div style="margin-top:8px; color:#6b7280; font-size:12px;">Payment method: Cash</div>
          <div style="margin-top:4px; color:#6b7280; font-size:12px;">Note: Thank you for choosing us!</div>
        </body>
      </html>
    `;
  }

  try {
    const { uri } = await Print.printToFileAsync({ html, base64: false });
    if (uri) {
      await Sharing.shareAsync(uri);
    }
  } catch (err) {
    console.error('PDF generation error:', err);
  }
}
