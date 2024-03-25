import type { RequestEvent, RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

import { getUserSession } from '$lib/server/sessions';

type JSONValue = string | number | boolean | JSONObject | JSONArray | null;
type JSONObject = { [member: string]: JSONValue };
type JSONArray = JSONValue[];

const API = {
	create: async (e: RequestEvent, { name }: { name: string }) => {
		const newTerminalStuff = {
			id: crypto.randomUUID(),
			name: name
		};

		const session = getUserSession(e.locals.userSession.token);
		if (!session) return { success: false, data: null };

		session.terminals.push(newTerminalStuff);
		return { success: true, data: newTerminalStuff };
	},

	delete: async (e: RequestEvent, { id }: { id: string }) => {
		const session = getUserSession(e.locals.userSession.token);
		if (!session) return { success: false, data: null };

		const terminalIndex = session.terminals.findIndex((t) => t.id === id);
		if (terminalIndex === -1) return { success: false, data: null };

		session.terminals.splice(terminalIndex, 1);
		return { success: true, data: id };
	}
} satisfies Record<string, (e: RequestEvent, ...args: any[]) => Promise<JSONValue>>;

function actionInAPI(action: string): action is APIEndpoints {
	return action in API;
}

export const POST: RequestHandler = async (e) => {
	const action = e.params.action;
	if (!actionInAPI(action)) return json({ success: false });
	const raw = await e.request.text();
	const args = JSON.parse(raw) as unknown[];

	// @ts-expect-error We know for sure that we want to spread the args
	const result = await API[action](e, ...args);
	return json({ success: true, data: result, action: action });
};

export type APIEndpoints = keyof typeof API;
export type APIResponses = {
	[action in APIEndpoints]: Awaited<ReturnType<(typeof API)[action]>>;
};

type OmitFirstArg<F> = F extends (e: RequestEvent, ...args: infer P) => infer R
	? (...args: P) => R
	: never;

export type APIParams = {
	[action in APIEndpoints]: Parameters<OmitFirstArg<(typeof API)[action]>>;
};
