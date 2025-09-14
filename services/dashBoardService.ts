import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { InvoiceData, ShopDetails } from '../types/invoice';

export async function getDashboardData(userId: string) {
  // Get shops
  const shopsCol = collection(db, 'users', userId, 'shops');
  const shopsSnap = await getDocs(shopsCol);
  const shops = shopsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as ShopDetails), createdAt: (doc.data() as any).createdAt }));
  const totalShops = shops.length;

  // Get invoices
  const invoicesCol = collection(db, 'users', userId, 'invoices');
  const invoicesSnap = await getDocs(invoicesCol);
  const invoices = invoicesSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as InvoiceData) }));
  const totalInvoices = invoices.length;

  // Recent activities (last 5 invoices and shops)
  const recentInvoices = invoices
    .filter(inv => inv.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  const recentShops = shops
    .filter(shop => shop.createdAt)
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 5);

  // Total revenue for current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  let totalRevenue = 0;
  invoices.forEach(inv => {
    if (inv.date) {
      const invDate = new Date(inv.date);
      if (invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear) {
        totalRevenue += inv.totals?.grandTotal || 0;
      }
    }
  });

  return {
    totalShops,
    totalInvoices,
    recentActivities: {
      invoices: recentInvoices,
      shops: recentShops,
    },
    totalRevenue,
  };
}