import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Invoice } from '../types';
import Spinner from '../components/Spinner';
import NotFoundPage from './NotFoundPage';
import { DocumentTextIcon } from '../components/icons';

interface PageProps {
  invoiceId: string;
}

const InvoicePreviewPage: React.FC<PageProps> = ({ invoiceId }) => {
    const { data, isLoading } = useData();

    const invoice = useMemo(() => data.invoices.find(inv => inv.id === invoiceId), [invoiceId, data.invoices]);

    if (isLoading && !invoice) {
        return <div className="p-8 bg-white rounded-lg flex justify-center"><Spinner size="lg" /></div>;
    }

    if (!invoice) {
        return <NotFoundPage />;
    }
    
    const displayLogoUrl = invoice.logoDataUrl || invoice.tradie.companyDetails.logoUrl;

    return (
        <>
        <div className="relative isolate p-4 sm:p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden font-sans" id="invoice-to-print">
            {/* Watermark */}
            {displayLogoUrl && (
                <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
                    <img 
                        src={displayLogoUrl} 
                        alt="Watermark" 
                        className="w-2/3 h-2/3 object-contain opacity-5 transform -rotate-12" 
                    />
                </div>
            )}
            
            {/* Header with theme color */}
            <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: invoice.themeColor }}></div>

            <header className="flex justify-between items-start pt-8 pb-6 mb-8 border-b-2 border-slate-200">
                <div>
                    {displayLogoUrl && 
                        <img src={displayLogoUrl} alt={`${invoice.tradie.companyDetails.name} Logo`} className="h-16 w-auto mb-4 object-contain"/>
                    }
                    <h1 className="text-2xl font-bold text-slate-800">{invoice.tradie.companyDetails.name}</h1>
                    <p className="text-sm text-slate-500">{invoice.tradie.companyDetails.address}</p>
                    <p className="text-sm text-slate-500">{invoice.tradie.companyDetails.email} | {invoice.tradie.companyDetails.phone}</p>
                    {invoice.tradie.companyDetails.taxId && <p className="text-sm text-slate-500">Tax ID: {invoice.tradie.companyDetails.taxId}</p>}
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold uppercase tracking-widest" style={{ color: invoice.themeColor }}>Invoice</h2>
                    <p className="text-sm text-slate-600 mt-2 font-mono">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-slate-500 mt-2">Issued: {invoice.issueDate}</p>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Bill To</h3>
                    <p className="font-bold text-slate-800 mt-2">{invoice.client.name}</p>
                    <p className="text-sm text-slate-600">{invoice.client.address}</p>
                    {invoice.client.email && <p className="text-sm text-slate-600">{invoice.client.email}</p>}
                    {invoice.client.phone && <p className="text-sm text-slate-600">{invoice.client.phone}</p>}
                </div>
                {invoice.jobAddress && (
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Service Location</h3>
                    <p className="font-medium text-slate-800 mt-2">{invoice.jobAddress}</p>
                </div>
                )}
                <div className="md:col-span-1 text-left md:text-right bg-slate-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Payment Due</h3>
                    <p className="font-bold text-3xl mt-2" style={{ color: invoice.themeColor }}>${invoice.total.toFixed(2)}</p>
                    <p className="text-sm text-slate-600">Due on {invoice.dueDate}</p>
                </div>
            </section>

            <section>
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-white text-sm" style={{ backgroundColor: invoice.themeColor }}>
                            <th className="p-3 font-semibold rounded-tl-lg">Description</th>
                            <th className="p-3 font-semibold text-center w-24">QTY</th>
                            <th className="p-3 font-semibold text-right w-32">Unit Price</th>
                            <th className="p-3 font-semibold text-right w-32 rounded-tr-lg">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {invoice.items.map(item => (
                        <tr key={item.id}>
                            <td className="p-3 text-slate-700 font-medium">{item.description}</td>
                            <td className="p-3 text-slate-600 text-center">{item.quantity}</td>
                            <td className="p-3 text-slate-600 text-right">${item.unitPrice.toFixed(2)}</td>
                            <td className="p-3 text-slate-800 text-right font-semibold">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>

            <section className="grid grid-cols-2 mt-8 gap-8">
                <div className="text-sm text-slate-600">
                    <h4 className="font-semibold text-slate-800 mb-1">Notes</h4>
                    <p className="whitespace-pre-wrap">{invoice.notes}</p>
                </div>
                <div className="space-y-2">
                    <p className="flex justify-between">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-medium text-slate-800">${invoice.subtotal.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="text-slate-600">Tax ({invoice.taxRate}%):</span>
                        <span className="font-medium text-slate-800">${invoice.tax.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between font-bold text-xl py-2 border-t-2" style={{ borderColor: invoice.themeColor }}>
                        <span>Amount Due:</span>
                        <span>${invoice.total.toFixed(2)}</span>
                    </p>
                </div>
            </section>
            
            <footer className="mt-16 pt-8 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-8 items-end">
                    <div className="text-sm text-slate-600">
                       {invoice.footerNotes && <p>{invoice.footerNotes}</p>}
                    </div>
                    <div className="text-center">
                        {invoice.signatureDataUrl ? (
                            <img src={invoice.signatureDataUrl} alt="Signature" className="h-16 mx-auto object-contain" />
                        ) : (
                            <div className="h-16"></div>
                        )}
                        <div className="border-t border-slate-400 mt-2"></div>
                        <p className="mt-2 text-sm font-bold text-slate-800">{invoice.tradie.companyDetails.name}</p>
                    </div>
                </div>
            </footer>
        </div>
        <div className="mt-8 text-center no-print">
            <button onClick={() => window.print()} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto">
                <DocumentTextIcon className="h-5 w-5"/> Print / Save as PDF
            </button>
        </div>
        </>
    );
};

export default InvoicePreviewPage;
