import type { OAuthUserConfig, OAuthConfig } from '@auth/core/providers';

export interface DeepHDCProfile extends Record<string, unknown> {
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
	organisation_name: string;
	groups: string[];
}

export default function DeepHDC<P extends DeepHDCProfile>(
	options: OAuthUserConfig<P>
): OAuthConfig<P> {
	return {
		id: 'deep-hdc',
		name: 'DEEP HDC',
		type: 'oidc',
		issuer: 'https://iam.deep-hybrid-datacloud.eu',
		authorization: {
			params: {
				scope:
					'address iam phone openid profile eduperson_scoped_affiliation email eduperson_entitlement'
			}
		},
		checks: ['pkce', 'state'],
		...options
	};
}
