import Header from "@/shared/ui/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Header>{children}</Header>;
}
