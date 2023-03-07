import type { Handle } from '@sveltejs/kit';
import type { Provider } from '@auth/core/providers';
import { SvelteKitAuth } from '@auth/sveltekit';

import Google from '@auth/core/providers/google';
import DeepHDC from '$lib/providers/deephdc';

import { google, deep } from '$env/static/private';

export const handle = (async (e) => {
	const [GOOGLE_ID, GOOGLE_SECRET] = google.split(':');
	const [DEEP_HDC_ID, DEEP_HDC_SECRET] = deep.split(':');
	return SvelteKitAuth({
		providers: [
			Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }),
			DeepHDC({ clientId: DEEP_HDC_ID, clientSecret: DEEP_HDC_SECRET })
		] as Provider[],
		callbacks: {
			async jwt({ token, account }) {
				// Persist the OIDC access_token to the token right after signin
				if (account) {
					// console.log({ account });
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
				// console.log({ session, token });

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
