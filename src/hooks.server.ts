import type { Provider } from '@auth/core/providers';
import type { Handle } from '@sveltejs/kit';
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
			async jwt({ token, account, profile }) {
				// Persist the OIDC access_token to the token right after signin
				if (account) {
					token.access_token = account.access_token;
				}
				if (profile) {
					token.profile = profile;
				}
				return token;
			},
			async session({ session, token }) {
				// Send properties to the client, like an access_token from a provider.
				if (token) {
					session.access_token = token.access_token;
					session.profile = token.profile;
				}
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
		expires: string;
		access_token?: string;
		profile?: unknown;
	}
}

declare module '@auth/core/jwt' {
	interface JWT {
		access_token?: string;
		profile?: unknown;
	}
}
