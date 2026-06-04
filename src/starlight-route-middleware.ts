import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import type { StarlightRouteData } from '@astrojs/starlight/route-data';
import config from 'virtual:starlight/user-config';

type SidebarEntry = StarlightRouteData['sidebar'][number];
type SidebarLink = Extract<SidebarEntry, { type: 'link' }>;

function flattenSidebar(sidebar: SidebarEntry[]): SidebarLink[] {
	return sidebar.flatMap((entry) =>
		entry.type === 'group' ? flattenSidebar(entry.entries) : entry
	);
}

function normalizePath(path: string): string {
	return path.replace(/\/$/, '') || '/';
}

/** トピック用に差し替えられたサイドバーと prev/next の順序を揃える。 */
export const onRequest = defineRouteMiddleware(async (context, runNext) => {
	await runNext();

	const { starlightRoute } = context.locals;
	if (!starlightRoute.hasSidebar || !config.pagination) return;

	const links = flattenSidebar(starlightRoute.sidebar);
	const currentIndex = links.findIndex((link) => link.isCurrent);
	if (currentIndex === -1) return;

	const prevLink = links[currentIndex - 1];
	const nextLink = links[currentIndex + 1];

	starlightRoute.pagination = {
		prev: prevLink ?? undefined,
		next: nextLink ?? undefined,
	};

	// starlight-sidebar-topics と同様、トピック先頭/末尾では prev/next を非表示にする
	const first = links[0];
	const last = links[links.length - 1];
	const currentPath = normalizePath(context.url.pathname);

	if (first && normalizePath(first.href) === currentPath) {
		starlightRoute.pagination.prev = undefined;
	}
	if (last && normalizePath(last.href) === currentPath) {
		starlightRoute.pagination.next = undefined;
	}
});
