export async function onRequest(context) {
	const json = await context.request.json();
	const body = `token=xoxp-14621318070-14615577188-1049012910006-db96d2159f5a7abd067399b76a09170c&email=${json.email}&resend=true`;
	console.log(body);
	const response = await fetch('https://slack.com/api/users.admin.invite', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body,
	});
	return new Response(response.body);
}
