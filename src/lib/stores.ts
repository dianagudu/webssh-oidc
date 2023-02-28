import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';
import type { LoginParams } from './types';

function fromLocalStorage<T>(key: string, initialValue: T): () => T {
	if (browser) {
		const stored = window.localStorage.getItem(key);
		if (stored) {
			return () => JSON.parse(stored);
		}
	}
	return () => initialValue;
}

function toLocalStorage<T>(store: Writable<T>, key: string): void {
	if (browser) {
		store.subscribe((value) => {
			const json = JSON.stringify(value);

			window.localStorage.setItem(key, json);
		});
	}
}

export const uiBlock = writable<boolean>(true);

export const loginParams = writable<LoginParams | null>(fromLocalStorage('loginParams', null)());
toLocalStorage(loginParams, 'loginParams');

export const errorMessage = writable<string>();
