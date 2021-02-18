# gnome-update-calendar-icon

Changes calendar icon in such a way, so it reflects the current date.

Requires calendar svg icon with specific ids to work. [You can get it here](https://github.com/sdwvit/my-vector-icons/blob/master/calendar.svg)

![Calendar](https://raw.githubusercontent.com/sdwvit/my-vector-icons/master/calendar.svg)

You may want to set up a cron job to update the icon regularly.

## Installation 
You have to have `git`, `anacron`, `nodejs`, and `npm` installed. `sudo apt install git anacron nodejs npm`.

1. `git clone https://github.com/sdwvit/gnome-update-calendar-icon.git`
2. `cd gnome-update-calendar-icon`
3. For the cron job, I recommend doing `echo "cd $(pwd); npm start" > uci && chmod +x ./uci && sudo ln -s $(pwd)/uci /etc/cron.daily/update-calendar-icon`
4. `npm install`.
5. `cp ./.env-example ./.env`
6. `nano ./.env` edit path to svg
7. `npm start` to see if it works

To assign svg to calendar app, in `nano /usr/share/applications/org.gnome.Calendar.desktop` replace:
`Icon=org.gnome.Calendar` with `Icon={PATH_TO_SVG}/calendar.svg`
