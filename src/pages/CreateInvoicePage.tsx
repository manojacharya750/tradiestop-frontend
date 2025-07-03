import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Booking, CompanyDetails, InvoiceItem } from '../types';
import Spinner from '../components/Spinner';
import { XMarkIcon, PencilSquareIcon } from '../components/icons';

interface PageProps {
  bookingId: string;
  onNavigate: (page: string, params: object) => void;
}

const THEME_COLORS = [
    { name: 'Slate', value: '#334155' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Rose', value: '#e11d48' },
];

const ColorPicker: React.FC<{selectedColor: string, onSelect: (color: string) => void}> = ({ selectedColor, onSelect }) => (
    <div className="flex flex-wrap gap-2">
        {THEME_COLORS.map(color => (
            <button key={color.name} type="button" onClick={() => onSelect(color.value)} className="flex items-center gap-2 p-2 rounded-md border-2" style={{ borderColor: selectedColor === color.value ? color.value : 'transparent' }}>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color.value }}></div>
                <span className="text-sm">{color.name}</span>
            </button>
        ))}
    </div>
);

const CreateInvoicePage: React.FC<PageProps> = ({ bookingId, onNavigate }) => {
    const { data, createInvoice } = useData();
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    
    const [isLoading, setIsLoading] = useState(false);

    // Invoice Data State
    const [booking, setBooking] = useState<Booking | null>(null);
    const [items, setItems] = useState<Omit<InvoiceItem, 'id'>[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
    const [notes, setNotes] = useState('Thank you for your business!');
    const [clientName, setClientName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [taxRate, setTaxRate] = useState(10);
    const [themeColor, setThemeColor] = useState('#334155');
    const [footerNotes, setFooterNotes] = useState('Payment is due within 15 days.');
    const [logoUrl, setLogoUrl] = useState('');

    useEffect(() => {
        const foundBooking = data.bookings.find(b => b.id === bookingId);
        if (foundBooking) {
            setBooking(foundBooking);
            setItems([{ description: foundBooking.details, quantity: 1, unitPrice: 0 }]);
            setClientName(foundBooking.clientName);
        }
        
        const tradieProfile = data.tradies.find(t => t.id === currentUser?.id);
        if (tradieProfile) {
            setLogoUrl(tradieProfile.companyDetails.logoUrl);
        }

        setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
    }, [bookingId, data.bookings, data.tradies, currentUser]);

    const handleItemChange = (index: number, field: keyof Omit<InvoiceItem, 'id'>, value: string | number) => {
        const newItems = [...items];
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        newItems[index] = { ...newItems[index], [field]: field === 'description' ? value : (isNaN(numValue) ? 0 : numValue) };
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const totals = useMemo(() => {
        const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;
        return { subtotal, tax: taxAmount, total };
    }, [items, taxRate]);
    
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // Adjust for timezone
        return adjustedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newInvoice = await createInvoice({
                bookingId,
                items,
                notes,
                clientName,
                clientAddress,
                invoiceNumber,
                issueDate: formatDate(issueDate),
                dueDate: formatDate(dueDate),
                taxRate,
                themeColor,
                footerNotes,
                logoUrl,
            });
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

    if (!booking) return <div className="flex justify-center pt-16"><Spinner size="lg" /></div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Create Invoice</h1>
                <p className="text-slate-500 mt-1">For job with <span className="font-semibold">{booking.clientName}</span> on <span className="font-semibold">{booking.serviceDate}</span></p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client & Invoice Details */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-slate-700">Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-base font-medium text-slate-600">Bill To</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Client Name</label>
                                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Client Address</label>
                                <input type="text" value={clientAddress} onChange={e => setClientAddress(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="e.g., 123 Main St, Anytown" required />
                            </div>
                        </div>
                         <div className="space-y-4">
                            <h3 className="text-base font-medium text-slate-600">Invoice Info</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Invoice Number</label>
                                <input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md" required />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Issue Date</label>
                                    <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Due Date</label>
                                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md" required />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-slate-700">Invoice Items</h2>
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 items-center">
                                <input type="text" placeholder="Item description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="col-span-12 md:col-span-6 p-2 border border-slate-300 rounded-md" required />
                                <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="col-span-4 md:col-span-2 p-2 border border-slate-300 rounded-md" required min="0" />
                                <input type="number" placeholder="Price" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="col-span-4 md:col-span-2 p-2 border border-slate-300 rounded-md" required min="0" step="0.01" />
                                <div className="col-span-3 md:col-span-1 text-right font-medium text-slate-600">${(item.quantity * item.unitPrice).toFixed(2)}</div>
                                <button type="button" onClick={() => removeItem(index)} className="col-span-1 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 flex justify-center items-center">
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addItem} className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">Add Item</button>
                </div>
                
                {/* Notes, Tax, and Totals */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Notes / Payment Terms</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="e.g., Payment terms, thank you message"></textarea>
                        </div>
                        <div className="space-y-2">
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Tax Rate (%)</label>
                                <input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="mt-1 w-full md:w-1/2 p-2 border border-slate-300 rounded-md" required min="0" />
                            </div>
                            <div className="space-y-2 pt-2 flex flex-col items-end">
                                <div className="flex justify-between w-full max-w-xs">
                                    <span className="text-slate-600">Subtotal:</span>
                                    <span className="font-semibold text-slate-800">${totals.subtotal.toFixed(2)}</span>
                                </div>
                                 <div className="flex justify-between w-full max-w-xs">
                                    <span className="text-slate-600">Tax ({taxRate}%):</span>
                                    <span className="font-semibold text-slate-800">${totals.tax.toFixed(2)}</span>
                                </div>
                                 <div className="flex justify-between w-full max-w-xs text-xl pt-2 border-t border-slate-300">
                                    <span className="font-bold text-slate-900">Total:</span>
                                    <span className="font-bold text-slate-900">${totals.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Customization */}
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                    <h2 className="text-xl font-semibold text-slate-700">Customization</h2>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Theme Color</label>
                        <ColorPicker selectedColor={themeColor} onSelect={setThemeColor} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Logo URL (Overrides default)</label>
                        <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="https://example.com/logo.png" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Footer Notes</label>
                        <textarea value={footerNotes} onChange={e => setFooterNotes(e.target.value)} rows={2} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="e.g., Bank details, final message"></textarea>
                    </div>
                </div>

                 <div className="mt-6 flex justify-end">
                    <button type="submit" disabled={isLoading} className="flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                       {isLoading ? <Spinner size="sm" className="mr-2"/> : <PencilSquareIcon className="h-5 w-5 mr-2" />}
                       {isLoading ? 'Generating...' : 'Generate & Preview Invoice'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateInvoicePage;
