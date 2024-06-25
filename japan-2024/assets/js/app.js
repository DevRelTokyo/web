const url = 'https://script.google.com/macros/s/AKfycbz8N3l5NGpVsznuzbJVS4pw9WsDYqS2CDfJqOqC2ocsYM9ruE25QhJM_KpmrWXpzneAbw/exec';

document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('.cfp').style.display = 'none';

	document.querySelector('.entry-proposal').addEventListener('click', () => {
		document.querySelector('.cfp').style.display = '';
	});

	const restore = () => {
		for (const name of ['save-1', 'save-2', 'save-3']) {
			document.querySelectorAll(`.${name}`).forEach(dom => {
				for (const event of ['keyup', 'change']) {
					dom.addEventListener(event, e => save(name, e.target));
				}
			});
			const params = JSON.parse(localStorage.getItem(name) || '{}');
			for (const key in params) {
				const ele = document.querySelector(`form [name="${key}"]`);
				if (ele.type === 'checkbox') {
					ele.checked = params[key];
				} else {
					ele.value = params[key];
				}
			}
		}

		const button = document.querySelector('.cfp button');
		button.disabled = false;
		button.innerText = 'プロポーザルを提出する';
	};
	restore();
	const save = (name, target) => {
		const params = JSON.parse(localStorage.getItem(name) || '{}');
		if (target.type === 'checkbox') {
			params[target.name] = target.checked;
		} else {
			params[target.name] = target.value;
		}
		localStorage.setItem(name, JSON.stringify(params));
	};

	const submit = async (form, action, name = 'proposals') => {
		const params = {};
		for (const ele of form.elements) {
			if (ele.name === '') continue;
			params[ele.name] = ele.value;
		}
		try {
			const button = form.querySelector('button');
			button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 送信中...`;
			button.disabled = true;
			const res = await fetch(`${url}?action=${action}&name=${name}`, {
				method: 'POST',
				body: JSON.stringify(params),
				mode: 'no-cors',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			form.querySelector('.alert-warning').style.display = 'none';
			form.querySelector('.alert-primary').style.display = '';
			form.reset();
		} catch (e) {
			form.querySelector('.alert-primary').style.display = 'none';
			form.querySelector('.alert-warning').style.display = '';
			form.querySelector('.error').innerHTML = e.message;
		}
	};

	document.querySelector('.cfp form').addEventListener('submit', async (e) => {
		e.preventDefault();
		await submit(e.target, 'proposal_post');
		localStorage.removeItem('save-1');
		restore();
	});

	document.querySelector('.contact form').addEventListener('submit', async (e) => {
		e.preventDefault();

		await submit(e.target, 'contact', 'contacts');
		e.target.querySelector('button').innerHTML = '送信する';
	});
});
