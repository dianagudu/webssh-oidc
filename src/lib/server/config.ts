import config from 'config';

export type ProviderConfig = {
	issuer: string;
	clientId: string;
	clientSecret: string;
	id?: string;
	name?: string;
};

const CONFIG = {
	providers: config.get('providers') as ProviderConfig[]
};

export default CONFIG;
