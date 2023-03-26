import { APIEvent } from 'solid-start';
import * as cheerio from 'cheerio';

export async function GET({ params }: APIEvent) {
	console.log(params);
	const response = await fetch(
		'https://www.myminifactory.com/object/3d-print-skeleton-warriors-with-swords-unit-highlands-miniatures-253257',
	);

	const body = await response.text();
	const $ = cheerio.load(body);
	return new Response($('title').text());
}

export function POST() {
	// ...
}

export function PATCH() {
	// ...
}

export function DELETE() {
	// ...
}
