"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { Services } from "@/ports/services";
import { createClientServices } from "@/adapters/firestore-client/client-services";

const ServicesContext = createContext<Services | null>(null);

export function ServicesProvider({
  children,
  services,
}: {
  children: ReactNode;
  services?: Services;
}) {
  const value = useMemo(() => services ?? createClientServices(), [services]);
  return (
    <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>
  );
}

export function useServices(): Services {
  const services = useContext(ServicesContext);
  if (!services) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return services;
}
