const request = require('superagent');
const fs = require('fs');
const YAML = require('json2yaml')
const {promisify} = require('util');

(async () => {
  const res = await request
    .get('https://connpass.com/api/v2/events/?group_id=1384')
    .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36')
    .set('X-API-Key', process.env.CONNPASS_API_KEY)
    .send();
  const json = JSON.parse(res.text).events;
  json.sort((a, b) => {
    const da = new Date(a.started_at);
    const db = new Date(b.started_at);
    if( da < db ) return 1;
    if( da > db ) return -1;
    return 0;
  });
  await promisify(fs.writeFile)('./_data/events.json', JSON.stringify(json));
  // console.log('Done');
})();

