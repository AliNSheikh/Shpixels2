/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContentProvider, useContent } from './context/ContentContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/public/Header';
import { Hero } from './components/public/Hero';
import { Showreel } from './components/public/Showreel';
import { About } from './components/public/About';
import { Services } from './components/public/Services';
import { ClientLogos } from './components/public/ClientLogos';
import { Portfolio } from './components/public/Portfolio';
import { Process } from './components/public/Process';
import { Gallery } from './components/public/Gallery';
import { Contact } from './components/public/Contact';
import { Footer } from './components/public/Footer';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminAuthModal } from './components/admin/AdminAuthModal';

function AppContent() {
  const { isAdminView, isAuthenticated } = useContent();

  if (isAdminView) {
    if (!isAuthenticated) {
      return <AdminAuthModal />;
    }
    return <AdminLayout />;
  }

  return (
    <div className="min-h-screen bg-[#171717] text-[#f1f2ed] selection:bg-[#2563eb] selection:text-white">
      <Header />
      <main>
        <Hero />
        <Showreel />
        <ClientLogos />
        <About />
        <Services />
        <Portfolio />
        <Process />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ContentProvider>
  );
}

