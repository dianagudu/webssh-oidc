import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params, url }) => {
	const currentTerminalSession = locals.userSession.terminals.find((s) => s.id === params.id);
	const wsUrl = `${url.protocol === 'https:' ? 'wss' : 'ws'}://${url.hostname}:8445/ws`;

	return {
		terminalId: params.id,
		currentTerminalSession: currentTerminalSession,
		wsUrl: wsUrl
	};
}) satisfies PageServerLoad;
