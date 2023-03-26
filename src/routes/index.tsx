import ProxyList from '~/components/ProxyList';
import Sidebar from '~/components/Sidebar';

export default function Home() {
	return (
		<div class="container">
			<div class="section">
				<div class="flex space-x-16">
					<div class="w-5/12">
						<Sidebar></Sidebar>
					</div>
					<main>
						<ProxyList />
					</main>
				</div>
			</div>
		</div>
	);
}
