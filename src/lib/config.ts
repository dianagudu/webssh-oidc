let CONFIG = {
	mcEndpoint: '',
	sshHost: { hostname: '', port: 0 } as { hostname: string; port: number }
};

try {
	const myEnv = await import('$env/static/public');
	CONFIG = {
		mcEndpoint: myEnv.PUBLIC_MC_ENDPOINT_URL,
		sshHost: {
			hostname: myEnv.PUBLIC_SSH_HOSTNAME_FQDN,
			port: parseInt(myEnv.PUBLIC_SSH_PORT)
		} as { hostname: string; port: number }
	};
} catch (e) {
	console.error(e);
}

export default CONFIG;
