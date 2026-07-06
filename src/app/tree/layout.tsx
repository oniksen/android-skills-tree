import Header from "@/components/shared/Header";

export default function TreeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {children}
      </main>
    </>
  );
}
