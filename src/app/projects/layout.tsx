import Header from "@/components/shared/Header";
export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (<> <Header /> <main className="max-w-6xl mx-auto px-4 py-8">{children}</main> </>);
}
