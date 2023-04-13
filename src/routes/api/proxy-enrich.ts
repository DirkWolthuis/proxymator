import { APIEvent } from 'solid-start';
import * as cheerio from 'cheerio';
import { json } from 'solid-start';

const sanatizeText = (text: string) => {
	// Regular expression to match line breaks, tabs, and spaces
	const regex = /[\n\t]+/g;

	// Remove line breaks, tabs, and spaces from the input string
	return text.replace(regex, '').trim();
};

export async function POST({ params, request }: APIEvent) {
	const { url } = await new Response(request.body).json();

	const response = await fetch(url);
	const body = await response.text();
	const $ = cheerio.load(body);

	const name = $('.obj-title.hide-for-large-up').html();
	const price = $('.price-title').html();
	const imgUrl = $('img.prdimg-gallery').attr('src')?.replace('70X70', '720X720');
	const creatorName = $('.designerWordFlex p a').html();

	return json({ name: name && sanatizeText(name), price: price, imgUrl: imgUrl, creatorName, url: url });
}
