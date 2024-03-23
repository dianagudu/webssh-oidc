// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { TerminalSessionInfo } from '$lib/server/terminalsessions';
import type { LoginParams } from '$lib/types';

interface AuthSession {
	user: {
		id: string;
		name?: string | null;
		email?: string | null;
		preferred_username?: string | null;
	};
	expiresAt: number;
	accessToken: string;
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: null | AuthSession;
			terminalSessions: TerminalSessionInfo[];
			loginParams: LoginParams;
		}
		// interface PageData {}
		// interface Platform {}
	}
}
