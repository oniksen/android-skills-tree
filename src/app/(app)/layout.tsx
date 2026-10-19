import Header from "@/shared/ui/Header";
import { getLatestReleaseVersion } from "@/lib/version";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const isPreview = process.env.VERCEL_ENV === "preview";
  const version = await getLatestReleaseVersion({ prerelease: isPreview });
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? null;
  return <Header branch={branch} version={version}>{children}</Header>;
}
