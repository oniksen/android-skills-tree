import Header from "@/shared/ui/Header";
import { getLatestReleaseVersion } from "@/lib/version";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const version = await getLatestReleaseVersion();
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? null;
  return <Header branch={branch} version={version}>{children}</Header>;
}
