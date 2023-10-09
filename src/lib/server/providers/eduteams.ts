import type { OAuthUserConfig, OAuthConfig } from '@auth/core/providers';

export interface eduTEAMSProfile extends Record<string, any> {
	aud: string;
	azp: string;
	exp: number;
	iat: number;
	iss: string;
	jti: string;
	nbf: number;
	sub: string;

	auth_time: number;
	typ: string;
	session_state: string;
	sid: string;
	authenticating_authority: string;

	acr: string;
	cert_entitlement: string;
	eduperson_assurance: string;
	eduperson_entitlement: string;
	voperson_scoped_affiliation: string;
	voperson_unique_id: string;
	email: string;
	email_verified: string;
	family_name: string;
	given_name: string;
	name: string;
	orcid: string;
	preferred_username: string;
	ssh_public_key: string;
	voperson_id: string;
	voperson_verified_email: string;
}

export default function eduTEAMS<P extends eduTEAMSProfile>(
	options: OAuthUserConfig<P>
): OAuthConfig<P> {
	return {
		id: 'eduteams',
		name: 'eduTEAMS',
		type: 'oidc',
		issuer: 'https://proxy.eduteams.org',
		authorization: {
			params: {
				scope:
					'openid profile email eduperson_entitlement voperson_scoped_affiliation voperson_unique_id'
			}
		},
		checks: ['pkce', 'state'],
		...options
	};
}
