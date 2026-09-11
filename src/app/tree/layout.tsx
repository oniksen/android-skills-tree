import Header from "@/components/shared/Header";

export default function TreeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Header mainClassName="px-4 pt-8 pb-24 nav-md:pb-8 space-y-6">{children}</Header>
  );
}