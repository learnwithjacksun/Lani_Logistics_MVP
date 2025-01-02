
import { Header } from "../components/Auth";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {

  return (
    <div className="min-h-[100dvh]">
      <Header />

      <main className="layout py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-main mb-2">{title}</h1>
          {subtitle && <p className="text-sub text-sm">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
