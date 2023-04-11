// @refresh reload
import { Show, Suspense, createResource, createSignal } from 'solid-js';
import { Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title } from 'solid-start';
import './root.css';
import Header from './components/Header';

const checkPassword = async (password: string): Promise<{ valid: boolean }> =>
	(
		await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth`, {
			method: 'POST',
			body: JSON.stringify({ password }),
		})
	).json();

export default function Root() {
	const [password, setPassword] = createSignal('');
	const [auth, setAuth] = createSignal<boolean>();

	const login = async () => {
		try {
			const res = await checkPassword(password());
			setAuth(res.valid);
		} catch {}
	};
	return (
		<Html lang="en">
			<Head>
				<Title>SolidStart - With TailwindCSS</Title>
				<Meta charset="utf-8" />
				<Meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<Body class="bg-slate-900 text-slate-50">
				<Suspense>
					<ErrorBoundary>
						<Header></Header>
						<Show when={!auth()}>
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
						<Show when={auth()}>
							<Routes>
								<FileRoutes />
							</Routes>
						</Show>
					</ErrorBoundary>
				</Suspense>
				<Scripts />
			</Body>
		</Html>
	);
}
