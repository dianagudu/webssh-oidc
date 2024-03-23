import { getSshUser } from '$lib/motley_cue';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, data }) => {
	const username = await getSshUser(fetch, new URL(data.loginParams.mcEndpoint), data.accessToken)
		.then((sshUser) => sshUser?.username || '')
		.catch((e) => {
			console.error(e);
			return '';
		});

	return {
		...data,
		username: username
	};
}) satisfies PageLoad;
