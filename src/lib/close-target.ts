export interface CloseTarget {
  href: string;
  label: string;
}

const CATEGORY_PAGE = /^\/tree\/([^/]+)\/category\/([^/]+)$/;
const CATEGORY_STUDY = /^\/tree\/([^/]+)\/category\/([^/]+)\/study$/;
const SKILL_STUDY = /^\/tree\/([^/]+)\/skill\/([^/]+)\/study$/;

const QUIZ = /^\/quiz$/;

/**
 * Routes that show the app-level close control. The button lives in the app
 * header, to the right of the panel with the streak and crystals.
 *
 * Skill study currently has no materials, so it falls back to the tree; if a
 * skill material is added, point it at the skill's category block.
 */
export function closeTargetFor(pathname: string): CloseTarget | null {
  const path = (pathname || "/").split("?")[0].replace(/\/+$/, "") || "/";

  if (QUIZ.test(path)) {
    return { href: "/tree/junior", label: "Назад к дереву" };
  }

  const category = CATEGORY_PAGE.exec(path);
  if (category) {
    return { href: `/tree/${category[1]}`, label: "Назад к дереву" };
  }

  const categoryStudy = CATEGORY_STUDY.exec(path);
  if (categoryStudy) {
    return {
      href: `/tree/${categoryStudy[1]}/category/${categoryStudy[2]}`,
      label: "Назад к категории",
    };
  }

  const skillStudy = SKILL_STUDY.exec(path);
  if (skillStudy) {
    return { href: `/tree/${skillStudy[1]}`, label: "Назад к дереву" };
  }

  return null;
}
