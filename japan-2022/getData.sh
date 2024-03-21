#!/bin/bash
wget https://script.google.com/macros/s/AKfycbzQO8oVb8MFJ1th0HSpUBcYX4y26erPkpoE3syN3fDTXJlW6gis8DYmQuhjcGG0QMNgQQ/exec?name=organizers -O _data/organizers.json 
wget https://script.google.com/macros/s/AKfycbzQO8oVb8MFJ1th0HSpUBcYX4y26erPkpoE3syN3fDTXJlW6gis8DYmQuhjcGG0QMNgQQ/exec?name=sponsors -O _data/sponsors.json
wget https://script.google.com/macros/s/AKfycbzQO8oVb8MFJ1th0HSpUBcYX4y26erPkpoE3syN3fDTXJlW6gis8DYmQuhjcGG0QMNgQQ/exec?name=speakers -O _data/speakers.json
wget https://script.google.com/macros/s/AKfycbzQO8oVb8MFJ1th0HSpUBcYX4y26erPkpoE3syN3fDTXJlW6gis8DYmQuhjcGG0QMNgQQ/exec?name=sessions -O _data/sessions.json
wget https://script.google.com/macros/s/AKfycbzQO8oVb8MFJ1th0HSpUBcYX4y26erPkpoE3syN3fDTXJlW6gis8DYmQuhjcGG0QMNgQQ/exec?name=track -O _data/tracks.json
wget https://script.google.com/macros/s/AKfycbzQO8oVb8MFJ1th0HSpUBcYX4y26erPkpoE3syN3fDTXJlW6gis8DYmQuhjcGG0QMNgQQ/exec?name=venues -O _data/venues.json
ruby speaker.rb
ruby session.rb