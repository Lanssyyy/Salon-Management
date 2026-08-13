import React from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, Database, FileText, Scissors, ShieldCheck } from 'lucide-react';
import './styles.css';

const inventory = [
  ['Frontend framework', 'No source application files were present; this shell uses React + Vite for the renderer.'],
  ['Build system', 'Vite renderer build with Electron Builder Windows NSIS packaging.'],
  ['Base44 SDK calls', 'None found in the checked-in repository.'],
  ['Entities/functions', 'No Base44 entity or function definitions were present to inspect.'],
  ['Authentication', 'No existing authentication implementation was present to preserve or migrate.'],
];

function App() {
  const desktopApi = window.salonDesktop;

  const printPage = async () => {
    if (desktopApi?.print) await desktopApi.print();
    else window.print();
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><Scissors size={28} /><span>Salon Management</span></div>
        <nav>
          <a className="active"><CalendarDays size={18} /> Migration Status</a>
          <a><Database size={18} /> Data Mapping</a>
          <a><ShieldCheck size={18} /> Security</a>
          <a><FileText size={18} /> Documentation</a>
        </nav>
      </aside>
      <section className="content">
        <div className="hero">
          <p className="eyebrow">Desktop Migration Shell</p>
          <h1>Salon Management for Windows</h1>
          <p>This Electron shell preserves the migration path without inventing missing Base44 business logic. Add the exported Base44 source to continue feature-by-feature migration.</p>
          <button onClick={printPage}>Test Desktop Print</button>
        </div>
        <section className="cards">
          {inventory.map(([title, body]) => <article className="card" key={title}><h2>{title}</h2><p>{body}</p></article>)}
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
S