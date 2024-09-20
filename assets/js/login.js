Parse.serverURL = 'https://parseapi.back4app.com';
Parse.initialize('kqIlpdKL1WitRS7pQpNTRxyWKPYcbGyheo2XTXgg', 'pt8AICpe2M0HrN6Gyu5ATc12v5wDzHzCSv358N5M');
document.addEventListener('DOMContentLoaded', async (e) => {
  const auth = document.querySelector('#auth');
  if (auth) {
    auth.addEventListener('click', (e) => {
      e.preventDefault();
      location.href = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=Ov23limTnGqdjvVnOota';
    });
  }
  const accessToken = url('?access_token');
  const id = url('?id');
  if (accessToken && id) {
    const user = await Parse.User.logInWith('github', {
      authData: {
        id,
        access_token: accessToken,
      },
    });
    location.href = '/my/';
  }
});
