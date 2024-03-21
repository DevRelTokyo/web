require('json')
require('uri');
require 'icalendar'

slido = {
  "A": 'https://app.sli.do/event/spntlw5e',
  "B": 'https://app.sli.do/event/9m3udkrj',
  "C": 'https://app.sli.do/event/udiacusj'
}
json = JSON.parse(open('./_data/sessions.json').read)
speakers = JSON.parse(open('./_data/speakers.json').read)
json.each do |session|
  title = "#{session['title']} at DevRel/Japan CONFERENCE 2021"
  start_time = "20211113T#{session['start'].gsub(':', '')}"
  end_time = "20211113T#{session['end'].gsub(':', '')}"
  moderator = speakers.select{|s| s['id'] == session['moderator']}.first
  panelists = []
  4.times do |i|
    speaker = speakers.select{|s| s['id'] == session["panelist#{i + 1}"]}.first
    panelists << speaker if speaker
  end
  panelist = panelists.map{|s| "#{s['name']}@#{s['company']}"}.join("\n- ")
  detail = <<-EOS
トラック#{session['track']} / #{session['start']}〜#{session['end']}

🌟 イベント参加用URL
https://devrel.dev/japan-2021/view/

🌟 セッション詳細
https://devrel.dev/japan-2021/sessions/#{session['id']}/

🌟 Ask the Speakers
https://devreljp.ovice.in/

🌟 ハッシュタグ
#DevReljp#{session['track']}

🌟 質問投稿（Sli.do）
#{slido[session['track'].to_sym]}
  
🎤 モデレーター：#{moderator['name']}@#{moderator['company']}
🗣 パネリスト：
- #{panelist}
EOS

  cal = Icalendar::Calendar.new
  cal.timezone do |t|
    t.tzid = "Asia/Tokyo"
  end
  cal.event do |e|
    e.dtstart     = DateTime.parse(start_time)
    e.dtend       = DateTime.parse(end_time)
    e.summary     = title
    e.description = detail
  end

  gcal = "https://www.google.com/calendar/render?action=TEMPLATE&text=#{URI.encode(title)}&dates=#{start_time}00/#{end_time}00&location=https://devrel.dev/japan-2021/view/&trp=true&details=#{URI.encode(detail)}&trp=undefined&trp=true&sprop="
  content = <<-EOS
---
layout: session
permalink: /sessions/#{session['id']}/
id: #{session['id']}
title: #{session['title']}
gcal: #{gcal}
---
  EOS
  session['gcal'] = gcal
  f = open("./sessions/#{session['id']}.md", 'w')
  f.write(content)
  f.close

  f = open("./sessions/#{session['id']}.ics", 'w')
  f.write(cal.to_ical)
  f.close
  
end

f = open('./_data/sessions.json', 'w')
f.write json.to_json
f.close