require 'json'

sessions_json = JSON.parse(open('_data/sessions.json').read)
speakers_json = JSON.parse(open('_data/speakers.json').read)

sessions_json.each do |session|
  puts "## [#{session['title']}](https://devrel.tokyo/japan-2021/sessions/#{session['id']})"
  moderator_id = session['moderator']
  m = {}
  if moderator_id == 'none'
    m[:id] = ''
    m[:image] = 'none.png'
    m[:name] = '間もなくアナウンス'
  else
    speaker = speakers_json.filter {|s| s['id'] == moderator_id }.first
    m[:id] = moderator_id
    m[:image] = "#{moderator_id}.jpg"
    m[:name] = "#{speaker["name"]}@#{speaker["company"]}"
  end
  speakers = []
  5.times do | i |
    speaker = {}
    s = session["panelist#{i+1}"]
    break if s.nil? || s == ''
    if s == 'none'
      speakers << {
        id: '',
        image: 'none.png',
        name: '間もなくアナウンス'
      }
    else
      speaker = speakers_json.filter{|sp| sp['id'] == s }.first
      speakers << {
        id: s,
        image: "#{s}.jpg",
        name: "#{speaker["name"]}@#{speaker["company"]}"
      }
    end
  end

  puts "| モデレータ |" + ("スピーカー |" * speakers.size).to_s
  puts "|" + ("----------|" * (speakers.size + 1)).to_s
  lines = ["| [![](https://devrel.tokyo/japan-2021/assets/images/speakers/#{m[:image]})<br />#{m[:name]}](https://devrel.tokyo/japan-2021/speakers/#{m[:id]}) |"]
  
  speakers.each do |s|
    lines << "[![](https://devrel.tokyo/japan-2021/assets/images/speakers/#{s[:image]})<br />#{s[:name]}](https://devrel.tokyo/japan-2021/speakers/#{s[:id]}) |"
  end

  puts lines.join("")
  puts ""
end