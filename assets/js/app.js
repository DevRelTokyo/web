const applicationKey = '3a51faa420703796afeb6cba762d237aaa3135e5a5234fdaf5595409bb338849';
const clientKey = 'ac2c30ebdf22d5856f1225952f42dbc10fd8a32a82c999e3ea5f0e7f64d80398';
const ncmb = new NCMB(applicationKey, clientKey);
document.addEventListener('DOMContentLoaded', (e) => {
  const ele = document.querySelector('#slack-invite');
  if (ele) {
    ele.onclick = async function(e) {
      const email = document.querySelector('#email').value;
      console.log(email)
      e.preventDefault();
      const res = await ncmb.Script
        .data({
          'email': email
        })
        .exec("POST", "invite.js")
      const json = JSON.parse(res.body)
      if (json.ok) {
        alert('招待状を送信しました。メールボックスを確認してください。ご参加を楽しみにお待ちします！');
        document.querySelector('#email').value = '';
      } else {
        alert(`エラーが発生しました： ${res.body} こちらをTwitterで @DevReljp までご連絡ください`);
      }
    };
  }
});
