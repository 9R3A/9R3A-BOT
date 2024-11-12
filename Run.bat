@echo off

cd

call mode con: cols=100 lines=20

color 3

title Running The Bot

echo DONT TURN IT OFF THE BOT WILL BE DISCONNECTED

echo if its first time to open it Open The Installer.bat untill the node-modules get installed

echo And U Can Change the place of the Folder but Make Sure U Move The Hole Thing

echo Remember change The .env Using VSCODE , NOTEPAD++ Or Make It .txt But The Token And Make It .env again

timeout /t 30

mode con: cols=100 lines=30

color 2

echo Bot is Running...

title Made By 9R3A ^<3

node bot.js

Pause