import type { OAuthUserConfig, OAuthConfig } from '@auth/core/providers';

export interface SimpleSamlProfile extends Record<string, unknown> {
	aud: string;
	azp: string;
	exp: number;
	hd: string;
	iat: number;
	iss: string;
	jti: string;
	// name: string;
	// family_name: string;
	// given_name: string;
	nbf: number;
	sub: string;
	email: string;
}

export default function SimpleSaml<P extends SimpleSamlProfile>(
	options: OAuthUserConfig<P>
): OAuthConfig<P> {
	return {
		id: 'simplesaml',
		name: 'Test SimpleSaml Provider',
		type: 'oidc',
		issuer: 'https://et3.gndev.hexaa.eu',
		wellKnown: 'https://et3.gndev.hexaa.eu/.well-known/openid-configuration',
		authorization: { params: { scope: 'openid profile email' } },
		...options
	};
}
