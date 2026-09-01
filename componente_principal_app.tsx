import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, AlertOctagon, FileText, PhoneCall, 
  ShieldAlert, Camera, Send, Home, Settings, User, 
  Bell, LogOut, Plus, X, HeartHandshake, CheckCircle,
  Map as MapIcon, MessageCircle, Shield, Lock, BellRing, UserCheck, HelpCircle
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

// 1. Inicialización segura de Firebase usando variables de entorno globales
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'safezone-app';

const MOCK_CONTACTS = [
  { id: 1, name: "Emergencias Médicas", phone: "123", icon: <HeartHandshake size={24} className="text-red-500" /> },
  { id: 2, name: "Policía Local", phone: "112", icon: <ShieldAlert size={24} className="text-blue-500" /> },
  { id: 3, name: "Orientación Escolar", phone: "555-0101", icon: <User size={24} className="text-green-500" /> },
];

const AppHeader = ({ profile, onLogout }) => (
  <header className="bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
        {profile?.name?.charAt(0) || 'U'}
      </div>
      <div>
        <h1 className="font-bold text-slate-800 text-sm leading-tight">{profile?.name}</h1>
        <p className="text-[11px] text-slate-500 capitalize">{profile?.role}</p>
      </div>
    </div>
    <div className="flex space-x-2">
      <button className="p-2 text-slate-400 hover:text-slate-600 relative">
        <Bell size={20} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <button onClick={onLogout} className="p-2 text-slate-400 hover:text-slate-600">
        <LogOut size={20} />
      </button>
    </div>
  </header>
);

const LoginScreen = ({ onSelectProfile }) => {
  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-lg rotate-3">
        <ShieldAlert size={40} className="text-blue-600 -rotate-3" />
      </div>
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight">SafeZone</h1>
      <p className="text-blue-200 mb-10 text-lg">Comunidad escolar segura y conectada.</p>
      
      <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm w-full max-w-sm border border-white/20">
        <h2 className="text-sm font-semibold text-blue-100 uppercase tracking-wider mb-4">Ingresar como</h2>
        <div className="space-y-3">
          <button 
            onClick={() => onSelectProfile({ name: 'Carlos (Estudiante)', role: 'estudiante', email: 'carlos.estudiante@colegio.edu', grade: '10° B' })}
            className="w-full bg-white text-blue-700 font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm flex items-center justify-center"
          >
            <User size={18} className="mr-2" /> Estudiante
          </button>
          <button 
            onClick={() => onSelectProfile({ name: 'Familia Gómez', role: 'familiar', email: 'familia.gomez@mail.com', grade: 'Apoderado' })}
            className="w-full bg-blue-700 text-white border border-blue-500 font-bold py-3.5 rounded-xl hover:bg-blue-800 transition-colors flex items-center justify-center"
          >
            <HeartHandshake size={18} className="mr-2" /> Familiar
          </button>
          <button 
            onClick={() => onSelectProfile({ name: 'Dirección Escolar', role: 'directivo', email: 'admin@colegio.edu', grade: 'Administración' })}
            className="w-full bg-transparent text-blue-100 border border-blue-400 font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Settings size={18} className="mr-2" /> Directivo (Admin)
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ onNavigate, profile }) => (
  <div className="p-5 pb-24 bg-slate-50 min-h-screen animate-fade-in space-y-6">
    {/* SOS Button Area */}
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-0"></div>
      <h2 className="text-lg font-bold text-slate-800 relative z-10 mb-1">¿Necesitas ayuda inmediata?</h2>
      <p className="text-sm text-slate-500 relative z-10 mb-6">Activa el protocolo de seguridad escolar.</p>
      
      <button className="relative z-10 group mx-auto flex items-center justify-center w-32 h-32 bg-red-500 rounded-full shadow-lg shadow-red-500/40 hover:bg-red-600 hover:scale-105 transition-all duration-300">
        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20 group-hover:hidden"></div>
        <span className="text-white font-black text-2xl tracking-widest">SOS</span>
      </button>
    </div>

    {/* Quick Tools Grid */}
    <div>
      <h3 className="font-bold text-slate-800 mb-3 px-1">Herramientas</h3>
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('report')}
          className="bg-amber-50 p-4 rounded-2xl flex flex-col items-center justify-center text-amber-700 hover:bg-amber-100 transition-colors"
        >
          <div className="bg-white p-3 rounded-full shadow-sm mb-3 text-amber-500">
            <AlertOctagon size={24} />
          </div>
          <span className="font-semibold text-sm">Reportar</span>
        </button>

        <button 
          onClick={() => onNavigate('news')}
          className="bg-blue-50 p-4 rounded-2xl flex flex-col items-center justify-center text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <div className="bg-white p-3 rounded-full shadow-sm mb-3 text-blue-500">
            <FileText size={24} />
          </div>
          <span className="font-semibold text-sm">Comunicados</span>
        </button>

        <button 
          onClick={() => onNavigate('chat')}
          className="bg-purple-50 p-4 rounded-2xl flex flex-col items-center justify-center text-purple-700 hover:bg-purple-100 transition-colors"
        >
          <div className="bg-white p-3 rounded-full shadow-sm mb-3 text-purple-500">
            <MessageCircle size={24} />
          </div>
          <span className="font-semibold text-sm">Orientación</span>
        </button>

        <button 
          onClick={() => onNavigate('map')}
          className="bg-emerald-50 p-4 rounded-2xl flex flex-col items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          <div className="bg-white p-3 rounded-full shadow-sm mb-3 text-emerald-500">
            <MapIcon size={24} />
          </div>
          <span className="font-semibold text-sm">Mapas Seguros</span>
        </button>

        <button 
          onClick={() => onNavigate('contacts')}
          className="bg-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors col-span-2 border border-slate-200"
        >
          <div className="bg-white p-3 rounded-full shadow-sm mb-3 text-slate-500 flex items-center justify-center">
            <PhoneCall size={24} />
          </div>
          <span className="font-semibold text-sm">Directorio de Ayuda</span>
        </button>
      </div>
    </div>
  </div>
);

