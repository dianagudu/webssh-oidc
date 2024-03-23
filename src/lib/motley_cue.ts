type Fetch = (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>;

export const loadOps = async (fetch: Fetch, mcEndpoint: URL) => {
	const url = new URL(mcEndpoint);
	url.pathname += 'info';

	const response = await fetch(url);
	if (response.ok) {
		return await response
			.json()
			.then((json) => json.supported_OPs.map((op: string) => op.trim().replace(/\/+$/, '')));
	} else {
		throw new Error(`Could not get info from ${url} (${response.status} ${response.statusText})`);
	}
};

export const loadOpInfo = async (fetch: Fetch, mcEndpoint: URL, opUrl: string) => {
	const url = new URL(mcEndpoint);
	url.pathname += 'info/op';
	url.searchParams.set('url', opUrl);

	const response = await fetch(url);
	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(
			`Could not get info for OP ${opUrl} (${response.status} ${response.statusText})`
		);
	}
};

export const deployUser = async (fetch: Fetch, mcEndpoint: URL, accessToken: string) => {
	const url = new URL(mcEndpoint);
	url.pathname += 'user/deploy';

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	return await response.json();
};

export const getUserStatus = async (fetch: Fetch, mcEndpoint: URL, accessToken: string) => {
	const url = new URL(mcEndpoint);
	url.pathname += 'user/get_status';
	console.debug('------ ', url);

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	return await response.json();
};

export const getSshUser = async (fetch: Fetch, mcEndpoint: URL, accessToken: string) => {
	let status = await getUserStatus(fetch, mcEndpoint, accessToken);
	console.debug({ status });
	if (status.error) {
		console.error(
			status.error +
				(`: ${status.error_description}` || `: ${status.error_details?.check_details}` || '')
		);
		throw new Error('Failed to get user status from motley_cue');
	} else if (status.state === 'not_deployed') {
		let deployment = await deployUser(fetch, mcEndpoint, accessToken);
		if (deployment.error) {
			console.error(
				deployment.error +
					(`: ${deployment.error_description}` ||
						`: ${deployment.error_details?.check_details}` ||
						'')
			);
			throw new Error('Failed to deploy user');
		} else if (deployment.state === 'deployed') {
			return { username: deployment.credentials.ssh_user };
		}
	} else {
		return { username: status.message.split(' ')[1] };
	}
};
