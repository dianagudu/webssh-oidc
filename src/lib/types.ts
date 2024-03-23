import { z } from 'zod';

const portSchema = z.preprocess(Number, z.number().int().positive().max(65535));
const hostnameSchema = z.string().trim().min(1);
const protocolSchema = z.enum(['http', 'https']).optional();

export const hostSchema = z.object({
	hostname: hostnameSchema,
	port: portSchema,
	protocol: protocolSchema
});

export type Host = z.output<typeof hostSchema>;
export const resetHost: Host = {
	hostname: '',
	port: 0
	// protocol: 'http'
};

export function isValidHost(host: Host): boolean {
	return host.hostname !== resetHost.hostname && host.port !== resetHost.port;
}

export type OPInfo = {
	scopes: string[];
	audience: string;
};

export type OP = {
	id: string;
	issuer: string;
};

export type LoginParams = {
	sshHost: Host;
	mcEndpoint: string;
};
