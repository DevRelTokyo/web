import { Component, State, h, Element } from '@stencil/core';
import Parse from 'parse/dist/parse.min.js';
import "bootstrap/dist/css/bootstrap.min.css";
import { UserJson } from './type';

Parse.serverURL = 'https://parseapi.back4app.com';
Parse.initialize('kqIlpdKL1WitRS7pQpNTRxyWKPYcbGyheo2XTXgg', 'pt8AICpe2M0HrN6Gyu5ATc12v5wDzHzCSv358N5M');
@Component({
  tag: 'parse-form',
  styleUrl: 'my-component.scss',
  shadow: true,
})


export class MyComponent {

  // @Prop() sessionId: string;
  @State() obj: Parse.Object | null = null;
  socials: string[] = ['X/Twitter', 'Facebook', 'GitHub', 'LinkedIn', 'Instagram', 'Qiita', 'Zenn', 'Medium', 'note', 'Speaker Deck', 'SlideShare', 'YouTube', 'Twitch', 'Discord', 'WhatsApp', 'WeChat', 'Blog'];
  @State() json: UserJson | null = null;
  @State() message: {type: string, message: string} | null = null;
  @Element() el;

  connectedCallback() {
    this.setUser();
  }

  showMessage = (type: string, message: string) => {
    this.message = {type, message};
    setTimeout(() => {
      this.message = null;
    }, 3000);
  }

  async setUser() {
    if (!Parse.User.current()) {
      /*
      this.obj = new Parse.User();
      this.obj.set('name', {ja: ''});
      this.obj.set('profile', {ja: ''});
      this.obj.set('title', {ja: ''});
      this.obj.set('company', {ja: ''});
      this.obj.set('socials', []);
      this.json = this.obj.toJSON();
      */
      return;
    }
    try {
      const query = new Parse.Query('User');
      query.equalTo('objectId', Parse.User.current().id);
      const user = await query.first();
      this.obj = user;
    } catch (e) {
      await Parse.User.logOut();
      this.obj = null;
      return;
    }
    if (Object.keys(this.obj.get('name')).length === 0) this.obj.set('name', {ja: ''});
    if (Object.keys(this.obj.get('profile')).length === 0) this.obj.set('profile', {ja: ''});
    if (Object.keys(this.obj.get('title')).length === 0) this.obj.set('title', {ja: ''});
    if (Object.keys(this.obj.get('company')).length === 0) this.obj.set('company', {ja: ''});
    if (!this.obj.get('socials')) this.obj.set('socials', []);
    this.json = this.obj.toJSON();
  }

  name = (key: string) => {
    switch (key) {
      case 'ja':
        return '名前';
    }
    return 'Name';
  }

  company = (key: string) => {
    switch (key) {
      case 'ja':
        return '会社・所属団体';
    }
    return 'Company';
  }

  title = (key: string) => {
    switch (key) {
      case 'ja':
        return '肩書き';
    }
    return 'Title';
  }

  profile = (key: string) => {
    switch (key) {
      case 'ja':
        return 'プロフィール';
    }
    return 'Profile';
  }

  language = (key: string) => {
    switch (key) {
      case 'ja':
        return '言語';
    }
    return 'Language';
  }

  languageType = (key: string) => {
    switch (key) {
      case 'ja':
        return '日本語';
    }
    return 'English';
  }

  addProfile = () => {
    this.json = {...this.json, name: {...this.json.name, '': ''}};
    this.json = {...this.json, title: {...this.json.title, '': ''}};
    this.json = {...this.json, profile: {...this.json.profile, '': ''}};
    this.json = {...this.json, company: {...this.json.company, '': ''}};
  }

  openFile = () => {
    (this.el.shadowRoot.querySelector('#photo') as HTMLInputElement).click();
  }

  changePhoto = (e: Event) => {
    const file = (e.target as HTMLInputElement).files[0];
    if (!file) return;
    this.obj.set('photo', new Parse.File(file.name, file));
    this.json = {...this.json, photo: URL.createObjectURL(file)};
  }

  changeLanguage = (key: string, e: Event) => {
    const value = (e.target as HTMLSelectElement).value;
    Object.keys(this.json.name).forEach((k) => {
      if (k !== key) return;
      this.json.name[value] = this.json.name[k];
      this.json.title[value] = this.json.title[k];
      this.json.profile[value] = this.json.profile[k];
      this.json.company[value] = this.json.company[k];
      delete this.json.name[k];
      delete this.json.title[k];
      delete this.json.profile[k];
      delete this.json.company[k];
    });
    this.json = {...this.json}
  };

  addSocial = () => {
    this.json = {...this.json, socials: [...this.json.socials, {type: '', url: ''}]};
  };

  save = async (e: Event) => {
    e.preventDefault();
    Object.keys(this.json).forEach((key) => {
      if (['sessionToken', 'ACL', 'authData', 'createdAt', 'updatedAt', 'objectId', 'photo'].includes(key)) return;
      this.obj.set(key, this.json[key]);
    });
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    acl.setWriteAccess(Parse.User.current(), true);
    this.obj.setACL(acl);
    try {
      await this.obj.save();
      this.showMessage('success', '保存しました');
    } catch (e) {
      this.showMessage('error', e.message);
      return;
    }
  };

