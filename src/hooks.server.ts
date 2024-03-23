import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { handle as skauth } from '$lib/auth';
import { terminalSessionStore } from '$lib/server/terminalsessions';

// hook to set cookies for login params, i.e. motley-cue endpoint, ssh hostname and port
const loginParams = (async ({ event, resolve }) => {
	// if the url contains the values in the search params, use them and set the cookies
	const mcEndpoint = event.url.searchParams.get('mcEndpoint');
	if (mcEndpoint) event.cookies.set('loginParams.mcEndpoint', mcEndpoint, { path: '/' });

	const sshHostname = event.url.searchParams.get('sshHostname');
	if (sshHostname) event.cookies.set('loginParams.sshHostname', sshHostname, { path: '/' });

	const sshPort = event.url.searchParams.get('sshPort');
	if (sshPort) event.cookies.set('loginParams.sshPort', sshPort, { path: '/' });

	return await resolve(event);
}) satisfies Handle;

// hook for checking whether the user is logged in and redirecting to the appropriate endpoint
const authcheck = (async ({ event, resolve }) => {
	// get session and set event local session
	const session = await event.locals?.auth();
	event.locals.session = session;
	console.log('session in authcheck: ', session);

	// get login params from cookies and set the event locals
	const mcEndpoint = event.cookies.get('loginParams.mcEndpoint');
	const sshHostname = event.cookies.get('loginParams.sshHostname');
	const sshPort = event.cookies.get('loginParams.sshPort');

	if (mcEndpoint && sshHostname && sshPort)
		event.locals.loginParams = {
			mcEndpoint: decodeURIComponent(mcEndpoint),
			sshHost: { hostname: decodeURIComponent(sshHostname), port: Number(sshPort) }
		};

	if (event.route.id?.startsWith('/(public)/login') && session?.user) {
		console.debug('User already logged in. Redirecting to terminal...');
		return redirect(302, '/terminal');
	}

	if (event.route.id?.startsWith('/(protected)')) {
		if (!session?.user || !event.locals.loginParams) {
			console.log('SOMETHING WENT WRONG!!!! ', event?.locals);
			return redirect(302, '/login');
		}
		const userSessions = terminalSessionStore.getAllSessionsForUser(session.user.id);
		if (userSessions.length === 0) {
			userSessions.push(terminalSessionStore.createSession(session.user.id, 'default'));
		}
		event.locals.terminalSessions = userSessions;
	}

	return await resolve(event);
}) satisfies Handle;

export const handle = sequence(skauth, loginParams, authcheck);
