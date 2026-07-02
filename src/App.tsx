import { Suspense, lazy } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

const Features = lazy(() => import('./components/Features').then((module) => ({ default: module.Features })));
const DeviceDashboard = lazy(() => import('./components/DeviceDashboard').then((module) => ({ default: module.DeviceDashboard })));
const Specs = lazy(() => import('./components/Specs').then((module) => ({ default: module.Specs })));
const RegisterForm = lazy(() => import('./components/RegisterForm').then((module) => ({ default: module.RegisterForm })));
const CartDrawer = lazy(() => import('./components/CartDrawer').then((module) => ({ default: module.CartDrawer })));
const NotificationToast = lazy(() => import('./components/NotificationToast').then((module) => ({ default: module.NotificationToast })));
const Chatbot = lazy(() => import('./components/Chatbot').then((module) => ({ default: module.Chatbot })));

function SectionFallback({ label }: { label: string }) {
  return (
    <section className="section-loading" aria-label={label} aria-busy="true">
      <div className="section-loading-card" />
    </section>
  );
}

function AppContent() {
  return (
    <>
      {/* Navigation Header */}
      <Navbar />
      
      {/* Main Sections */}
      <main style={{ flex: 1 }} id="main-content" aria-label="Nội dung chính của trang">
        <Hero />
        <Suspense fallback={<SectionFallback label="Đang tải tính năng sản phẩm" />}>
          <Features />
        </Suspense>
        <Suspense fallback={<SectionFallback label="Đang tải bảng điều khiển" />}>
          <DeviceDashboard />
        </Suspense>
        <Suspense fallback={<SectionFallback label="Đang tải thông số kỹ thuật" />}>
          <Specs />
        </Suspense>
        <Suspense fallback={<SectionFallback label="Đang tải form đăng ký" />}>
          <RegisterForm />
        </Suspense>
      </main>

      {/* Slide-out Cart & Wishlist Drawer */}
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>

      {/* Slide-in behavior notification toasts */}
      <Suspense fallback={null}>
        <NotificationToast />
      </Suspense>

      {/* Phase 6: AI Chatbot Support */}
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
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
