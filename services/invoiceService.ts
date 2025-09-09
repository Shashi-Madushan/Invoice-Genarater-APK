import { db } from '@/firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import { InvoiceData } from '../types/invoice';

export async function saveInvoice(userId: string, invoice: InvoiceData) {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'invoices'), {
      ...invoice,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (err) {
    console.error('Error saving invoice:', err);
    throw err;
  }
}

export async function getInvoices(userId: string) {
  try {
    const invoicesCol = collection(db, 'users', userId, 'invoices');
    const snapshot = await getDocs(invoicesCol);
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (err) {
    console.error('Error fetching invoices:', err);
    throw err;
  }
}

export async function updateInvoice(userId: string, invoiceId: string, data: Partial<InvoiceData>) {
  try {
    const invoiceRef = doc(db, 'users', userId, 'invoices', invoiceId);
    await updateDoc(invoiceRef, data);
    return invoiceId;
  } catch (err) {
    console.error('Error updating invoice:', err);
    throw err;
  }
}

export async function deleteInvoice(userId: string, invoiceId: string) {
  try {
    const invoiceRef = doc(db, 'users', userId, 'invoices', invoiceId);
    await deleteDoc(invoiceRef);
    return invoiceId;
  } catch (err) {
    console.error('Error deleting invoice:', err);
    throw err;
  }
}
