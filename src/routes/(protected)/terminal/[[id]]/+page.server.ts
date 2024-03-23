import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	console.debug('[page server load] ', locals);
	if (!locals.session?.accessToken) {
		return error(403, new Error('Unauthorized'));
	}

	const currentTerminalSession = locals.terminalSessions.find((s) => s.id === params.id);

	return {
		terminalId: params.id,
		userId: locals.session?.user?.id,
		accessToken: locals.session?.accessToken,
		terminalSessions: locals.terminalSessions,
		currentTerminalSession: currentTerminalSession,
		loginParams: locals.loginParams
	};
}) satisfies PageServerLoad;
