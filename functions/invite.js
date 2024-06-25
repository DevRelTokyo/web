export async function onRequest(context) {
	const json = await context.request.json();
	const body = `token=${context.env.token}&email=${json.email}&resend=true`;
	const response = await fetch('https://slack.com/api/users.admin.invite', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body,
	});
	return new Response(response.body);
}
