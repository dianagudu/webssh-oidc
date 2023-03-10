import {
	PUBLIC_MC_ENDPOINT_URL,
	PUBLIC_SSH_HOSTNAME_FQDN,
	PUBLIC_SSH_PORT
} from '$env/static/public';

const CONFIG = {
	mcEndpoint: PUBLIC_MC_ENDPOINT_URL,
	sshHost: {
		hostname: PUBLIC_SSH_HOSTNAME_FQDN,
		port: parseInt(PUBLIC_SSH_PORT) || 22
	} as { hostname: string; port: number }
};

export default CONFIG;
