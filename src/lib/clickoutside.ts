export function clickOutside(node: Node) {
	// the node has been mounted in the DOM

	window.addEventListener('click', handleClick);

	function handleClick(e: { target: unknown }) {
		if (!node.contains(e.target as Node)) {
			node.dispatchEvent(new CustomEvent('outsideclick'));
		}
	}

	return {
		destroy() {
			// the node has been removed from the DOM
			window.removeEventListener('click', handleClick);
		}
	};
}
