import { getSshUser } from '$lib/motley_cue';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.session?.accessToken) {
		return error(403, new Error('Unauthorized'));
	}

	const session = locals.userSession;

	const username = await getSshUser(fetch, new URL(session.mcEndpoint), session.token)
		.then((sshUser) => sshUser?.username ?? '')
		.catch((e) => {
			console.error(e);
			return '';
		});

	return {
		userId: locals.session?.user?.id,
		accessToken: locals.session?.accessToken,
		terminalSessions: locals.userSession.terminals,
		userSession: locals.userSession,
		username: username
	};
}) satisfies LayoutServerLoad;
