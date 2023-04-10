import { APIEvent, json } from 'solid-start';

export async function GET({}: APIEvent) {}

export async function POST({ params, request }: APIEvent) {
	const { password } = await new Response(request.body).json();

	return json({ valid: password === import.meta.env.VITE_CLIENT_PASSWORD });
}

export function PATCH() {
	// ...
}

export function DELETE() {
	// ...
}
