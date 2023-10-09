import type { OAuthUserConfig, OAuthConfig } from '@auth/core/providers';

export interface HelmholtzDevProfile extends Record<string, unknown> {
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
	voperson_id: string;
	voperson_external_affiliation: string[];
}

export default function HelmholtzDev<P extends HelmholtzDevProfile>(
	options: OAuthUserConfig<P>
): OAuthConfig<P> {
	return {
		id: 'helmholtz-dev',
		name: 'Helmholtz AAI dev',
		type: 'oidc',
		issuer: 'https://login-dev.helmholtz.de/oauth2',
		authorization: {
			params: {
				scope:
					'credentials openid profile eduperson_scoped_affiliation eduperson_unique_id sn eduperson_assurance display_name email eduperson_entitlement eduperson_principal_name single-logout voperson_external_affiliation voperson_id'
			}
		},
		checks: ['pkce', 'state'],
		async profile(profile, tokens) {
			// the profile doesn't have an email or name, try to query the userinfo endpoint
			const response = await fetch(`${this.issuer}/userinfo`, {
				headers: { Authorization: `Bearer ${tokens.access_token}` },
				method: 'GET'
			});

			const userinfo = await response.json();
			if (!response.ok) throw new Error('error');

			return {
				id: profile.sub,
				...profile,
				...userinfo
			};
		},
		...options
	};
}
