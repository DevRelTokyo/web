import Mustache from "mustache";

export async function onRequest(context: any) {
	const { id } = context.params;
	const res = await fetch(`${context.env.PARSE_URL}/classes/_User`, {
		method: "POST",
		body: JSON.stringify({
			where: {
				username: id,
			},
			limit: 1,
			_method: "GET",
			_ApplicationId: context.env.PARSE_APP_ID,
			_JavaScriptKey: context.env.PARSE_JS_KEY,
		}),
	});
	const data = await res.json();
	const params = data.results[0];
	console.log(params);
	const res2 = await fetch(context.env.TEMPLATE_URL);
	const html = await res2.text();
  return new Response(Mustache.render(html, params), {
		headers: {
			"content-type": "text/html;charset=UTF-8",
		},
	});
};