  photoUrl = (photo: {url: string} | string) => {
    if (typeof photo === 'string') return photo;
    return photo.url;
  };

  auth = async () => {
    location.href = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=Ov23limTnGqdjvVnOota';
  };

  render() {
    return (
      <div>
        { this.obj ?
        (
          <form>
            <div class="space-y-10">
              <div class="border-b border-gray-900/10 pb-12">
                <div class="grid grid-cols-6">
                  <div class="col-span-1">
                    <h2 class="text-base font-semibold leading-7 text-gray-900">ユーザー名</h2>
                  </div>
                  <div class="col-span-5">
                    <div class="mt-2 w-full">
                      <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">https://devrel.tokyo/ninjas/</span>
                        <input
                          type="text"
                          class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          value={this.json.username}
                          placeholder="janesmith"
                          onChange={(e: KeyboardEvent) => this.json = {...this.json, username: (e.target as HTMLInputElement).value}}
                        />
                      </div>
                    </div>
                    <p class="mt-1 text-sm leading-6 text-gray-600">ユーザー名はユニークです<br />
                    https://devrel.tokyo/ninjas/{this.json.username} にて公開されます
                    </p>
                  </div>
                </div>
                <div class="grid grid-cols-6">
                  <div class="col-span-1">
                    <h2 class="text-base font-semibold leading-7 text-gray-900">メールアドレス</h2>
                  </div>
                  <div class="col-span-5">
                    <div class="mt-2 w-full">
                      <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                        <input
                          type="email"
                          class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          value={this.json.email}
                          placeholder="info@devrel.tokyo"
                          onChange={(e: KeyboardEvent) => this.json.email = (e.target as HTMLInputElement).value}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-6">
                  <div class="col-span-1">
                    <h2 class="text-base font-semibold leading-7 text-gray-900">メインのロール</h2>
                  </div>
                  <div class="col-span-5">
                    <div class="mt-2 w-full">
                      <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                        <select
                          class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          onChange={(e: KeyboardEvent) => this.json.role = parseInt((e.target as HTMLInputElement).value)}
                          required
                        >
                          <option value="" selected={this.json.role === undefined}>ロールを選択してください</option>
                          <option value="0" selected={this.json.role === 0}>エバンジェリスト</option>
                          <option value="1" selected={this.json.role === 1}>アドボケイト</option>
                          <option value="2" selected={this.json.role === 2}>コミュニティマネージャー</option>
                          <option value="3" selected={this.json.role === 3}>マーケター</option>
                          <option value="4" selected={this.json.role === 4}>プログラムマネージャー</option>
                          <option value="5" selected={this.json.role === 5}>ライター</option>
                          <option value="6" selected={this.json.role === 6}>トランスレーター</option>
                          <option value="7" selected={this.json.role === 7}>サポートエンジニア</option>
                          <option value="8" selected={this.json.role === 8}>カスタマーサクセス</option>
                          <option value="9" selected={this.json.role === 9}>ソリューションアーキテクト</option>
                          <option value="10" selected={this.json.role === 10}>CxO・執行役員</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-6">
                  <div class="col-span-1">
                    <h2 class="text-base font-semibold leading-7 text-gray-900">プロフィール画像</h2>
                  </div>
                  <div class="col-span-5">
                    <div class="col-span-full">
                      <div class="mt-2 flex items-center gap-x-3">
                        { this.json.photo ? (
                          <img src={this.photoUrl(this.json.photo)} class="h-12 w-12 rounded-full" />
                        ) : (
                          <svg class="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
                          </svg>
                        )}
                        <input
                          type="file"
                          id="photo"
                          class="hidden"
                          onChange={this.changePhoto}
                        />
                        <button
                          type="button"
                          class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={this.openFile}
                        >変更する</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="border-b border-gray-900/10 pb-12">
                <h2 class="flex text-sm font-bold leading-6 text-gray-900">プロフィール
                  <span
                    onClick={this.addProfile}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 50 50"><path fill="currentColor" d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"/><path fill="currentColor" d="M16 24h18v2H16z"/><path fill="currentColor" d="M24 16h2v18h-2z"
                    />
                    </svg>
                  </span>
                </h2>
                <p class="mt-1 text-sm leading-6 text-gray-600">
                  プロフィールは一般公開されます
                </p>
                { Object.keys(this.json.name).map((key) => (
                  <div class="p-2 m-5 border-dashed border-2 border-sky-500">
                    { key === '' ? (
                      <div class="grid grid-cols-6">
                        <div class="col-span-1">
                          <h2 class="text-base font-semibold leading-7 text-gray-900">{this.language(key)}</h2>
                        </div>
                        <div class="col-span-5">
                          <div class="mt-2 w-full">
                            <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                              <select
                                class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                onChange={(e) => this.changeLanguage(key, e)}
                              >
                                <option value="">言語を選択してください</option>
                                <option value="en">English</option>
                                <option value="ja">日本語</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span>
                        <div class="grid grid-cols-6">
                          <div class="col-span-1">
                            <h2 class="text-base font-semibold leading-7 text-gray-900">{this.language(key)}</h2>
                          </div>
                          <div class="col-span-5">
                            <div class="mt-2 w-full">
                              <div class="w-full">
                                { this.languageType(key) }
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="grid grid-cols-6">
                          <div class="col-span-1">
                            <h2 class="text-base font-semibold leading-7 text-gray-900">{this.name(key)}</h2>
                          </div>
                          <div class="col-span-5">
                            <div class="mt-2 w-full">
                              <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                                <input
                                  type="text"
                                  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                  value={this.json.name[key]}
                                  onChange={(e: KeyboardEvent) => this.json.name[key] = (e.target as HTMLInputElement).value}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="grid grid-cols-6">
                          <div class="col-span-1">
                            <h2 class="text-base font-semibold leading-7 text-gray-900">{this.company(key)}</h2>
                          </div>
                          <div class="col-span-5">
                            <div class="mt-2 w-full">
                              <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                                <input
                                  type="text"
                                  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                  value={this.json.company[key]}
                                  onChange={(e: KeyboardEvent) => this.json.company[key] = (e.target as HTMLInputElement).value}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="grid grid-cols-6">
                          <div class="col-span-1">
                            <h2 class="text-base font-semibold leading-7 text-gray-900">{this.title(key)}</h2>
                          </div>
                          <div class="col-span-5">
                            <div class="mt-2 w-full">
                              <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                                <input
                                  type="text"
                                  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                  value={this.json.title[key]}
                                  onChange={(e: KeyboardEvent) => this.json.title[key] = (e.target as HTMLInputElement).value}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="grid grid-cols-6">
                          <div class="col-span-1">
                            <h2 class="text-base font-semibold leading-7 text-gray-900">{this.profile(key)}</h2>
                          </div>
                          <div class="col-span-5">
                            <div class="mt-2 w-full">
                              <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                              <textarea
                                rows={5}
                                class="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={this.json.profile[key]}
                                onChange={(e: KeyboardEvent) => this.json.profile[key] = (e.target as HTMLInputElement).value}
                              >
                              </textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="grid">
                          <div class="col text-right">
                            <button
                              type="button"
                              class="mt-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                              onClick={() => {
                                delete this.json.name[key];
                                delete this.json.title[key];
                                delete this.json.profile[key];
                                delete this.json.company[key];
                                this.json = {...this.json};
                              }}
                            >削除
                            </button>
                          </div>
                        </div>
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div class="border-b border-gray-900/10 pb-12">
                <h2 class="flex text-sm font-bold leading-6 text-gray-900">ソーシャル
                  <span
                    onClick={this.addSocial}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 50 50"><path fill="currentColor" d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"/><path fill="currentColor" d="M16 24h18v2H16z"/><path fill="currentColor" d="M24 16h2v18h-2z"
                    />
                    </svg>
                  </span>
                </h2>
                <p class="mt-1 text-sm leading-6 text-gray-600">
                  公開して良いソーシャルサービスを追加してください
                </p>
                { (this.json.socials || []).map((social, index) => (
                  <div class="mt-1">
                    <div class="grid grid-cols-6">
                      <div class="col-span-1">
                        <select
                          class="block border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 w-11/12"
                          onChange={(e) => this.json.socials[index].type = (e.target as HTMLSelectElement).value}
                        >
                          <option value="" selected={social.type === ''}>選択</option>
                          {this.socials.map((s) => (
                            <option value={s} selected={social.type === s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div class="col-span-4">
                        <input
                          type="url"
                          class="block flex-1 border-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 w-full"
                          placeholder='https://example.com/your-id'
                          value={social.url}
                          onChange={(e) => this.json.socials[index].url = (e.target as HTMLInputElement).value}
                        />
                      </div>
                      <div class="col-span-1">
                        <div
                          onClick={() => {
                            this.json.socials.splice(index, 1);
                            this.json = {...this.json};
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8s8-3.582 8-8s-3.581-8-8-8m3.707 10.293a.999.999 0 1 1-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 0 1-1.414 0a1 1 0 0 1 0-1.414L10.586 12L8.293 9.707a.999.999 0 1 1 1.414-1.414L12 10.586l2.293-2.293a.999.999 0 1 1 1.414 1.414L13.414 12z"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            { this.message ? (
              <div class={`mt-2 p-2 text-white ${this.message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                {this.message.message}
              </div>
            ) : null}
            <div class="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={this.save}
              >作成 or 更新</button>
            </div>
          </form>
        ) : (
          <div
            class="flex items-center justify-center h-12 w-48 bg-gray-800 text-white rounded-md cursor-pointer text-2xl"
            onClick={this.auth}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg> でログイン
          </div>
        )}
      </div>
    );
  }
}
