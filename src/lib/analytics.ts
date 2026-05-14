import type { ProfileView } from "./types";

const sameDay = (a: Date, b: Date) => a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);

export const analyticsSummary = (views: ProfileView[]) => {
  const now = new Date();
  const today = views.filter((view) => sameDay(new Date(view.created_at), now)).length;
  const last7 = views.filter((view) => Date.now() - new Date(view.created_at).getTime() <= 7 * 86400000).length;
  const last30 = views.filter((view) => Date.now() - new Date(view.created_at).getTime() <= 30 * 86400000).length;

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      date: key.slice(5),
      views: views.filter((view) => view.created_at.slice(0, 10) === key).length
    };
  });

  return { total: views.length, today, last7, last30, days };
};

export const groupByCount = (views: ProfileView[], key: "referrer" | "device" | "browser") => {
  const map = new Map<string, number>();
  views.forEach((view) => {
    const value = view[key] || "Direct";
    map.set(value, (map.get(value) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
};
