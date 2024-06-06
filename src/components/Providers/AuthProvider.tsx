"use client"
import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

interface ClientProviderProps {
  children: ReactNode;
}

const ClientProvider = ({ children }: ClientProviderProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <SessionProvider>{children}</SessionProvider>;
};

export default ClientProvider;
