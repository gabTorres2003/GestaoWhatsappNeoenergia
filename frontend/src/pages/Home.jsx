// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Importando as logos
import logoNeo from '../assets/logo_neo.png';
import logoMinsait from '../assets/logo_minsait.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-slate-900 to-[#0f172a] p-6 md:p-12 flex flex-col items-center justify-center font-sans">
      
      <div className="max-w-5xl w-full space-y-12">
        
        {/* Cabeçalho Centralizado do HUB */}
        <header className="flex flex-col items-center text-center space-y-6 animate-fade-in">
          
          {/* Logos */}
          <div className="flex items-center gap-6 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 shadow-lg backdrop-blur-sm">
            <img src={logoMinsait} alt="Minsait" className="h-8 md:h-10 object-contain" />
            <span className="text-slate-600 text-3xl font-light">|</span>
            <img src={logoNeo} alt="Neoenergia" className="h-10 md:h-12 object-contain" />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight m-0">
              Automação Minsait <span className="text-emerald-500">Neoenergia</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg mt-3">
              Central de Ferramentas e Scripts do Service Desk
            </p>
          </div>

        </header>

        {/* Grid de Navegação (Cards) */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          
          {/* Card 1: WhatsApp Massivos */}
          <Link 
            to="/whatsapp" 
            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📱</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Gestão de WhatsApp
              </h2>
              <p className="text-slate-400 text-sm">
                Painel de controle para incidentes massivos, fila de atendimento e alertas automáticos em tempo real.
              </p>
            </div>
          </Link>

          {/* Card 2: Processamento em Massa */}
          <Link 
            to="/processamento-massa" 
            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">⚡</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Processamento em Massa
              </h2>
              <p className="text-slate-400 text-sm">
                Importe tabelas do ServiceNow e processe filas de chamados GSE e UE WEB rapidamente.
              </p>
            </div>
          </Link>

          {/* Card 3: Scripts SD */}
          <Link 
            to="/scripts-sd" 
            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 hover:border-orange-500/50 transition-all duration-300 shadow-lg hover:shadow-orange-500/10 flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📝</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                Gerador de Scripts SD
              </h2>
              <p className="text-slate-400 text-sm">
                Geração de scripts unitários para reset, desbloqueio e comunicação com o usuário final.
              </p>
            </div>
          </Link>

          {/* Card 4: Access Control */}
          <Link 
            to="/access-control" 
            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/10 flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🛡️</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Access Control
              </h2>
              <p className="text-slate-400 text-sm">
                Criação de acessos SAP, definição de ambientes, aplicações e geração automática de chamados.
              </p>
            </div>
          </Link>

        </main>

        {/* Rodapé */}
        <footer className="pt-8 text-center flex flex-col items-center justify-center gap-1">
          <p className="text-slate-500 text-sm font-medium tracking-wide">
            Service Desk Neoenergia | Indra Minsait
          </p>
        </footer>

      </div>
    </div>
  );
}