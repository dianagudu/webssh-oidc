import type { PageLoad } from './$types';

export const load = (({ data }) => {
	return {
		providers: data?.providers || {}
	};
}) satisfies PageLoad;
