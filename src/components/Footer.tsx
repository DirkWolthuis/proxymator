import { Component } from 'solid-js';
import { FaBrandsDiscord } from 'solid-icons/fa';

const Footer: Component<{}> = (props) => {
	return (
		<div class="py-4 border-t border-slate-700">
			<div class="container">
				<a href={import.meta.env.VITE_DISCORD_LINK}>
					<FaBrandsDiscord />
				</a>
			</div>
		</div>
	);
};

export default Footer;
