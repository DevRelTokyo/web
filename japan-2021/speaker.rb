require('json')
json = JSON.parse(open('./_data/speakers.json').read)

json.each do |session|
  content = <<-EOS
---
layout: speaker
permalink: /speakers/#{session['id']}/
id: #{session['id']}
speaker: #{session['name']}#{session['company'] == '' ? '' : "（#{session['company']}）"}
---
  EOS
  f = open("./speakers/#{session['id']}.md", 'w')
  f.write(content)
  f.close
end