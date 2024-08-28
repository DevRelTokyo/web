#!/bin/bash

URL="https://script.google.com/macros/s/AKfycbzyocugzM5XZZdlfq1b8XMK2CvebcJsLaOmbsuIa4ep7qtoLCvtOgDbgvYpNA1VIzl-jw/exec"

curl -L "$URL?name=events" > _data/events.json
curl -L "$URL?name=members" > _data/members.json
