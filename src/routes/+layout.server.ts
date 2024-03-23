import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = (await event.locals?.auth()) ?? null;
	console.log('session in layout load: ', session);

	return {
		session: session
	};
};
