import { Component } from 'solid-js';
import { FaBrandsDiscord, FaBrandsGithub } from 'solid-icons/fa';

const Footer: Component<{}> = (props) => {
	return (
		<div class="py-4 border-t border-slate-700">
			<div class="container">
				<div class="flex gap-4">
					<a href={import.meta.env.VITE_DISCORD_LINK}>
						<FaBrandsDiscord />
					</a>
					<a href={import.meta.env.VITE_GITHUB_LINK}>
						<FaBrandsGithub />
					</a>
				</div>
			</div>
		</div>
	);
};

export default Footer;
