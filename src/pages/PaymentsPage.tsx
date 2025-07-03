import React, { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Invoice, PaymentStatus, Role } from '../types';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { CreditCardIcon, DocumentTextIcon } from '../components/icons';

interface PageProps {
  onNavigate: (page: string, params: object) => void;
}

const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
        case PaymentStatus.PAID: return 'text-green-700 bg-green-100';
        case PaymentStatus.PENDING: return 'text-yellow-700 bg-yellow-100';
        case PaymentStatus.OVERDUE: return 'text-red-700 bg-red-100';
        default: return 'text-slate-700 bg-slate-100';
    }
};

const InvoiceRow: React.FC<{ invoice: Invoice; role: Role; onNavigate: PageProps['onNavigate'] }> = ({ invoice, role, onNavigate }) => (
    <tr className="hover:bg-slate-50 transition-colors">
        <td className="p-4 whitespace-nowrap text-sm font-medium text-slate-900">{invoice.invoiceNumber}</td>
        <td className="p-4 whitespace-nowrap text-sm text-slate-500">
            {role === Role.CLIENT ? invoice.tradie.name : invoice.client.name}
        </td>
        <td className="p-4 whitespace-nowrap text-sm text-slate-500">{invoice.issueDate}</td>
        <td className="p-4 whitespace-nowrap text-sm font-semibold text-slate-800">${invoice.total.toFixed(2)}</td>
        <td className="p-4 whitespace-nowrap text-sm">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                {invoice.status}
            </span>
        </td>
        <td className="p-4 whitespace-nowrap text-right text-sm font-medium">
            <button onClick={() => onNavigate('InvoicePreview', { invoiceId: invoice.id })} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                <DocumentTextIcon className="h-4 w-4" />
                View Invoice
            </button>
        </td>
    </tr>
);

const PaymentsPage: React.FC<PageProps> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const { data, isLoading } = useData();

    const userInvoices = useMemo(() => {
        if (!currentUser) return [];
        switch (currentUser.role) {
            case Role.CLIENT: 
                return data.invoices.filter(p => p.client.id === currentUser.id);
            case Role.TRADIE: 
                return data.invoices.filter(p => p.tradie.id === currentUser.id);
            case Role.ADMIN:
                return data.invoices;
            default:
                return [];
        }
    }, [data.invoices, currentUser]);

    const { totalEarnings, pendingAmount } = useMemo(() => {
        if (currentUser?.role !== Role.TRADIE) return { totalEarnings: 0, pendingAmount: 0 };
        return userInvoices.reduce((acc, p) => {
            if (p.status === PaymentStatus.PAID) acc.totalEarnings += p.total;
            if (p.status === PaymentStatus.PENDING) acc.pendingAmount += p.total;
            return acc;
        }, { totalEarnings: 0, pendingAmount: 0 });
    }, [userInvoices, currentUser]);
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">{currentUser?.role === Role.TRADIE ? "Payments & Earnings" : "Payments"}</h1>
                <p className="text-slate-500 mt-1">Review your transaction history and manage invoices.</p>
            </div>
            
            {currentUser?.role === Role.TRADIE && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-base font-medium text-slate-500">Total Earnings (Paid)</h3>
                        <p className="mt-1 text-3xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-base font-medium text-slate-500">Pending Amount</h3>
                        <p className="mt-1 text-3xl font-bold text-slate-800">${pendingAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-base font-medium text-slate-500">Total Invoices</h3>
                        <p className="mt-1 text-3xl font-bold text-slate-800">{userInvoices.length}</p>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading && userInvoices.length === 0 ? (
                         <div className="flex justify-center p-16"><Spinner size="lg" /></div>
                    ) : userInvoices.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice #</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{currentUser?.role === Role.CLIENT ? 'Tradie' : 'Client'}</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="relative p-4"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {userInvoices.map(invoice => <InvoiceRow key={invoice.id} invoice={invoice} role={currentUser!.role} onNavigate={onNavigate}/>)}
                            </tbody>
                        </table>
                    ) : (
                         <EmptyState 
                            icon={<CreditCardIcon className="h-10 w-10"/>}
                            title="No Payments Found"
                            message="Your payment history will appear here."
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentsPage;