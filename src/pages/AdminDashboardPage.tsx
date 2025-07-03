import React, { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Role, SupportTicketStatus, ChartData } from '../types';
import { UsersIcon, CalendarDaysIcon, LifebuoyIcon, ShieldCheckIcon } from '../components/icons';
import Spinner from '../components/Spinner';
import BarChart from '../components/BarChart';

const classNames = <T,>(...classes: T[]) => classes.filter(Boolean).join(' ');

const getTicketStatusColor = (status: SupportTicketStatus) => {
    return status === SupportTicketStatus.OPEN ? 'text-green-700 bg-green-100' : 'text-slate-700 bg-slate-100';
}

const getRoleColor = (role: Role) => {
    switch (role) {
        case Role.ADMIN: return 'text-purple-700 bg-purple-100';
        case Role.TRADIE: return 'text-blue-700 bg-blue-100';
        case Role.CLIENT: return 'text-indigo-700 bg-indigo-100';
        default: return 'text-slate-700 bg-slate-100';
    }
}

const StatCard: React.FC<{title: string, value: string | number, icon: React.ReactNode}> = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-lg shadow-sm flex items-center justify-between">
        <div>
            <h3 className="text-base font-medium text-slate-500">{title}</h3>
            <p className="mt-1 text-3xl font-semibold text-slate-800">{value}</p>
        </div>
        <div className="flex-shrink-0 text-blue-500">
            {icon}
        </div>
    </div>
)

const AdminDashboardPage: React.FC = () => {
    const { data, isLoading } = useData();

    const totalClients = data.users.filter(u => u.role === Role.CLIENT).length;
    const totalTradies = data.users.filter(u => u.role === Role.TRADIE).length;
    const openTickets = data.supportTickets.filter(t => t.status === SupportTicketStatus.OPEN).length;
    
    const monthlyBookingsData: ChartData = useMemo(() => {
        // Mock data for demonstration
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const bookings = [25, 40, 32, 55, 60, 75];
        return { labels, data: bookings };
    }, []);
    
    const userGrowthData: ChartData = useMemo(() => {
        // Mock data for demonstration
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const users = [12, 18, 25, 30, 42, 50];
        return { labels, data: users };
    }, []);

    if (isLoading && !data.users.length) {
        return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    }

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-slate-500 mt-1">Platform overview and management tools.</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-200 px-3 py-1 rounded-full">
                <ShieldCheckIcon className="h-5 w-5 text-slate-500"/>
                <span>Admin View</span>
            </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Clients" value={totalClients} icon={<UsersIcon className="h-8 w-8"/>}/>
            <StatCard title="Total Tradies" value={totalTradies} icon={<UsersIcon className="h-8 w-8"/>}/>
            <StatCard title="Total Bookings" value={data.bookings.length} icon={<CalendarDaysIcon className="h-8 w-8"/>}/>
            <StatCard title="Open Tickets" value={openTickets} icon={<LifebuoyIcon className="h-8 w-8"/>}/>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Monthly Bookings</h2>
                <div style={{height: '250px'}}>
                    <BarChart data={monthlyBookingsData} />
                </div>
            </section>
            <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">User Growth</h2>
                <div style={{height: '250px'}}>
                    <BarChart data={userGrowthData} barColor="bg-green-500" />
                </div>
            </section>
        </div>

        <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Recent Support Tickets</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {data.supportTickets.slice(0, 5).map(ticket => (
                            <tr key={ticket.id}>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900">{ticket.userName}</div>
                                    <div className={classNames("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", getRoleColor(ticket.userRole))}>
                                        {ticket.userRole}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700 truncate max-w-xs">{ticket.subject}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={classNames("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", getTicketStatusColor(ticket.status))}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{ticket.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

    </div>
  );
};

export default AdminDashboardPage;