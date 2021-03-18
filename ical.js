const request = require('superagent');
const fs = require('fs');
const YAML = require('json2yaml')
const {promisify} = require('util');

(async () => {
  const res = await request.get('https://connpass.com/api/v1/event/?series_id=1384').send();
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

