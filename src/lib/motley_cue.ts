type Fetch = (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>;

export const loadOps = async (fetch: Fetch, mcEndpoint: URL) => {
	const url = new URL(mcEndpoint);
	url.pathname = '/info';

	const response = await fetch(url);
	if (response.ok) {
		return await response.json().then((json) => json.supported_OPs);
	} else {
		throw new Error(`Could not get info from ${url} (${response.status} ${response.statusText})`);
	}
};

export const loadOpInfo = async (fetch: Fetch, mcEndpoint: URL, opUrl: string) => {
	const url = new URL(mcEndpoint);
	url.pathname = '/info/op';
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
	url.pathname = '/user/deploy';

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	return await response.json();
};

export const getUserStatus = async (fetch: Fetch, mcEndpoint: URL, accessToken: string) => {
	const url = new URL(mcEndpoint);
	url.pathname = '/user/get_status';

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	return await response.json();
};
