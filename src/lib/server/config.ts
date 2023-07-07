import config from 'config';

export type ProviderConfig = {
	issuer: string;
	clientId: string;
	clientSecret: string;
	id?: string;
	name?: string;
};

const CONFIG = {
	// empty list of providers if not configured
	providers: config.has('providers') ? config.get('providers') : ([] as ProviderConfig[])
};

export default CONFIG;
