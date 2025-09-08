export type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
  discount?: number; // optional
};

export type InvoiceTotals = {
  subtotal: number;
  discount: number;
  grandTotal: number;
};

export type CustomerDetails = {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
};

export type ShopDetails = {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
};

export type InvoiceData = {
  templateId: string;       // selected template
  storeName: string;
  logoUrl?: string;         // optional, URL to logo image
  date: string;             // ISO string or formatted date
  items: InvoiceItem[];     // dynamic list of items
  totals: InvoiceTotals;    // calculated totals
  customerDetails: CustomerDetails; // added customer details
  shopDetails: ShopDetails;         // added shop details
};
