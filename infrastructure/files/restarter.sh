#!/bin/bash
set -e

if $( sudo systemctl is-active --quiet termbox ); then
	docker pull docker-registry.wikimedia.org/wikimedia/wikibase-termbox:latest

	CURRENT_HASH=$(docker images -q wmde/wikibase-termbox-production 2> /dev/null)
	LATEST_HASH=$(docker images -q docker-registry.wikimedia.org/wikimedia/wikibase-termbox:latest 2> /dev/null)

	if [ "{$CURRENT_HASH}" != "{$LATEST_HASH}" ]; then
		echo "Tagging latest Termbox SSR image from wikimedia docker registry as current image in-use"
		docker tag docker-registry.wikimedia.org/wikimedia/wikibase-termbox:latest wmde/wikibase-termbox-production:latest

		echo "Restarting Termbox SSR"
		sudo systemctl restart termbox

		echo "Cleaning up old Termbox SSR images, if any"
		docker rmi $(docker images -q docker-registry.wikimedia.org/wikimedia/wikibase-termbox 2> /dev/null ) || true
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
