import type { OAuthUserConfig, OAuthConfig } from '@auth/core/providers';

export interface WlcgProfile extends Record<string, any> {
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
	eduperson_scoped_affiliation: string;
	eduperson_unique_id: string;
	email: string;
	email_verified: string;
	family_name: string;
	given_name: string;
	name: string;
	preferred_username: string;

	wlcg: {
		groups: string[];
	};

	storage: {
		create: string;
		modify: string;
		read: string;
		stage: string;
	};

	compute: {
		create: string;
		modify: string;
		read: string;
		cancel: string;
	};
}

export default function Wlcg<P extends WlcgProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
	return {
		id: 'wlcg',
		name: 'WLCG',
		type: 'oidc',
		issuer: 'https://wlcg.cloud.cnaf.infn.it',
		authorization: {
			params: {
				scope:
					// 'openid profile email eduperson_entitlement eduperson_scoped_affiliation eduperson_assurance wlcg wlcg.groups'
					'openid profile compute.cancel compute.create compute.modify compute.read eduperson_assurance eduperson_entitlement eduperson_scoped_affiliation email entitlements offline_access openid profile storage.create:/ storage.modify:/ storage.read:/ storage.stage:/ wlcg wlcg.groups'
			}
		},
		checks: ['pkce', 'state'],
		...options
	};
}
