import { APIEvent } from 'solid-start';
import * as cheerio from 'cheerio';
import { json } from 'solid-start';

const sanatizeText = (text: string) => {
	// Regular expression to match line breaks, tabs, and spaces
	const regex = /[\n\t]+/g;

	// Remove line breaks, tabs, and spaces from the input string
	return text.replace(regex, '').trim();
};

export async function GET({ params }: APIEvent) {
	const response = await fetch(
		'https://www.myminifactory.com/es/object/3d-print-mounted-skeletons-highlands-miniatures-253233',
	);
	const body = await response.text();
	const $ = cheerio.load(body);

	const name = $('.obj-title.hide-for-large-up').html();
	const price = $('.price-title').html();
	return json({ name: name && sanatizeText(name), price: price });
}

export async function POST({ params }: APIEvent) {
	// console.log(params);
	// const response = await fetch(
	// 	'https://www.myminifactory.com/es/object/3d-print-mounted-skeletons-highlands-miniatures-253233',
	// );
	// const body = await response.text();
	// const $ = cheerio.load(body);
	// return json({ name: $('obj-title').text() });
}

export function PATCH() {
	// ...
}

export function DELETE() {
	// ...
}
