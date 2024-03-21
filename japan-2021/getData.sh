#!/bin/bash
wget https://script.google.com/macros/s/AKfycbw9-dG6XuILpo9xcvPcjw8pdqLt3BXo9_4nxJl8eKHW0uOpuq7Iyy8HNS_J_xu6bjPH/exec?name=organizers -O _data/organizers.json 
wget https://script.google.com/macros/s/AKfycbw9-dG6XuILpo9xcvPcjw8pdqLt3BXo9_4nxJl8eKHW0uOpuq7Iyy8HNS_J_xu6bjPH/exec?name=sponsors -O _data/sponsors.json 
wget https://script.google.com/macros/s/AKfycbw9-dG6XuILpo9xcvPcjw8pdqLt3BXo9_4nxJl8eKHW0uOpuq7Iyy8HNS_J_xu6bjPH/exec?name=speakers -O _data/speakers.json 
wget https://script.google.com/macros/s/AKfycbw9-dG6XuILpo9xcvPcjw8pdqLt3BXo9_4nxJl8eKHW0uOpuq7Iyy8HNS_J_xu6bjPH/exec?name=sessions -O _data/sessions.json 
wget https://script.google.com/macros/s/AKfycbw9-dG6XuILpo9xcvPcjw8pdqLt3BXo9_4nxJl8eKHW0uOpuq7Iyy8HNS_J_xu6bjPH/exec?name=tracks -O _data/tracks.json 

ruby organizer.rb
ruby sessions.rb
ruby speaker.rb
