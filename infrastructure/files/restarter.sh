#!/bin/bash
set -e

if $( sudo systemctl is-active --quiet termbox ); then
	LATEST_COMMIT=$(curl -s --header 'Accept: application/vnd.github.v3.sha' 'https://api.github.com/repos/wikimedia/wikibase-termbox/commits/master')

	if \
		[[ -z "$(docker images -q docker-registry.wikimedia.org/wikimedia/wikibase-termbox:$LATEST_COMMIT 2> /dev/null)" ]]\
	&&\
		$( curl --output /dev/null --silent --head --fail "https://docker-registry.wikimedia.org/v2/wikimedia/wikibase-termbox/manifests/$LATEST_COMMIT" )\
	;then
		echo "Restart Termbox SSR"
		sudo systemctl restart termbox
	else
		echo "All up to date"
	fi

else
	# There is a chance that system might have the docker corrupted because of crashes.
	sudo systemctl restart docker
	sudo docker stop systemd_termbox || true
	sudo docker rm -f systemd_termbox || true
	sudo systemctl restart termbox
fi
