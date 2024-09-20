export async function onRequest(context) {
	const uri = new URL(context.request.url)
  const code = uri.searchParams.get('code');
	// Post github oauth code
	const url = `https://github.com/login/oauth/access_token?client_id=${context.env.GITHUB_CLIENT_ID}&client_secret=${context.env.GITHUB_CLIENT_SECRET}&code=${code}&accept=json`;
	const res = await fetch(url, {
		method: 'POST',
	});
	const text = await res.text();
	const accessToken = text
		.split('&').find((str) => str.includes('access_token'))
		.split('=')[1];
	// Get user data
	const userRes = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `token ${accessToken}`,
			'User-Agent': 'cloudflare-worker',
			Accept: 'application/vnd.github+json',
		},
	});
	const user = await userRes.json();
	// Redirect to ninjas
	return Response.redirect(`${uri.protocol}//${uri.host}/login/?id=${user.id}&access_token=${accessToken}`);
};