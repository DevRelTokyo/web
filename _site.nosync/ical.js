const ical2json = require("ical2json");
const request = require('superagent');
const fs = require('fs');
const YAML = require('json2yaml')
const {promisify} = require('util');

(async () => {
  const res = await request.get('http://127.0.0.1:3000/?name=devrel').send();
  const json = ical2json.convert(res.text);
  await promisify(fs.writeFile)('./_data/events.yml', YAML.stringify(json.VCALENDAR[0].VEVENT));
  console.log('Done');
})();

