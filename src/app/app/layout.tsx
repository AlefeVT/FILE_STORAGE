import { PropsWithChildren } from 'react';
import { ClientSideProvider } from './_components/Sidebar/ClientSideProvider';
import { Sidebar } from './_components/Sidebar';
import { Header } from './_components/Header';

export default async function Layout({ children }: PropsWithChildren) {

  return (
    <ClientSideProvider >
      <div className="flex h-screen overflow-hidden">
        <div className="flex h-screen">
          <Sidebar />
        </div>
        <main className='w-full h-screen'>
          <Header />
          {children}
        </main>
      </div>
    </ClientSideProvider>
  );
}
