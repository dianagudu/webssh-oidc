// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { UserSession } from '$lib/server/sessions';

interface AuthSession {
	user: {
		id: string;
		name?: string | null;
		email?: string | null;
		preferred_username?: string | null;
	};
	expiresAt: number;
	accessToken: string;
	profile: { [key: string]: string | number | boolean | string[] };
	userinfo: { [key: string]: string | number | boolean | string[] };
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: null | AuthSession;
			userSession: UserSession;
		}
		// interface PageData {}
		// interface Platform {}
	}
}
