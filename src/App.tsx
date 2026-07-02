import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CartDrawer } from './components/CartDrawer';

function AppContent() {
  return (
    <>
      {/* Navigation Header */}
      <Navbar />
      
      {/* Main Sections */}
      <main style={{ flex: 1 }}>
        <Hero />
        {/* Further sections (Features, Dashboard, Specs, Form, Chatbot) will be added here in subsequent phases */}
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
