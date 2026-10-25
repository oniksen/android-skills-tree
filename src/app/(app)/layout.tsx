import Header from "@/shared/ui/Header";
import { getDevelopmentVersion, getLatestReleaseVersion } from "@/lib/version";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const isPreview = process.env.VERCEL_ENV === "preview";
  const isLocal = !process.env.VERCEL_ENV;
  const version = isLocal
    ? getDevelopmentVersion()
    : await getLatestReleaseVersion({ prerelease: isPreview });
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? null;
  return <Header branch={branch} version={version}>{children}</Header>;
}
