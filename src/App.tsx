import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  ClipboardList, 
  PenTool as Tactical,
  Bell,
  Search,
  Plus,
  ChevronRight,
  TrendingUp,
  UserPlus,
  DollarSign,
  Clock,
  Menu,
  X,
  Star,
  Newspaper,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- Types ---
interface Student {
  id: number;
  name: string;
  category: string;
  birth_date: string;
  parent_name: string;
  parent_phone: string;
  status: string;
}

interface Payment {
  id: number;
  student_id: number;
  student_name: string;
  amount: number;
  due_date: string;
  status: string;
}

interface ClassSession {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  plan: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
}

interface Evaluation {
  id: number;
  student_id: number;
  student_name: string;
  date: string;
  passing: number;
  shooting: number;
  dribbling: number;
  vision: number;
  positioning: number;
  speed: number;
  endurance: number;
  comments: string;
}

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  date: string;
}

interface Equipment {
  id: number;
  name: string;
  total_quantity: number;
  available_quantity: number;
}

interface Loan {
  id: number;
  equipment_id: number;
  equipment_name: string;
  student_id: number;
  student_name: string;
  loan_date: string;
  expected_return_date: string;
  actual_return_date: string | null;
}

interface TacticalPlayer {
  id: number;
  number: string;
  x: number;
  y: number;
  color: string;
}

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-avai-blue text-white shadow-lg shadow-avai-blue/20' 
        : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, icon: Icon, trend, color }: { title: string, value: string | number, icon: any, trend?: string, color: string }) => (
  <div className="glass-card p-6 rounded-2xl flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${color} text-white`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="text-emerald-500 text-sm font-medium flex items-center gap-1">
          <TrendingUp size={14} /> {trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isAddEvaluationModalOpen, setIsAddEvaluationModalOpen] = useState(false);
  const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const [isAddNotificationModalOpen, setIsAddNotificationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas Categorias');
  const [statusFilter, setStatusFilter] = useState('Todos');
  
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  const [tacticalPlayers, setTacticalPlayers] = useState<TacticalPlayer[]>([
    { id: 1, number: '1', x: 5, y: 50, color: 'bg-avai-blue' },
    { id: 2, number: '2', x: 20, y: 20, color: 'bg-avai-blue' },
    { id: 3, number: '3', x: 20, y: 80, color: 'bg-avai-blue' },
    { id: 4, number: '4', x: 15, y: 40, color: 'bg-avai-blue' },
    { id: 5, number: '5', x: 15, y: 60, color: 'bg-avai-blue' },
    { id: 6, number: '6', x: 40, y: 50, color: 'bg-avai-blue' },
    { id: 7, number: '7', x: 60, y: 20, color: 'bg-avai-blue' },
    { id: 8, number: '8', x: 60, y: 80, color: 'bg-avai-blue' },
    { id: 9, number: '10', x: 55, y: 50, color: 'bg-avai-blue' },
    { id: 10, number: '9', x: 85, y: 40, color: 'bg-avai-blue' },
    { id: 11, number: '11', x: 85, y: 60, color: 'bg-avai-blue' },
  ]);

  const fieldRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sRes, pRes, cRes, nRes, eRes, newsRes, eqRes, lRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/payments'),
        fetch('/api/classes'),
        fetch('/api/notifications'),
        fetch('/api/evaluations'),
        fetch('/api/news'),
        fetch('/api/equipment'),
        fetch('/api/equipment/loans')
      ]);
      
      setStudents(await sRes.json());
      setPayments(await pRes.json());
      setClasses(await cRes.json());
      setNotifications(await nRes.json());
      setEvaluations(await eRes.json());
      setNews(await newsRes.json());
      setEquipment(await eqRes.json());
      setLoans(await lRes.json());
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const chartData = [
    { name: 'Sub-5', count: students.filter(s => s.category === 'Sub-5').length },
    { name: 'Sub-7', count: students.filter(s => s.category === 'Sub-7').length },
    { name: 'Sub-9', count: students.filter(s => s.category === 'Sub-9').length },
    { name: 'Sub-11', count: students.filter(s => s.category === 'Sub-11').length },
    { name: 'Sub-13', count: students.filter(s => s.category === 'Sub-13').length },
    { name: 'Sub-15', count: students.filter(s => s.category === 'Sub-15').length },
    { name: 'Sub-17', count: students.filter(s => s.category === 'Sub-17').length },
  ];

  const paymentData = [
    { name: 'Pagos', value: payments.filter(p => p.status === 'paid').length },
    { name: 'Pendentes', value: payments.filter(p => p.status === 'pending').length },
  ];

  const COLORS = ['#00468C', '#00AEEF', '#00C9FF', '#92FE9D', '#00DBDE', '#FC00FF', '#00DBDE'];

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.parent_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas Categorias' || s.category === categoryFilter;
    const matchesStatus = statusFilter === 'Todos' || 
                         (statusFilter === 'Ativo' && s.status === 'active') || 
                         (statusFilter === 'Inativo' && s.status === 'inactive');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      birth_date: formData.get('birth_date'),
      parent_name: formData.get('parent_name'),
      parent_phone: formData.get('parent_phone'),
    };

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsAddStudentModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  const handleAddClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      category: formData.get('category'),
      date: formData.get('date'),
      time: formData.get('time'),
      plan: formData.get('plan'),
    };
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsAddClassModalOpen(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleAddPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      student_id: formData.get('student_id'),
      amount: parseFloat(formData.get('amount') as string),
      due_date: formData.get('due_date'),
    };
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsAddPaymentModalOpen(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleAddEvaluation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      student_id: formData.get('student_id'),
      passing: parseInt(formData.get('passing') as string),
      shooting: parseInt(formData.get('shooting') as string),
      dribbling: parseInt(formData.get('dribbling') as string),
      vision: parseInt(formData.get('vision') as string),
      positioning: parseInt(formData.get('positioning') as string),
      speed: parseInt(formData.get('speed') as string),
      endurance: parseInt(formData.get('endurance') as string),
      comments: formData.get('comments'),
    };
    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsAddEvaluationModalOpen(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleAddNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      image_url: formData.get('image_url'),
    };
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsAddNewsModalOpen(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleAddEquipment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      total_quantity: parseInt(formData.get('total_quantity') as string),
    };
    try {
      const res = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsAddEquipmentModalOpen(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleAddNotification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      message: formData.get('message'),
    };
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsAddNotificationModalOpen(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed h-full z-50`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-avai-blue rounded-lg flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="font-display font-bold text-lg text-avai-blue">AVAÍ FC</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Base Profissional</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Users} label="Alunos" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
          <SidebarItem icon={Calendar} label="Calendário" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
          <SidebarItem icon={CreditCard} label="Pagamentos" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
          <SidebarItem icon={Star} label="Avaliações" active={activeTab === 'evaluations'} onClick={() => setActiveTab('evaluations')} />
          <SidebarItem icon={Newspaper} label="Notícias" active={activeTab === 'news'} onClick={() => setActiveTab('news')} />
          <SidebarItem icon={Package} label="Equipamentos" active={activeTab === 'equipment'} onClick={() => setActiveTab('equipment')} />
          <SidebarItem icon={ClipboardList} label="Plano de Aula" active={activeTab === 'plans'} onClick={() => setActiveTab('plans')} />
          <SidebarItem icon={Tactical} label="Prancheta Tática" active={activeTab === 'tactical'} onClick={() => setActiveTab('tactical')} />
          <SidebarItem icon={MessageSquare} label="Comunicação" active={activeTab === 'communication'} onClick={() => setActiveTab('communication')} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 text-slate-400"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 'dashboard' && 'Visão Geral'}
              {activeTab === 'students' && 'Gestão de Alunos'}
              {activeTab === 'calendar' && 'Calendário de Atividades'}
              {activeTab === 'payments' && 'Controle Financeiro'}
              {activeTab === 'evaluations' && 'Avaliação de Jogadores'}
              {activeTab === 'news' && 'Notícias e Eventos'}
              {activeTab === 'equipment' && 'Gestão de Equipamentos'}
              {activeTab === 'plans' && 'Metodologia e Treinos'}
              {activeTab === 'tactical' && 'Prancheta Tática'}
              {activeTab === 'communication' && 'Central de Notificações'}
            </h2>
            <p className="text-slate-500">Bem-vindo ao portal de gestão da base do Avaí Futebol Clube.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20 transition-all"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Coordenação Base</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Administrador</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-avai-light flex items-center justify-center text-white font-bold">
                CB
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Alunos" value={students.length} icon={Users} trend="+12% este mês" color="bg-avai-blue" />
                <StatCard title="Aulas Realizadas" value={classes.length} icon={Calendar} color="bg-avai-light" />
                <StatCard title="Receita Mensal" value="R$ 12.450" icon={DollarSign} trend="+5% vs anterior" color="bg-emerald-500" />
                <StatCard title="Pendências" value={payments.filter(p => p.status === 'pending').length} icon={Clock} color="bg-amber-500" />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-6">Distribuição por Categoria</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" fill="#00468C" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-6">Status de Pagamentos</h3>
                  <div className="h-[300px] flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {paymentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f59e0b'} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-sm text-slate-500">Pagos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm text-slate-500">Pendentes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Próximos Treinos</h3>
                    <button 
                      onClick={() => setActiveTab('calendar')}
                      className="text-avai-blue text-sm font-bold hover:underline"
                    >
                      Ver todos
                    </button>
                  </div>
                  <div className="space-y-4">
                    {classes.slice(0, 4).map((c) => (
                      <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-avai-blue/10 text-avai-blue flex flex-col items-center justify-center font-bold">
                          <span className="text-xs uppercase">{c.time.split(':')[0]}h</span>
                          <span className="text-[10px]">{c.time.split(':')[1]}m</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{c.title}</h4>
                          <p className="text-xs text-slate-500">{c.category} • Campo 1</p>
                        </div>
                        <ChevronRight className="text-slate-300" size={18} />
                      </div>
                    ))}
                    {classes.length === 0 && <p className="text-center py-8 text-slate-400">Nenhum treino agendado.</p>}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Últimas Notificações</h3>
                    <button 
                      onClick={() => setActiveTab('communication')}
                      className="text-avai-blue text-sm font-bold hover:underline"
                    >
                      Ver todas
                    </button>
                  </div>
                  <div className="space-y-4">
                    {notifications.slice(0, 4).map((n) => (
                      <div key={n.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <Bell size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2 font-medium">{new Date(n.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && <p className="text-center py-8 text-slate-400">Nenhuma notificação recente.</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'evaluations' && (
            <motion.div 
              key="evaluations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Histórico de Avaliações</h3>
                <button 
                  onClick={() => setIsAddEvaluationModalOpen(true)}
                  className="bg-avai-blue text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-avai-blue/20"
                >
                  <Star size={18} /> Nova Avaliação
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {evaluations.map((ev) => (
                  <div key={ev.id} className="glass-card p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-800">{ev.student_name}</h4>
                        <p className="text-xs text-slate-500">{new Date(ev.date).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-avai-blue/10 text-avai-blue px-3 py-1 rounded-full text-xs font-bold">
                        Média: {((ev.passing + ev.shooting + ev.dribbling + ev.vision + ev.positioning + ev.speed + ev.endurance) / 7).toFixed(1)}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'Passe', val: ev.passing },
                        { label: 'Chute', val: ev.shooting },
                        { label: 'Drible', val: ev.dribbling },
                        { label: 'Visão', val: ev.vision },
                        { label: 'Posição', val: ev.positioning },
                        { label: 'Veloc.', val: ev.speed },
                        { label: 'Resist.', val: ev.endurance },
                      ].map((skill) => (
                        <div key={skill.label} className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-500 w-12 uppercase">{skill.label}</span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-avai-blue rounded-full" 
                              style={{ width: `${(skill.val / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold text-avai-blue">{skill.val}</span>
                        </div>
                      ))}
                    </div>
                    
                    {ev.comments && (
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 italic">
                        "{ev.comments}"
                      </div>
                    )}
                  </div>
                ))}
                {evaluations.length === 0 && (
                  <div className="md:col-span-2 py-20 flex flex-col items-center text-slate-400 glass-card rounded-2xl">
                    <Star size={48} strokeWidth={1} className="mb-4" />
                    <p>Nenhuma avaliação registrada ainda.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'news' && (
            <motion.div 
              key="news"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Mural de Notícias</h3>
                <button 
                  onClick={() => setIsAddNewsModalOpen(true)}
                  className="bg-avai-blue text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-avai-blue/20"
                >
                  <Plus size={18} /> Novo Post
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {news.map((item) => (
                  <div key={item.id} className="glass-card rounded-2xl overflow-hidden group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-avai-blue text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h4>
                      <p className="text-sm text-slate-600 line-clamp-3">{item.description}</p>
                      <button className="mt-4 text-avai-blue font-bold text-sm flex items-center gap-1 hover:underline">
                        Ler mais <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'equipment' && (
            <motion.div 
              key="equipment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inventory */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Inventário de Equipamentos</h3>
                    <button 
                      onClick={() => setIsAddEquipmentModalOpen(true)}
                      className="text-avai-blue text-sm font-bold flex items-center gap-1"
                    >
                      <Plus size={16} /> Novo Item
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {equipment.map((item) => (
                      <div key={item.id} className="glass-card p-5 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                          <Package size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{item.name}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-slate-500">Total: {item.total_quantity}</span>
                            <span className={`text-xs font-bold ${item.available_quantity > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              Disponível: {item.available_quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Loans */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Empréstimos Ativos</h3>
                    <button className="bg-avai-blue text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                      Novo Empréstimo
                    </button>
                  </div>
                  <div className="space-y-4">
                    {loans.filter(l => !l.actual_return_date).map((loan) => {
                      const isLate = new Date(loan.expected_return_date) < new Date();
                      return (
                        <div key={loan.id} className={`p-4 rounded-xl border ${isLate ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                          <div className="flex justify-between items-start">
                            <h5 className="font-bold text-sm text-slate-800">{loan.equipment_name}</h5>
                            {isLate && <span className="text-[10px] font-bold text-red-600 uppercase">Atrasado</span>}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Com: {loan.student_name}</p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-[10px] text-slate-400">Devolução: {new Date(loan.expected_return_date).toLocaleDateString()}</span>
                            <button 
                              onClick={async () => {
                                await fetch(`/api/equipment/return/${loan.id}`, { method: 'POST' });
                                fetchData();
                              }}
                              className="text-[10px] font-bold text-avai-blue hover:underline"
                            >
                              Registrar Devolução
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {loans.filter(l => !l.actual_return_date).length === 0 && (
                      <p className="text-center py-8 text-slate-400 text-sm">Nenhum empréstimo ativo.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div 
              key="students"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex gap-4">
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    <option>Todas Categorias</option>
                    <option>Sub-5</option>
                    <option>Sub-7</option>
                    <option>Sub-9</option>
                    <option>Sub-11</option>
                    <option>Sub-13</option>
                    <option>Sub-15</option>
                    <option>Sub-17</option>
                  </select>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    <option>Todos</option>
                    <option>Ativo</option>
                    <option>Inativo</option>
                  </select>
                </div>
                <button 
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="bg-avai-blue text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-avai-blue/20"
                >
                  <UserPlus size={18} /> Novo Aluno
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Nome</th>
                      <th className="px-6 py-4">Categoria</th>
                      <th className="px-6 py-4">Responsável</th>
                      <th className="px-6 py-4">Contato</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-800">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-avai-blue/10 text-avai-blue rounded-md text-[10px] font-bold uppercase">
                            {student.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{student.parent_name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{student.parent_phone}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                            student.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {student.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-slate-400 hover:text-avai-blue transition-colors">
                            <ChevronRight size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredStudents.length === 0 && (
                  <div className="py-20 flex flex-col items-center text-slate-400">
                    <Users size={48} strokeWidth={1} className="mb-4" />
                    <p>Nenhum aluno encontrado.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'tactical' && (
            <motion.div 
              key="tactical"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl p-8 flex flex-col items-center"
            >
              <div className="w-full flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Prancheta Tática Interativa</h3>
                  <p className="text-sm text-slate-500">Arraste os jogadores para definir o posicionamento tático.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const newId = tacticalPlayers.length > 0 ? Math.max(...tacticalPlayers.map(p => p.id)) + 1 : 1;
                      setTacticalPlayers([...tacticalPlayers, { id: newId, number: '?', x: 50, y: 50, color: 'bg-red-500' }]);
                    }}
                    className="bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Adversário
                  </button>
                  <button 
                    onClick={() => {
                      const newId = tacticalPlayers.length > 0 ? Math.max(...tacticalPlayers.map(p => p.id)) + 1 : 1;
                      setTacticalPlayers([...tacticalPlayers, { id: newId, number: '?', x: 50, y: 50, color: 'bg-avai-blue' }]);
                    }}
                    className="bg-avai-blue text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg shadow-avai-blue/20 flex items-center gap-2"
                  >
                    <Plus size={16} /> Jogador Avaí
                  </button>
                </div>
              </div>

              <div 
                ref={fieldRef}
                className="w-full max-w-4xl aspect-[4/3] bg-emerald-600 rounded-xl relative border-4 border-white overflow-hidden shadow-2xl"
              >
                {/* Field Markings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-px h-full bg-white/50"></div>
                  <div className="w-40 h-40 rounded-full border-2 border-white/50"></div>
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-40 border-2 border-white/50 border-l-0"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-40 border-2 border-white/50 border-r-0"></div>
                <div className="absolute left-0 top-0 w-8 h-8 border-r-2 border-b-2 border-white/30 rounded-br-full"></div>
                <div className="absolute right-0 top-0 w-8 h-8 border-l-2 border-b-2 border-white/30 rounded-bl-full"></div>
                <div className="absolute left-0 bottom-0 w-8 h-8 border-r-2 border-t-2 border-white/30 rounded-tr-full"></div>
                <div className="absolute right-0 bottom-0 w-8 h-8 border-l-2 border-t-2 border-white/30 rounded-tl-full"></div>
                
                {/* Draggable Players */}
                {tacticalPlayers.map((player) => (
                  <motion.div
                    key={player.id}
                    drag
                    dragConstraints={fieldRef}
                    dragElastic={0}
                    dragMomentum={false}
                    onDragEnd={(_, info) => {
                      if (fieldRef.current) {
                        const rect = fieldRef.current.getBoundingClientRect();
                        const x = ((info.point.x - rect.left) / rect.width) * 100;
                        const y = ((info.point.y - rect.top) / rect.height) * 100;
                        setTacticalPlayers(prev => prev.map(p => p.id === player.id ? { ...p, x, y } : p));
                      }
                    }}
                    initial={{ left: `${player.x}%`, top: `${player.y}%` }}
                    className={`absolute w-10 h-10 ${player.color} rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold shadow-lg cursor-move z-10 -translate-x-1/2 -translate-y-1/2`}
                  >
                    {player.number}
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => setTacticalPlayers([])}
                  className="bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all flex items-center gap-2"
                >
                  Limpar Prancheta
                </button>
                <button 
                  onClick={() => alert('Formação salva com sucesso!')}
                  className="bg-avai-blue text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-avai-blue/20 hover:bg-avai-blue/90 transition-all flex items-center gap-2"
                >
                  <Tactical size={18} /> Salvar Formação
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div 
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Agenda de Treinos</h3>
                <button 
                  onClick={() => setIsAddClassModalOpen(true)}
                  className="bg-avai-blue text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-avai-blue/20"
                >
                  <Plus size={18} /> Agendar Treino
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((c) => (
                  <div key={c.id} className="glass-card p-6 rounded-2xl border-l-4 border-avai-blue">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-avai-blue/10 text-avai-blue rounded-lg">
                        <Clock size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(c.date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-lg mb-1">{c.title}</h4>
                    <p className="text-sm text-avai-blue font-bold mb-4">{c.category}</p>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                      <Clock size={14} />
                      <span>{c.time}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-600 line-clamp-2 italic">"{c.plan}"</p>
                    </div>
                  </div>
                ))}
                {classes.length === 0 && (
                  <div className="col-span-full py-20 flex flex-col items-center text-slate-400 glass-card rounded-2xl">
                    <Calendar size={48} strokeWidth={1} className="mb-4" />
                    <p>Nenhum treino agendado.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div 
              key="payments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold">Controle de Mensalidades</h3>
                <button 
                  onClick={() => setIsAddPaymentModalOpen(true)}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-emerald-500/20"
                >
                  <DollarSign size={18} /> Registrar Pagamento
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Aluno</th>
                      <th className="px-6 py-4">Valor</th>
                      <th className="px-6 py-4">Vencimento</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">{payment.student_name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">R$ {payment.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(payment.due_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                            payment.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-avai-blue text-xs font-bold hover:underline">Detalhes</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payments.length === 0 && (
                  <div className="py-20 flex flex-col items-center text-slate-400">
                    <CreditCard size={48} strokeWidth={1} className="mb-4" />
                    <p>Nenhum registro de pagamento.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'plans' && (
            <motion.div 
              key="plans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Metodologia de Treinamento</h3>
                <button className="bg-avai-blue text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-avai-blue/20">
                  <Plus size={18} /> Novo Plano
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classes.map((p) => (
                  <div key={p.id} className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-avai-blue/10 text-avai-blue rounded-xl">
                        <ClipboardList size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{p.title}</h4>
                        <p className="text-xs text-avai-blue font-bold uppercase">{p.category}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Objetivo do Treino</h5>
                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          {p.plan}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Última atualização: {new Date(p.date).toLocaleDateString()}</span>
                        <button className="text-avai-blue text-xs font-bold hover:underline">Editar Plano</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'communication' && (
            <motion.div 
              key="communication"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Central de Notificações</h3>
                <button 
                  onClick={() => setIsAddNotificationModalOpen(true)}
                  className="bg-avai-blue text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-avai-blue/20"
                >
                  <Bell size={18} /> Enviar Aviso
                </button>
              </div>
              <div className="space-y-4">
                {notifications.map((n) => (
                  <div key={n.id} className="glass-card p-6 rounded-2xl flex gap-6 items-start">
                    <div className="p-4 bg-avai-blue/10 text-avai-blue rounded-2xl">
                      <Bell size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800 text-lg">{n.title}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(n.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{n.message}</p>
                      <div className="mt-4 flex gap-4">
                        <button className="text-avai-blue text-xs font-bold hover:underline">Confirmar Leitura</button>
                        <button className="text-slate-400 text-xs font-bold hover:underline">Arquivar</button>
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="py-20 flex flex-col items-center text-slate-400 glass-card rounded-2xl">
                    <MessageSquare size={48} strokeWidth={1} className="mb-4" />
                    <p>Nenhuma notificação enviada.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Student Modal */}
      <AnimatePresence>
        {isAddStudentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddStudentModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-avai-blue text-white">
                <h3 className="text-lg font-bold">Cadastrar Novo Aluno</h3>
                <button onClick={() => setIsAddStudentModalOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddStudent} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome do Aluno</label>
                  <input name="name" required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20" placeholder="Nome completo" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
                    <select name="category" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20">
                      <option>Sub-5</option>
                      <option>Sub-7</option>
                      <option>Sub-9</option>
                      <option>Sub-11</option>
                      <option>Sub-13</option>
                      <option>Sub-15</option>
                      <option>Sub-17</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Data de Nascimento</label>
                    <input name="birth_date" required type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome do Responsável</label>
                  <input name="parent_name" required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20" placeholder="Nome do pai ou mãe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Telefone de Contato</label>
                  <input name="parent_phone" required type="tel" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20" placeholder="(00) 00000-0000" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsAddStudentModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-avai-blue text-white rounded-xl font-bold shadow-lg shadow-avai-blue/20 hover:bg-avai-blue/90 transition-colors">
                    Salvar Aluno
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Class Modal */}
      <AnimatePresence>
        {isAddClassModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddClassModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-avai-blue text-white">
                <h3 className="text-lg font-bold">Agendar Novo Treino</h3>
                <button onClick={() => setIsAddClassModalOpen(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddClass} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Título do Treino</label>
                  <input name="title" required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20" placeholder="Ex: Treino de Finalização" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
                    <select name="category" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20">
                      <option>Sub-5</option><option>Sub-7</option><option>Sub-9</option><option>Sub-11</option><option>Sub-13</option><option>Sub-15</option><option>Sub-17</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Data</label>
                    <input name="date" required type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Horário</label>
                  <input name="time" required type="time" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Plano de Aula</label>
                  <textarea name="plan" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20 h-24" placeholder="Descreva os exercícios..."></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-avai-blue text-white rounded-xl font-bold shadow-lg shadow-avai-blue/20">Salvar Treino</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Payment Modal */}
      <AnimatePresence>
        {isAddPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddPaymentModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-500 text-white">
                <h3 className="text-lg font-bold">Registrar Pagamento</h3>
                <button onClick={() => setIsAddPaymentModalOpen(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddPayment} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Aluno</label>
                  <select name="student_id" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20">
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Valor (R$)</label>
                  <input name="amount" required type="number" step="0.01" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20" placeholder="0.00" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Data de Vencimento</label>
                  <input name="due_date" required type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20" />
                </div>
                <button type="submit" className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20">Confirmar Registro</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Evaluation Modal */}
      <AnimatePresence>
        {isAddEvaluationModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddEvaluationModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-avai-blue text-white">
                <h3 className="text-lg font-bold">Nova Avaliação Técnica</h3>
                <button onClick={() => setIsAddEvaluationModalOpen(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddEvaluation} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Aluno</label>
                  <select name="student_id" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-avai-blue/20">
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['passing', 'shooting', 'dribbling', 'vision', 'positioning', 'speed', 'endurance'].map(skill => (
                    <div key={skill} className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{skill}</label>
                      <input name={skill} required type="number" min="0" max="10" className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" placeholder="0-10" />
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Comentários</label>
                  <textarea name="comments" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none h-20"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-avai-blue text-white rounded-xl font-bold">Salvar Avaliação</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add News Modal */}
      <AnimatePresence>
        {isAddNewsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddNewsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-avai-blue text-white">
                <h3 className="text-lg font-bold">Novo Post de Notícia</h3>
                <button onClick={() => setIsAddNewsModalOpen(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddNews} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
                  <input name="title" required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">URL da Imagem</label>
                  <input name="image_url" required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
                  <textarea name="description" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none h-32"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-avai-blue text-white rounded-xl font-bold">Publicar Notícia</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Equipment Modal */}
      <AnimatePresence>
        {isAddEquipmentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddEquipmentModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-avai-blue text-white">
                <h3 className="text-lg font-bold">Novo Equipamento</h3>
                <button onClick={() => setIsAddEquipmentModalOpen(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddEquipment} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome do Item</label>
                  <input name="name" required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" placeholder="Ex: Bolas de Treino" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Quantidade Total</label>
                  <input name="total_quantity" required type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" placeholder="0" />
                </div>
                <button type="submit" className="w-full py-3 bg-avai-blue text-white rounded-xl font-bold">Adicionar ao Inventário</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Notification Modal */}
      <AnimatePresence>
        {isAddNotificationModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddNotificationModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-avai-blue text-white">
                <h3 className="text-lg font-bold">Enviar Novo Aviso</h3>
                <button onClick={() => setIsAddNotificationModalOpen(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddNotification} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Título do Aviso</label>
                  <input name="title" required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Mensagem</label>
                  <textarea name="message" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none h-32"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-avai-blue text-white rounded-xl font-bold">Enviar para Todos</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
