import { Header, Navbar } from "../components/Dashboard";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div className="min-h-[100dvh] pb-24">
      <Header />
      <main className="layout py-6">
        {title && (
          <h1 className="text-xl font-bold text-main mb-6">{title}</h1>
        )}
        {children}
      </main>
      <Navbar />
    </div>
  );
};

export default DashboardLayout;
