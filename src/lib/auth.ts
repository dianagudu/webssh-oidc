import { SvelteKitAuth } from '@auth/sveltekit';
import type { Action, Handle } from '@sveltejs/kit';

import providers from '$lib/server/providers';
import { AUTH_SECRET } from '$env/static/private';

// hook for auth.js oidc authentication
export const { handle, signIn, signOut } = SvelteKitAuth({
	secret: AUTH_SECRET,
	trustHost: true,
	providers: providers,
	callbacks: {
		async jwt({ token, account }) {
			// Persist the OIDC access_token to the token right after signin
			if (account) {
				// check if access token is present
				if (!account.access_token) {
					throw new Error('Access token not present');
				}
				token.accessToken = account.access_token;
				if (account.expires_in) {
					token.expiresAt = Date.now() + account.expires_in;
				}
			}
			return token;
		},
		async session({ session, token }) {
			// Send properties to the client, like an access_token from a provider.
			const new_session = {
				...session,
				accessToken: token.accessToken,
				expiresAt: token.expiresAt
			};
			return new_session;
		}
	}
}) satisfies { handle: Handle; signIn: Action; signOut: Action };

declare module '@auth/core/types' {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			preferred_username?: string | null;
		};
		expiresAt: number;
		accessToken: string;
	}
}

declare module '@auth/core/jwt' {
	interface JWT {
		accessToken: string;
		expiresAt: number;
	}
}
