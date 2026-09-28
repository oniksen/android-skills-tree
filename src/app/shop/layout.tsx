import Header from "@/components/shared/Header";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <Header>{children}</Header>;
}
