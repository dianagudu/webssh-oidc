export interface TerminalSessionInfo {
	id: string;
	ownerID: string;
	name: string;
}

class TSessions {
	private sessions: Map<string, TerminalSessionInfo>;

	constructor() {
		this.sessions = new Map();
	}

	createSession(ownerID: string, name: string): TerminalSessionInfo {
		const id = crypto.randomUUID();
		this.sessions.set(id, { id, ownerID, name });
		return { id, ownerID, name };
	}

	getSession(id: string): TerminalSessionInfo | undefined {
		return this.sessions.get(id);
	}

	deleteSession(id: string): void {
		this.sessions.delete(id);
	}

	getAllSessionsForUser(ownerID: string): TerminalSessionInfo[] {
		return Array.from(this.sessions.values()).filter((s) => s.ownerID === ownerID);
	}
}

export const terminalSessionStore = new TSessions();
