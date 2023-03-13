import type { OAuthUserConfig, OAuthConfig } from '@auth/core/providers';

export interface GenericProfile extends Record<string, unknown> {
	aud: string;
	azp: string;
	email: string;
	email_verified: boolean;
	exp: number;
	family_name: string;
	given_name: string;
	hd: string;
	iat: number;
	iss: string;
	jti: string;
	name: string;
	nbf: number;
	picture: string;
	sub: string;
	preferred_username: string;
}

export default function Generic<P extends GenericProfile>(
	options: OAuthUserConfig<P>
): OAuthConfig<P> {
	return {
		id: 'generic',
		name: 'Generic Provider',
		type: 'oidc',
		authorization: { params: { scope: 'openid profile email' } },
		checks: ['pkce', 'state'],
		...options
	};
}
