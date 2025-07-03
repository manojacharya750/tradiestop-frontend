import { Role, NavItem } from './types';
import { HomeIcon, CalendarDaysIcon, ChatBubbleLeftEllipsisIcon, CreditCardIcon, StarIcon, UsersIcon, WrenchScrewdriverIcon, ShieldCheckIcon, LifebuoyIcon, DocumentTextIcon, Cog6ToothIcon } from './components/icons';

// Navigation definitions
export const clientSidebarNavigation: NavItem[] = [
  { name: 'Dashboard', href: 'Dashboard', icon: HomeIcon },
  { name: 'Bookings', href: 'Bookings', icon: CalendarDaysIcon },
  { name: 'Messages', href: 'Messages', icon: ChatBubbleLeftEllipsisIcon },
  { name: 'Payments', href: 'Payments', icon: CreditCardIcon },
  { name: 'My Reviews', href: 'Reviews', icon: StarIcon },
  { name: 'Settings', href: 'Settings', icon: Cog6ToothIcon },
];

export const tradieSidebarNavigation: NavItem[] = [
  { name: 'Dashboard', href: 'Dashboard', icon: WrenchScrewdriverIcon },
  { name: 'Schedule', href: 'Bookings', icon: CalendarDaysIcon }, // Re-uses Bookings page
  { name: 'Messages', href: 'Messages', icon: ChatBubbleLeftEllipsisIcon },
  { name: 'Payments', href: 'Payments', icon: CreditCardIcon },
  { name: 'My Reviews', href: 'Reviews', icon: StarIcon },
  { name: 'Settings', href: 'Settings', icon: Cog6ToothIcon },
];

export const adminSidebarNavigation: NavItem[] = [
  { name: 'Dashboard', href: 'Dashboard', icon: ShieldCheckIcon },
  { name: 'Bookings', href: 'Bookings', icon: DocumentTextIcon },
  { name: 'Users', href: 'Users', icon: UsersIcon },
  { name: 'Support', href: 'Support', icon: LifebuoyIcon },
  { name: 'Settings', href: 'Settings', icon: Cog6ToothIcon },
];

export const tradieProfessions = [
    'Electrician',
    'Plumber',
    'Carpenter',
    'Painter',
    'Landscaper',
    'HVAC Technician',
    'Roofer',
    'Builder',
    'Handyman',
    'Cleaner',
];