import { ClientSideProvider } from '../../components/Sidebar/ClientSideProvider';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientSideProvider >
      <div className="flex h-screen overflow-hidden">
        <div className="flex h-screen">
          <Sidebar />
        </div>
        <main className='w-full h-screen'>
          <Header />

          <div className="overflow-y-auto h-screen">
            {children}
          </div>


        </main>
      </div>
    </ClientSideProvider>
  );
}
