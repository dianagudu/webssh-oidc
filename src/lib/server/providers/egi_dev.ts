import type { OAuthUserConfig, OAuthConfig } from '@auth/core/providers';

export interface EgiDevProfile extends Record<string, unknown> {
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
	eduperson_unique_id: string;
	eduperson_principal_name: string;
	eduperson_entitlement: string[];
	eduperson_assurance: string[];
	eduperson_scoped_affiliation: string[];
}

export default function EgiDev<P extends EgiDevProfile>(
	options: OAuthUserConfig<P>
): OAuthConfig<P> {
	return {
		id: 'egi-dev',
		name: 'EGI dev',
		type: 'oidc',
		issuer: 'https://aai-dev.egi.eu/auth/realms/egi',
		authorization: {
			params: {
				scope:
					'openid profile email eduperson_entitlement eduperson_scoped_affiliation eduperson_unique_id'
			}
		},
		checks: ['pkce', 'state'],
		...options
	};
}
