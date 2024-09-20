import Parse from 'parse';

export interface UserJson {
  objectId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  email?: string;
  profile: {[key: string]: string};
	company: {[key: string]: string};
  name: {[key: string]: string};
  title?: {[key: string]: string};
  role?: number;
  socials: {type: string, url: string}[];
  photo?: Parse.File;
}
