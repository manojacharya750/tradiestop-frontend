import React, { useMemo, useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Invoice, Role, PaymentStatus } from '../types';
import Spinner from '../components/Spinner';
import NotFoundPage from './NotFoundPage';
import { DocumentTextIcon, CheckCircleIcon } from '../components/icons';

interface PageProps {
  invoiceId: string;
}

const InvoicePreviewPage: React.FC<PageProps> = ({ invoiceId }) => {
    const { data, isLoading, markInvoiceAsPaid } = useData();
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [isPaying, setIsPaying] = useState(false);

    const invoice = useMemo(() => data.invoices.find(inv => inv.id === invoiceId), [invoiceId, data.invoices]);

    const handleMarkAsPaid = async () => {
        if (!invoice) return;
        setIsPaying(true);
        try {
            await markInvoiceAsPaid(invoice.id);
            addToast('Invoice marked as paid!', 'success');
        } catch (err) {
            addToast('Failed to mark invoice as paid.', 'error');
        } finally {
            setIsPaying(false);
        }
    };

    if (isLoading && !invoice) {
        return <div className="p-8 bg-white rounded-lg flex justify-center"><Spinner size="lg" /></div>;
    }

    if (!invoice) {
        return <NotFoundPage />;
    }
    
    const themeColors = {
        default: { bg: 'bg-slate-700', text: 'text-slate-700', border: 'border-slate-700' },
        electrician: { bg: 'bg-yellow-500', text: 'text-blue-800', border: 'border-blue-800' },
        plumber: { bg: 'bg-cyan-500', text: 'text-teal-800', border: 'border-teal-800' },
    }['default'];

    return (
        <>
        <div className="p-4 sm:p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto" id="invoice-to-print">
            <header className="flex justify-between items-start pb-6 border-b-2" style={{ borderColor: themeColors.bg.slice(3, -4)}}>
                <div>
                    {invoice.tradie.companyDetails.logoUrl && 
                        <img src={invoice.tradie.companyDetails.logoUrl} alt={`${invoice.tradie.companyDetails.name} Logo`} className="h-16 w-auto mb-4"/>
                    }
                    <h1 className="text-xl font-bold text-slate-800">{invoice.tradie.companyDetails.name}</h1>
                    <p className="text-sm text-slate-500">{invoice.tradie.companyDetails.address}</p>
                    <p className="text-sm text-slate-500">{invoice.tradie.companyDetails.email} | {invoice.tradie.companyDetails.phone}</p>
                    <p className="text-sm text-slate-500">{invoice.tradie.companyDetails.taxId}</p>
                </div>
                <div className="text-right">
                    <h2 className={`text-4xl font-bold uppercase ${themeColors.text}`}>Invoice</h2>
                    <p className="text-lg text-slate-600 mt-2">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-slate-500">Issued: {invoice.issueDate}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-8">
                <div>
                    <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider">Bill To</h3>
                    <p className="font-bold text-slate-800 mt-2">{invoice.client.name}</p>
                    <p className="text-sm text-slate-600">{invoice.client.address}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider">Payment Due</h3>
                    <p className="font-bold text-2xl text-slate-800 mt-2">${invoice.total.toFixed(2)}</p>
                    <p className="text-sm text-slate-600">Due on {invoice.dueDate}</p>
                </div>
            </section>

            <section>
                <table className="w-full text-left">
                    <thead>
                        <tr className={`${themeColors.bg} text-white text-sm`}>
                            <th className="p-3 font-semibold">Description</th>
                            <th className="p-3 font-semibold text-center w-24">QTY</th>
                            <th className="p-3 font-semibold text-right w-32">Unit Price</th>
                            <th className="p-3 font-semibold text-right w-32">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                    {invoice.items.map(item => (
                        <tr key={item.id} className="border-b border-slate-100">
                            <td className="p-3 text-slate-700">{item.description}</td>
                            <td className="p-3 text-slate-700 text-center">{item.quantity}</td>
                            <td className="p-3 text-slate-700 text-right">${item.unitPrice.toFixed(2)}</td>
                            <td className="p-3 text-slate-700 text-right font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>

            <section className="grid grid-cols-2 mt-8">
                <div className="text-sm text-slate-600">
                    <h4 className="font-semibold text-slate-800">Notes</h4>
                    <p>{invoice.notes}</p>
                </div>
                <div className="text-right space-y-2">
                    <p className="flex justify-between">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-medium text-slate-800">${invoice.subtotal.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="text-slate-600">Tax (10%):</span>
                        <span className="font-medium text-slate-800">${invoice.tax.toFixed(2)}</span>
                    </p>
                    <p className={`flex justify-between font-bold text-xl py-2 border-t-2 ${themeColors.border}`}>
                        <span className={`${themeColors.text}`}>Amount Due:</span>
                        <span className={`${themeColors.text}`}>${invoice.total.toFixed(2)}</span>
                    </p>
                </div>
            </section>
        </div>
        <div className="mt-8 text-center no-print">
            <button onClick={() => window.print()} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto">
                <DocumentTextIcon className="h-5 w-5"/> Print / Save as PDF
            </button>
            {currentUser?.role === Role.CLIENT && (invoice.status === PaymentStatus.PENDING || invoice.status === PaymentStatus.OVERDUE) && (
                <div className="mt-4">
                    <button
                        onClick={handleMarkAsPaid}
                        disabled={isPaying}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                        {isPaying ? <Spinner size="sm" /> : <CheckCircleIcon className="h-5 w-5" />}
                        {isPaying ? 'Processing...' : 'Mark as Paid'}
                    </button>
                </div>
            )}
        </div>
        </>
    );
};

export default InvoicePreviewPage;