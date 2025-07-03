import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './hooks/useAuth';

import LandingPage from './pages/LandingPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import BookingsPage from './pages/BookingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TradieDashboardPage from './pages/TradieDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MessagesPage from './pages/MessagesPage';
import PaymentsPage from './pages/PaymentsPage';
import ReviewsPage from './pages/ReviewsPage';
import UsersPage from './pages/UsersPage';
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';
import CreateInvoicePage from './pages/CreateInvoicePage';
import InvoicePreviewPage from './pages/InvoicePreviewPage';
import NotFoundPage from './pages/NotFoundPage';
import Spinner from './components/Spinner';
import NotificationsPanel from './components/NotificationsPanel';
import Footer from './components/Footer';

import { clientSidebarNavigation, tradieSidebarNavigation, adminSidebarNavigation } from './constants';
import { NavItem, User, Role } from './types';
import { BuildingStorefrontIcon, ChevronDoubleLeftIcon, Bars3Icon, ArrowLeftOnRectangleIcon, Cog6ToothIcon } from './components/icons';

const classNames = <T,>(...classes: T[]) => classes.filter(Boolean).join(' ');

type UnauthedView = 'landing' | 'login' | 'signup';

const App: React.FC = () => {
  const { currentUser, isLoading, logout } = useAuth();
  const [unauthedView, setUnauthedView] = useState<UnauthedView>('landing');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [page, setPage] = useState<{ name: string; params: Record<string, any> }>({ name: 'Dashboard', params: {} });

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
        const userMenuButton = document.getElementById('user-menu-button');
        if (isUserMenuOpen && userMenuButton && !userMenuButton.contains(event.target as Node)) {
             setUserMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isUserMenuOpen]);
  
  useEffect(() => {
    if (currentUser) {
        setPage({ name: 'Dashboard', params: {} });
        setUnauthedView('landing');
    }
  }, [currentUser]);

  const handleNavClick = (pageName: string, params: Record<string, any> = {}) => {
    setPage({ name: pageName, params });
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setUnauthedView('landing');
  }
  
  const { sidebarNavigation, headerNavigation } = useMemo(() => {
    if (!currentUser) return { sidebarNavigation: [], headerNavigation: [] };
    let nav: NavItem[] = [];
    switch (currentUser.role) {
        case Role.TRADIE: nav = tradieSidebarNavigation; break;
        case Role.ADMIN: nav = adminSidebarNavigation; break;
        case Role.CLIENT:
        default: nav = clientSidebarNavigation; break;
    }
    return {
        sidebarNavigation: nav,
        headerNavigation: nav.filter(i => i.name !== 'Settings').slice(0, 3).map(i => ({ name: i.name, href: i.href }))
    };
  }, [currentUser]);

  const renderPage = () => {
    if (!currentUser) return <NotFoundPage />;

    const pageMap: { [key: string]: React.ComponentType<any> } = {
        'Dashboard': {
            [Role.CLIENT]: ClientDashboardPage,
            [Role.TRADIE]: TradieDashboardPage,
            [Role.ADMIN]: AdminDashboardPage,
        }[currentUser.role],
        'Bookings': BookingsPage, 
        'Schedule': BookingsPage,
        'Messages': MessagesPage,
        'Payments': PaymentsPage,
        'Reviews': ReviewsPage, 
        'My Reviews': ReviewsPage,
        'Users': UsersPage,
        'Support': SupportPage,
        'Settings': SettingsPage,
        'CreateInvoice': CreateInvoicePage,
        'InvoicePreview': InvoicePreviewPage,
    };
    
    const PageComponent = pageMap[page.name];

    return PageComponent ? <PageComponent {...page.params} onNavigate={handleNavClick} /> : <NotFoundPage />;
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-100"><Spinner size="lg" /></div>;
  }

  if (!currentUser) {
      switch (unauthedView) {
        case 'login': return <LoginPage onSwitchToSignup={() => setUnauthedView('signup')} onBackToHome={() => setUnauthedView('landing')} />;
        case 'signup': return <SignupPage onSwitchToLogin={() => setUnauthedView('login')} onBackToHome={() => setUnauthedView('landing')} />;
        case 'landing':
        default:
          return <LandingPage onSignIn={() => setUnauthedView('login')} onSignUp={() => setUnauthedView('signup')} />;
      }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-40 no-print">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center md:hidden mr-4">
                <button type="button" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen}>
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-shrink-0 flex items-center text-blue-600">
                <BuildingStorefrontIcon className="h-8 w-8 mr-2 hidden sm:block" />
                <span className="font-bold text-2xl">TradieStop</span>
              </div>
              <nav className="hidden md:ml-16 md:flex md:space-x-8">
                {headerNavigation.map((item) => (
                  <button key={item.name} onClick={() => handleNavClick(item.href)} className={classNames( item.href === page.name ? 'border-blue-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300', 'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors' )} aria-current={item.href === page.name ? 'page' : undefined}>
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationsPanel onNavClick={handleNavClick} />
              <div className="relative">
                <div>
                  <button type="button" className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="user-menu-button" aria-expanded={isUserMenuOpen} aria-haspopup="true" onClick={() => setUserMenuOpen(!isUserMenuOpen)}>
                    <img className="h-8 w-8 rounded-full object-cover" src={currentUser.imageUrl} alt={currentUser.name} />
                  </button>
                </div>
                <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} transition={{ duration: 0.1 }} className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                    <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-slate-500">{currentUser.role}</p>
                    </div>
                    <button onClick={() => handleNavClick('Settings')} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                        <Cog6ToothIcon className="h-5 w-5 mr-2 text-slate-500"/>
                        Settings
                    </button>
                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                      <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 text-slate-500"/>
                      Sign out
                    </button>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <nav className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {sidebarNavigation.map((item) => (
                <button key={item.name} onClick={() => handleNavClick(item.href)} className={classNames( item.href === page.name ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800', 'group w-full flex items-center px-3 py-2 text-base font-medium rounded-md' )} aria-current={item.href === page.name ? 'page' : undefined}>
                  <item.icon className={classNames( item.href === page.name ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500', 'mr-3 flex-shrink-0 h-6 w-6' )} aria-hidden="true"/>
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={classNames( "bg-white border-r border-slate-200 hidden md:flex flex-col transition-all duration-300 ease-in-out no-print", isSidebarOpen ? "w-64" : "w-20" )}>
          <div className="flex-grow">
            <nav className="flex flex-col space-y-1 p-4">
              {sidebarNavigation.map((item) => (
                <button key={item.name} onClick={() => handleNavClick(item.href)} title={!isSidebarOpen ? item.name : undefined} className={classNames( item.href === page.name ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900', 'group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors', !isSidebarOpen && "justify-center" )} aria-current={item.href === page.name ? 'page' : undefined}>
                  <item.icon className={classNames( item.href === page.name ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500', 'flex-shrink-0 h-6 w-6', isSidebarOpen && "mr-3" )} aria-hidden="true"/>
                  {isSidebarOpen && <span>{item.name}</span>}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-slate-200">
             <button onClick={() => setSidebarOpen(!isSidebarOpen)} className={classNames( 'group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900', !isSidebarOpen && "justify-center" )} aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
              <ChevronDoubleLeftIcon className={classNames( "h-6 w-6 text-slate-400 group-hover:text-slate-500 transition-transform duration-300", !isSidebarOpen && "rotate-180" )}/>
              {isSidebarOpen && <span className="ml-3">Collapse</span>}
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
                 <motion.div key={page.name + (page.params.id || page.params.bookingId || page.params.invoiceId || '')} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    {renderPage()}
                </motion.div>
            </AnimatePresence>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;