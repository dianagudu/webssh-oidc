import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSshUser } from '$lib/motley_cue';
import { WS_URL } from '$env/static/private';

export const load = (async ({ locals, params }) => {
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

	const currentTerminalSession = locals.userSession.terminals.find((s) => s.id === params.id);

	return {
		terminalId: params.id,
		userId: locals.session?.user?.id,
		accessToken: locals.session?.accessToken,
		terminalSessions: locals.userSession.terminals,
		currentTerminalSession: currentTerminalSession,
		userSession: locals.userSession,
		username: username,
		wsUrl: WS_URL
	};
}) satisfies PageServerLoad;
