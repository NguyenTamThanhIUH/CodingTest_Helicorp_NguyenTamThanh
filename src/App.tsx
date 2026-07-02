import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { DeviceDashboard } from './components/DeviceDashboard';
import { CartDrawer } from './components/CartDrawer';

function AppContent() {
  return (
    <>
      {/* Navigation Header */}
      <Navbar />
      
      {/* Main Sections */}
      <main style={{ flex: 1 }}>
        <Hero />
        <Features />
        <DeviceDashboard />
      </main>

      {/* Slide-out Cart & Wishlist Drawer */}
      <CartDrawer />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
