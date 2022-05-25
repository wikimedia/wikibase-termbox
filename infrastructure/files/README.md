termbox hosting is set up with ansible.

See https://gerrit.wikimedia.org/r/plugins/gitiles/wikibase/termbox/+/master/infrastructure/

# tl;dr

Do not change the following manually

* `/srv/termbox/restarter.sh`, regularly checks for, downloads and tags the latest image, as well as restarts the service
* `/lib/systemd/system/termbox.service`, systemd service definition
