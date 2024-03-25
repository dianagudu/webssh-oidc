import type { PageServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

import { createUserSession, sessionStore } from '$lib/server/sessions';

export const load = (async (e) => {
	const data = {
		token: e.locals.session?.accessToken,
		mcEndpoint: e.url.searchParams.get('mcEndpoint'),
		sshHostname: e.url.searchParams.get('sshHostname'),
		sshPort: Number(e.url.searchParams.get('sshPort') || 22)
	};

	if (!data.token || !data.mcEndpoint || !data.sshHostname) {
		return redirect(302, '/login');
	}

	createUserSession(data.token, data.mcEndpoint, data.sshHostname, data.sshPort);

	return redirect(302, '/terminal');
}) satisfies PageServerLoad;
