
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Bed as BedIcon, 
  Stethoscope, 
  Microscope, 
  UserPlus, 
  ClipboardList, 
  Pill, 
  CreditCard, 
  Users, 
  Package, 
  Menu,
  X,
  Search,
  Bell,
  Sparkles,
  ComputerIcon,
  Computer,
  Heart,
  Bot
} from 'lucide-react';

// Modules
import DashboardOverview from './modules/DashboardOverview';
import MasterCalendar from './modules/MasterCalendar';
import BedMap from './modules/BedMap';
import LiveQueue from './modules/LiveQueue';
import LabTracker from './modules/LabTracker';
import PatientRegistration from './modules/PatientRegistration';
import BillingAndClaims from './modules/BillingAndClaims';
import InventoryManagement from './modules/InventoryManagement';
import HumanResources from './modules/HumanResources';
import PharmacyManagement from './modules/PharmacyManagement';
import AIAssistant from './components/AIAssistant';
import XRayEnhancer from './modules/XRayEnhancer';
import AnalysisDisplay from './modules/AnalysisDisplay';
import Chatbot from './modules/chatbot';


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pim', label: 'Patient Registration', icon: UserPlus },
    { id: 'calendar', label: 'Scheduling', icon: Calendar },
    { id: 'opd', label: 'OPD Queue', icon: Stethoscope },
    { id: 'ipd', label: 'Bed Management', icon: BedIcon },
    { id: 'lab', label: 'Lab System (LIS)', icon: Microscope },
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
    { id: 'billing', label: 'Billing (RCM)', icon: CreditCard },
    { id: 'hr', label: 'HR & Roster', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'xray', label: 'X-Ray', icon: Computer },
    { id: 'ecg', label: 'ECG', icon: Heart },
    { id: 'chatbot', label: 'Chatbot', icon: Bot },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'pim': return <PatientRegistration />;
      case 'calendar': return <MasterCalendar />;
      case 'opd': return <LiveQueue />;
      case 'ipd': return <BedMap />;
      case 'lab': return <LabTracker />;
      case 'pharmacy': return <PharmacyManagement />;
      case 'billing': return <BillingAndClaims />;
      case 'inventory': return <InventoryManagement />;
      case 'hr': return <HumanResources />;
      case 'chatbot': return <Chatbot />;
      case 'xray': return <XRayEnhancer />;
      case 'ecg': return <AnalysisDisplay />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 relative overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white fixed lg:static inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 w-64 flex flex-col shadow-2xl`}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">M</div>
          <span className="text-xl font-bold tracking-tight">MedFlow ERP</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 scale-105' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsAIOpen(!isAIOpen)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl flex items-center gap-3 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Sparkles size={20} className="text-white relative z-10" />
            <div className="flex-1 text-left relative z-10">
              <p className="text-xs font-bold text-blue-100 uppercase tracking-widest">Clinical AI</p>
              <p className="text-sm font-bold text-white">Assistant Active</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-500 hover:text-slate-900">
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search patient, UHID, or report..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full w-80 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">General Ward A</p>
              <p className="text-xs text-slate-500">Live Status: <span className="text-emerald-500 font-bold uppercase text-[10px]">Optimal</span></p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* AI Sidebar */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};

export default App;
