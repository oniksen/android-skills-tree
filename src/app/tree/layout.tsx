import Header from "@/components/shared/Header";

export default function TreeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
