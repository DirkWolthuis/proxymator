import { APIEvent } from 'solid-start';
import * as cheerio from 'cheerio';
import { json } from 'solid-start';

export async function GET({ params }: APIEvent) {
	return new Response('test');
}

export async function POST({ params }: APIEvent) {
	console.log(params);
	const response = await fetch(
		'https://www.myminifactory.com/object/3d-print-skeleton-warriors-with-swords-unit-highlands-miniatures-253257',
	);

	const body = await response.text();
	const $ = cheerio.load(body);
	return json({ test: $('title').text() });
}

export function PATCH() {
	// ...
}

export function DELETE() {
	// ...
}
