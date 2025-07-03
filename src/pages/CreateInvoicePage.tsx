import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';
import { Booking, InvoiceItem } from '../types';
import Spinner from '../components/Spinner';
import { XMarkIcon, PencilSquareIcon } from '../components/icons';

interface PageProps {
  bookingId: string;
  onNavigate: (page: string, params: object) => void;
}

const CreateInvoicePage: React.FC<PageProps> = ({ bookingId, onNavigate }) => {
    const { data, createInvoice } = useData();
    const { addToast } = useToast();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [items, setItems] = useState<Omit<InvoiceItem, 'id'>[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
    const [notes, setNotes] = useState('Thank you for your business!');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const foundBooking = data.bookings.find(b => b.id === bookingId);
        if (foundBooking) {
            setBooking(foundBooking);
            // Pre-fill first item
            setItems([{ description: foundBooking.details, quantity: 1, unitPrice: 0 }]);
        }
    }, [bookingId, data.bookings]);

    const handleItemChange = (index: number, field: keyof Omit<InvoiceItem, 'id'>, value: string | number) => {
        const newItems = [...items];
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        newItems[index] = { ...newItems[index], [field]: field === 'description' ? value : (isNaN(numValue) ? 0 : numValue) };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const totals = useMemo(() => {
        const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        const tax = subtotal * 0.10; // 10% tax
        const total = subtotal + tax;
        return { subtotal, tax, total };
    }, [items]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newInvoice = await createInvoice(bookingId, items, notes);
            if (newInvoice) {
                addToast("Invoice created successfully!", "success");
                onNavigate('InvoicePreview', { invoiceId: newInvoice.id });
            } else {
                 throw new Error("Invoice creation returned null.");
            }
        } catch (err) {
            addToast("Failed to create invoice.", "error");
            setIsLoading(false);
        }
    };

    if (!booking) {
        return <div className="flex justify-center pt-16"><Spinner size="lg" /></div>;
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Create Invoice</h1>
                <p className="text-slate-500 mt-1">For job with <span className="font-semibold">{booking.clientName}</span> on <span className="font-semibold">{booking.serviceDate}</span></p>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-slate-700">Invoice Items</h2>
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 items-center">
                                <input type="text" placeholder="Item description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="col-span-6 p-2 border border-slate-300 rounded-md" required />
                                <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="col-span-2 p-2 border border-slate-300 rounded-md" required min="0" />
                                <input type="number" placeholder="Price" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="col-span-2 p-2 border border-slate-300 rounded-md" required min="0" step="0.01" />
                                <div className="col-span-1 text-right font-medium text-slate-600">${(item.quantity * item.unitPrice).toFixed(2)}</div>
                                <button type="button" onClick={() => removeItem(index)} className="col-span-1 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 flex justify-center items-center">
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addItem} className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">Add Item</button>

                    <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Notes</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="e.g., Payment terms, thank you message"></textarea>
                        </div>
                        <div className="space-y-2 flex flex-col items-end">
                            <div className="flex justify-between w-full max-w-xs">
                                <span className="text-slate-600">Subtotal:</span>
                                <span className="font-semibold text-slate-800">${totals.subtotal.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between w-full max-w-xs">
                                <span className="text-slate-600">Tax (10%):</span>
                                <span className="font-semibold text-slate-800">${totals.tax.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between w-full max-w-xs text-xl pt-2 border-t border-slate-300">
                                <span className="font-bold text-slate-900">Total:</span>
                                <span className="font-bold text-slate-900">${totals.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="mt-6 flex justify-end">
                    <button type="submit" disabled={isLoading} className="flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                       {isLoading ? <Spinner size="sm" className="mr-2"/> : <PencilSquareIcon className="h-5 w-5 mr-2" />}
                       {isLoading ? 'Generating...' : 'Generate Invoice'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateInvoicePage;