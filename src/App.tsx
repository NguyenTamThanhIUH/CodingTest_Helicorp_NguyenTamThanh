import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { DeviceDashboard } from './components/DeviceDashboard';
import { Specs } from './components/Specs';
import { RegisterForm } from './components/RegisterForm';
import { CartDrawer } from './components/CartDrawer';
import { NotificationToast } from './components/NotificationToast';

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
        <Specs />
        <RegisterForm />
      </main>

      {/* Slide-out Cart & Wishlist Drawer */}
      <CartDrawer />

      {/* Slide-in behavior notification toasts */}
      <NotificationToast />
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
