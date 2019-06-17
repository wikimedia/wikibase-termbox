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
	echo "Start Termbox"
	sudo systemctl start termbox
fi
