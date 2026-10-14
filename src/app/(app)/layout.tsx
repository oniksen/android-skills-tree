import Header from "@/components/shared/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Header>{children}</Header>;
}
