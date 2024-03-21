document.addEventListener('DOMContentLoaded', (e) => {
  const ele = document.querySelector('#slack-invite');
  if (!ele) return;
  ele.onclick = async function(e) {
    const email = document.querySelector('#email').value;
    e.preventDefault();
    const res = await fetch('/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    const json = await res.json();
    if (json.ok) {
      alert('招待状を送信しました。メールボックスを確認してください。ご参加を楽しみにお待ちします！');
      document.querySelector('#email').value = '';
    } else {
      alert(`エラーが発生しました： ${res.body} こちらをTwitterで @DevReljp までご連絡ください`);
    }
  };
});
