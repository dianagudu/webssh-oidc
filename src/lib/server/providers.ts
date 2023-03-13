import type { OAuth2Config } from '@auth/core/providers';
import type { Profile } from '@auth/core/types';
import Google from '@auth/core/providers/google';

import DeepHDC from '$lib/server/providers/deephdc';
import HelmholtzDev from '$lib/server/providers/helmholtz_dev';
import EgiDev from '$lib/server/providers/egi_dev';
import Generic from '$lib/server/providers/generic';

import type { ProviderConfig } from '$lib/server/config';
import CONFIG from '$lib/server/config';

const providers = CONFIG.providers.map(loadProvider) as OAuth2Config<Profile>[];

function loadProvider(provider_config: ProviderConfig) {
	const issuer = provider_config.issuer
		.trim() // remove leading and trailing whitespace
		.replace(/\/+$/, ''); // remove trailing slashes
	switch (issuer) {
		case 'https://accounts.google.com':
			return Google({
				clientId: provider_config.clientId,
				clientSecret: provider_config.clientSecret
			});
		case 'https://aai-dev.egi.eu/auth/realms/egi':
			return EgiDev({
				clientId: provider_config.clientId,
				clientSecret: provider_config.clientSecret
			});
		case 'https://iam.deep-hybrid-datacloud.eu':
			return DeepHDC({
				clientId: provider_config.clientId,
				clientSecret: provider_config.clientSecret
			});
		case 'https://login-dev.helmholtz.de/oauth2':
			return HelmholtzDev({
				clientId: provider_config.clientId,
				clientSecret: provider_config.clientSecret
			});
		default:
			console.log(`Issuer ${issuer} not supported, using generic provider.`);
			return Generic(provider_config);
	}
}

export default providers;
