import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WhatsAppMassivos from './pages/WhatsAppMassivos';
import ScriptsSD from './pages/ScriptsSD';
import AccessControl from './pages/AccessControl';
import ProcessamentoMassa from './pages/ProcessamentoMassa';
import MesaSpoc from './pages/MesaSpoc';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/whatsapp" element={<WhatsAppMassivos />} />
        <Route path="/scripts-sd" element={<ScriptsSD />} />
        <Route path="/access-control" element={<AccessControl />} />
        <Route path="/processamento-massa" element={<ProcessamentoMassa />} />
        <Route path="/mesa-spoc" element={<MesaSpoc />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;