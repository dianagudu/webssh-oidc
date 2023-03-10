import type { Handle } from '@sveltejs/kit';
import { SvelteKitAuth } from '@auth/sveltekit';

import providers from '$lib/server/providers';

export const handle = (async (e) => {
	return SvelteKitAuth({
		// secret: generate one??,
		trustHost: true,
		providers: providers,
		callbacks: {
			async jwt({ token, account }) {
				// Persist the OIDC access_token to the token right after signin
				if (account) {
					token.accessToken = account.access_token;
					if (account.expires_in) {
						token.expiresAt = Date.now() + account.expires_in;
					}
				}
				return token;
			},
			async session({ session, token }) {
				// Send properties to the client, like an access_token from a provider.
				session.accessToken = token.accessToken;
				session.expiresAt = token.expiresAt;

				// if (session.expiresAt && session.expiresAt < Date.now()) {
				// 	session.accessToken = undefined;
				// }
				return session;
			}
		}
	})(e);
}) satisfies Handle;

declare module '@auth/core/types' {
	interface Session {
		user?: {
			id: string;
			name?: string | null;
			email?: string | null;
			preferred_username?: string | null;
		};
		expiresAt?: number;
		accessToken?: string;
	}
}

declare module '@auth/core/jwt' {
	interface JWT {
		accessToken?: string;
		expiresAt?: number;
	}
}
