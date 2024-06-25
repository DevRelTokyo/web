require 'json'
require 'yaml'
sessions = JSON.parse open('_data/sessions.json').read

sessions.each do |session|
	next if session['id'].nil? or session['id'].empty?
	session['permalink'] = "/sessions/#{session['id']}/"
	session['layout'] = "session"
	f = open("sessions/#{session['id']}.md", "w")
	f.write(session.to_yaml)
	f.write("---\n")
	f.close
end