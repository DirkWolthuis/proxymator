// @refresh reload
import { Show, Suspense, createResource, createSignal } from 'solid-js';
import { Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title } from 'solid-start';
import './root.css';
import Header from './components/Header';
import Loader from './shared/components/Loader';
import Footer from './components/Footer';

const checkPassword = async (password: string): Promise<{ valid: boolean }> =>
	(
		await fetch(`/api/auth`, {
			method: 'POST',
			body: JSON.stringify({ password }),
		})
	).json();

export default function Root() {
	const [password, setPassword] = createSignal('');
	const [submittedPassword, setSubmittedPassword] = createSignal<string>();
	const [auth] = createResource(submittedPassword, checkPassword);

	const login = () => {
		setSubmittedPassword(password());
	};

	return (
		<Html lang="en">
			<Head>
				<Title>SolidStart - With TailwindCSS</Title>
				<Meta charset="utf-8" />
				<Meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<Body class="bg-slate-900 text-slate-50 ">
				<ErrorBoundary>
					<Suspense fallback={<Loader />}>
						<Show when={!auth() || !auth()?.valid}>
							<div class="container">
								<div class="section">
									<div class="w-full md:w-1/2 lg:w-1/3">
										<label htmlFor="password">Password</label>
										<input
											onKeyPress={(event) => event.key === 'Enter' && login()}
											name="password"
											class="mt-2 input"
											type="password"
											value={password()}
											onInput={(e) => setPassword(e.currentTarget.value)}
										/>
										<button onClick={() => login()} class="button button-primary mt-4">
											Login
										</button>
									</div>
								</div>
							</div>
						</Show>
						<Show when={auth()?.valid}>
							<div class="flex flex-col min-h-screen">
								<Header />
								<div class="container flex-grow">
									<div class="section">
										<Routes>
											<FileRoutes />
										</Routes>
									</div>
								</div>
								<Footer />
							</div>
						</Show>
					</Suspense>
				</ErrorBoundary>
				<Scripts />
			</Body>
		</Html>
	);
}
