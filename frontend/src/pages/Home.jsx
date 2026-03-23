import React from 'react';
import { Link } from 'react-router-dom';

const HubCard = ({ title, description, icon, to, colorClass }) => (
  <Link to={to} className={`bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-${colorClass} transition-all duration-300 group hover:-translate-y-1 shadow-lg`}>
    <div className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center bg-slate-900 border border-slate-700 group-hover:border-${colorClass} transition-colors`}>
      {icon}
    </div>
    <h3 className={`text-xl font-bold text-white mb-2 group-hover:text-${colorClass} transition-colors`}>
      {title}
    </h3>
    <p className="text-slate-400 text-sm font-medium leading-relaxed">
      {description}
    </p>
  </Link>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-slate-900 to-[#0f172a] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header do HUB */}
        <header className="text-center space-y-4 pt-10">
          <div className="inline-flex items-center justify-center p-3 bg-neo-green/10 rounded-2xl mb-2">
            <svg className="w-10 h-10 text-neo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            Service Desk <span className="text-neo-green">HUB</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
            Central de automações e ferramentas para otimização do atendimento da equipe Indra | Minsait na Neoenergia.
          </p>
        </header>

        {/* Grid de Ferramentas */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          
          <HubCard 
            title="Gestão de WhatsApp"
            description="Tratamento de chamados massivos via WhatsApp. Importe textos, monitore filas e gere scripts ágeis de retorno."
            to="/whatsapp"
            colorClass="neo-green"
            icon={<svg className="w-7 h-7 text-neo-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>}
          />

          <HubCard 
            title="Scripts: Reset & Senhas"
            description="Gerador rápido de scripts padronizados para Reset, Desbloqueio e problemas de acesso em sistemas como GSE e UE."
            to="/scripts-sd"
            colorClass="neo-blue"
            icon={<svg className="w-7 h-7 text-neo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>}
          />

          <HubCard 
            title="Access Control (SAP)"
            description="Automação para criação de chamados e e-mails de solicitação de novos usuários ou reset de senhas no SAP/GCO."
            to="/access-control"
            colorClass="neo-orange"
            icon={<svg className="w-7 h-7 text-neo-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
          />

          <HubCard 
            title="Processamento em Massa"
            description="Cole listas do ServiceNow para tratar múltiplas solicitações de GSE/UE em lote com controle de fila."
            to="/processamento-massa"
            colorClass="purple-500"
            icon={<svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>}
          />

        </main>

        <footer className="pt-20 pb-6 text-center flex flex-col items-center justify-center gap-1">
          <p className="text-slate-500 text-sm font-bold tracking-wide">
            Service Desk Neoenergia <span className="text-slate-700 font-normal">| HUB v1.0</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;