const NewsView = ({ onBack, profile, db }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('info');

  const newsCollectionPath = `artifacts/${appId}/public/data/news`;

  useEffect(() => {
    const newsRef = collection(db, newsCollectionPath);
    const unsubscribe = onSnapshot(newsRef, (snapshot) => {
      const fetchedNews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      fetchedNews.sort((a, b) => b.createdAt - a.createdAt);
      setNews(fetchedNews);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching news:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, newsCollectionPath]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    
    try {
      await addDoc(collection(db, newsCollectionPath), {
        title: newTitle,
        content: newContent,
        type: newType,
        authorRole: profile.role,
        authorName: profile.name,
        createdAt: Date.now()
      });
      setShowForm(false);
      setNewTitle('');
      setNewContent('');
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Reciente';
    return new Date(timestamp).toLocaleDateString('es-ES', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' 
    });
  };

  return (
    <div className="p-5 pb-24 bg-slate-50 h-full min-h-screen animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center text-slate-600 font-medium hover:text-slate-900 transition-colors">
          <ChevronRight className="rotate-180 mr-1" size={20} /> Volver
        </button>
        {profile.role === 'directivo' && !showForm && (
          <button onClick={() => setShowForm(true)} className="text-blue-600 font-semibold text-sm flex items-center bg-blue-50 px-3 py-1.5 rounded-lg">
            <Plus size={16} className="mr-1" /> Nuevo
          </button>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Comunicados</h2>
        <p className="text-sm text-slate-500 mt-1">Avisos en tiempo real desde la nube.</p>
      </div>

      {showForm && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-200 mb-6 animate-fade-in relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400">
            <X size={20} />
          </button>
          <h3 className="font-bold text-slate-800 mb-4">Nuevo Comunicado</h3>
          <form onSubmit={handleCreatePost} className="space-y-3">
            <input 
              type="text" placeholder="Título del aviso..." required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea 
              placeholder="Detalles..." required rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={newContent} onChange={(e) => setNewContent(e.target.value)}
            ></textarea>
            <div className="flex gap-2">
              <label className={`flex-1 text-center py-2 rounded-lg border cursor-pointer ${newType === 'info' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-500'}`}>
                <input type="radio" name="type" className="hidden" checked={newType === 'info'} onChange={() => setNewType('info')} /> Info
              </label>
              <label className={`flex-1 text-center py-2 rounded-lg border cursor-pointer ${newType === 'warning' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'border-slate-200 text-slate-500'}`}>
                <input type="radio" name="type" className="hidden" checked={newType === 'warning'} onChange={() => setNewType('warning')} /> Alerta
              </label>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700">
              Publicar
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-slate-500 py-10 animate-pulse">Cargando comunicados...</div>
        ) : news.length === 0 ? (
          <div className="text-center text-slate-500 py-10 bg-white rounded-2xl border border-dashed border-slate-300">
            No hay comunicados activos.
          </div>
        ) : (
          news.map(note => (
            <div key={note.id} className={`bg-white p-5 rounded-2xl shadow-sm border-l-4 flex flex-col ${note.type === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
              <div className="flex items-center mb-2">
                {note.type === 'warning' ? (
                   <AlertOctagon size={16} className="text-amber-500 mr-2" />
                ) : (
                   <FileText size={16} className="text-blue-500 mr-2" />
                )}
                <h3 className="font-bold text-slate-800">{note.title}</h3>
              </div>
              <p className="text-slate-600 text-sm mb-3 leading-relaxed">{note.content}</p>
              <div className="flex justify-between items-center mt-auto">
                 <p className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">{note.authorName}</p>
                 <p className="text-xs text-slate-400 font-medium">{formatDate(note.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ContactsView = ({ onBack }) => (
  <div className="p-5 bg-slate-50 min-h-screen animate-fade-in pb-24">
    <button onClick={onBack} className="flex items-center text-slate-600 font-medium mb-6 hover:text-slate-900 transition-colors">
      <ChevronRight className="rotate-180 mr-1" size={20} /> Volver
    </button>
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-800">Directorio de Ayuda</h2>
      <p className="text-sm text-slate-500 mt-1">Contactos institucionales y de emergencia.</p>
    </div>
    <div className="space-y-4">
      {MOCK_CONTACTS.map(contact => (
        <div key={contact.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-slate-50 p-3 rounded-full">{contact.icon}</div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">{contact.name}</h3>
              <p className="text-slate-500 text-sm">{contact.phone}</p>
            </div>
          </div>
          <button className="bg-blue-50 p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors">
            <PhoneCall size={20} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const ChatView = ({ onBack, db, firebaseUser, profile }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = React.useRef(null);
  
  const chatPath = `artifacts/${appId}/users/${firebaseUser?.uid}/chat_orientation`;

  useEffect(() => {
    if (!firebaseUser) return;
    const chatRef = collection(db, chatPath);
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      msgs.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(msgs);
    }, (error) => console.error("Error chat:", error));
    return () => unsubscribe();
  }, [db, firebaseUser, chatPath]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !firebaseUser) return;
    try {
      await addDoc(collection(db, chatPath), {
        text: newMessage,
        senderName: profile.name,
        senderRole: profile.role,
        createdAt: Date.now()
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error enviando mensaje", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-fade-in relative z-10 pb-16">
      <div className="bg-white px-5 py-4 flex items-center border-b border-slate-200 sticky top-0 z-20">
        <button onClick={onBack} className="text-slate-600 hover:text-slate-900 transition-colors mr-3">
          <ChevronRight className="rotate-180" size={24} />
        </button>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
            <MessageCircle size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight">Orientación Escolar</h2>
            <p className="text-[11px] text-green-500 font-medium">● En línea (Canal Privado)</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="text-center text-xs text-slate-400 my-4">Hoy</div>
        
        <div className="flex flex-col items-start">
           <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3 max-w-[80%] shadow-sm">
             <p className="text-sm text-slate-700">Hola, {profile.name}. Soy parte del equipo de orientación. Este espacio es confidencial. ¿En qué te podemos ayudar hoy?</p>
           </div>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderName === profile.name;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-4 border-t border-slate-200 sticky bottom-0">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-slate-100 rounded-full px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button type="submit" disabled={!newMessage.trim()} className="bg-purple-600 disabled:bg-purple-300 text-white p-3 rounded-full hover:bg-purple-700 transition-colors">
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

const MapView = ({ onBack }) => (
  <div className="p-5 bg-slate-50 min-h-screen animate-fade-in pb-24">
    <button onClick={onBack} className="flex items-center text-slate-600 font-medium mb-6 hover:text-slate-900 transition-colors">
      <ChevronRight className="rotate-180 mr-1" size={20} /> Volver
    </button>
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-800">Mapas Seguros</h2>
      <p className="text-sm text-slate-500 mt-1">Rutas de evacuación y puntos de encuentro.</p>
    </div>
    
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
      <div className="relative w-full h-80 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 p-4">
        
        <div className="absolute top-6 left-6 w-24 h-28 bg-slate-300 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600 shadow-inner border border-slate-400/20">Pabellón A</div>
        <div className="absolute top-6 right-6 w-24 h-20 bg-slate-300 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600 shadow-inner border border-slate-400/20">Cafetería</div>
        <div className="absolute bottom-16 left-6 w-24 h-20 bg-slate-300 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600 shadow-inner border border-slate-400/20">Laboratorios</div>
        
        <div className="absolute bottom-6 right-6 w-32 h-32 bg-emerald-100 border-2 border-emerald-500 border-dashed rounded-full flex flex-col items-center justify-center text-emerald-700 shadow-sm">
           <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
           <MapIcon size={24} className="mb-1" />
           <span className="text-[10px] font-bold text-center leading-tight">Punto de<br/>Encuentro</span>
        </div>

        <div className="absolute top-36 left-16 w-2 h-16 bg-red-400/70 rounded-full"></div>
        <div className="absolute bottom-40 left-16 w-2 h-8 bg-red-400/70 rounded-full"></div>
        <div className="absolute top-36 right-16 w-2 h-20 bg-red-400/70 rounded-full"></div>
        
        <div className="absolute top-4 left-4 w-3 h-3 bg-red-600 rounded-sm shadow border border-white"></div>
        <div className="absolute top-4 right-28 w-3 h-3 bg-red-600 rounded-sm shadow border border-white"></div>
      </div>
      
      <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex items-center"><span className="w-3 h-3 bg-emerald-100 border border-emerald-500 rounded-full mr-2"></span> Punto Encuentro</div>
        <div className="flex items-center"><span className="w-3 h-3 bg-red-400 rounded-sm mr-2"></span> Ruta Evacuación</div>
        <div className="flex items-center"><span className="w-3 h-3 bg-red-600 border border-white rounded-sm mr-2 shadow-sm"></span> Extintor</div>
        <div className="flex items-center"><span className="w-3 h-3 bg-slate-300 rounded mr-2"></span> Aulas/Zonas</div>
      </div>
    </div>
  </div>
);

const ReportView = ({ onBack, db, firebaseUser }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('Bullying / Acoso escolar');
  const [desc, setDesc] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firebaseUser) return;
    
    setLoading(true);
    try {
      const reportsPath = `artifacts/${appId}/users/${firebaseUser.uid}/reports`;
      await addDoc(collection(db, reportsPath), {
        type: type,
        description: desc,
        isAnonymous: isAnonymous,
        status: 'Pendiente',
        createdAt: Date.now()
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-slate-50 min-h-screen animate-fade-in pb-24">
      <button onClick={onBack} className="flex items-center text-slate-600 font-medium mb-6 hover:text-slate-900 transition-colors">
        <ChevronRight className="rotate-180 mr-1" size={20} /> Volver
      </button>
      
      {submitted ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center mt-10 animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Reporte Enviado</h2>
          <p className="text-slate-600 mb-6">Tu reporte ha sido guardado de forma segura en la base de datos de la institución.</p>
          <button onClick={onBack} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
            Volver al Inicio
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Reportar Incidente</h2>
            <p className="text-sm text-slate-500 mt-1">Sube la información de manera confidencial.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Incidente</label>
              <select 
                value={type} onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Bullying / Acoso escolar</option>
                <option>Daño a la infraestructura</option>
                <option>Consumo de sustancias</option>
                <option>Violencia física o verbal</option>
                <option>Otro</option>
              </select>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
              <textarea 
                value={desc} onChange={(e) => setDesc(e.target.value)} required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                placeholder="Describe brevemente lo que sucedió..."
              ></textarea>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-800">Reporte Anónimo</h4>
                <p className="text-xs text-slate-500">Ocultar mi identidad al personal</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-blue-600 disabled:bg-blue-400 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center mt-6">
              {loading ? (
                <span className="animate-pulse">Guardando en la nube...</span>
              ) : (
                <><Send size={20} className="mr-2" /> Enviar Reporte</>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

const ProfileView = ({ profile, onLogout, onUpdateProfile }) => {
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emergencyPhone, setEmergencyPhone] = useState('300 123 4567');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, name, email });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-5 bg-slate-50 min-h-screen animate-fade-in pb-24 space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Ajustes de Perfil</h2>
        <p className="text-sm text-slate-500 mt-1">Administra tu cuenta y preferencias de seguridad.</p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl flex items-center text-sm">
          <CheckCircle size={18} className="mr-2 text-emerald-500 shrink-0" />
          ¡Cambios guardados con éxito!
        </div>
      )}

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
            {name.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{name}</h3>
            <p className="text-xs text-slate-500 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md inline-block font-semibold uppercase mt-1">
              {profile?.role}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nombre Completo</label>
            <div className="relative flex items-center">
              <User size={18} className="absolute left-3 text-slate-400" />
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Correo Electrónico</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 font-bold text-sm">@</span>
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Teléfono de Emergencia (Familiar)</label>
            <div className="relative flex items-center">
              <PhoneCall size={18} className="absolute left-3 text-slate-400" />
              <input 
                type="text" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm">
            Guardar Cambios
          </button>
        </form>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-4">
        <h4 className="font-bold text-slate-800 text-sm flex items-center">
          <BellRing size={18} className="mr-2 text-blue-500" /> Preferencias de Alertas
        </h4>
        
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div>
            <p className="text-sm font-medium text-slate-700">Notificaciones Push (SOS)</p>
            <p className="text-xs text-slate-400">Recibir alertas de emergencia instantáneas</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-slate-700">Modo Confidencial</p>
            <p className="text-xs text-slate-400">Ocultar información sensible en pantalla bloqueada</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-white hover:bg-slate-100 text-slate-700 font-semibold p-4 rounded-2xl border border-slate-200 flex items-center justify-between transition-colors">
          <div className="flex items-center">
            <HelpCircle size={20} className="text-slate-400 mr-3" />
            <span className="text-sm">Preguntas Frecuentes y Soporte</span>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </button>

        <button 
          onClick={onLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold p-4 rounded-2xl border border-red-100 flex items-center justify-center transition-colors"
        >
          <LogOut size={18} className="mr-2" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

const BottomNav = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', icon: <Home size={24} />, label: 'Inicio' },
    { id: 'report', icon: <ShieldAlert size={24} />, label: 'Reportar' },
    { id: 'profile', icon: <Settings size={24} />, label: 'Ajustes' },
  ];

  return (
    <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center pb-safe z-20">
      {navItems.map(item => (
        <button 
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${currentView === item.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {item.icon}
          <span className="text-[10px] font-semibold mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const [userProfile, setUserProfile] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
           await signInWithCustomToken(auth, __initial_auth_token);
        } else {
           await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
        setIsAuthLoading(false);
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center">
        <div className="animate-spin text-blue-600"><ShieldAlert size={48} /></div>
      </div>
    );
  }

  if (!userProfile) {
    return <LoginScreen onSelectProfile={setUserProfile} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} profile={userProfile} />;
      case 'report':
        return <ReportView onBack={() => setCurrentView('dashboard')} db={db} firebaseUser={firebaseUser} />;
      case 'contacts':
        return <ContactsView onBack={() => setCurrentView('dashboard')} />;
      case 'news':
        return <NewsView onBack={() => setCurrentView('dashboard')} profile={userProfile} db={db} />;
      case 'chat':
        return <ChatView onBack={() => setCurrentView('dashboard')} db={db} firebaseUser={firebaseUser} profile={userProfile} />;
      case 'map':
        return <MapView onBack={() => setCurrentView('dashboard')} />;
      case 'profile':
        return (
          <ProfileView 
            profile={userProfile} 
            onLogout={() => setUserProfile(null)} 
            onUpdateProfile={(updated) => setUserProfile(updated)} 
          />
        );
      default:
        return <DashboardView onNavigate={setCurrentView} profile={userProfile} />;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen font-sans text-slate-900 flex justify-center items-center p-0 sm:p-4">
      <div className="w-full h-[100dvh] sm:h-[850px] max-w-md bg-white relative sm:rounded-[40px] shadow-2xl overflow-hidden sm:border-8 sm:border-slate-800 flex flex-col">
        
        <div className="hidden sm:flex bg-white h-6 items-center justify-between px-6 text-[10px] font-medium text-slate-500 shrink-0">
          <span>10:00</span>
          <div className="flex space-x-1">
             <span className="w-2 h-2 rounded-full bg-slate-800"></span>
             <span className="w-2 h-2 rounded-full bg-slate-800"></span>
             <span className="w-3 h-2 rounded-sm bg-slate-800"></span>
          </div>
        </div>

        <AppHeader profile={userProfile} onLogout={() => setUserProfile(null)} />
        
        <main className="flex-1 overflow-y-auto relative pb-20">
          {renderView()}
        </main>

        <BottomNav currentView={currentView} onViewChange={setCurrentView} />
      </div>
    </div>
  );
}