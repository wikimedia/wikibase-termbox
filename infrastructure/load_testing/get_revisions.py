import requests
import csv
from time import sleep

entities = [ 'Q{}'.format(i+1) for i in range(3600) ]

revisionEntityPairs = list()

def chunkEntities(totalEntities, chunkLength):
    for i in range(0, len(totalEntities), chunkLength):
        yield totalEntities[i:i + chunkLength]

chunkedEntities = chunkEntities(entities, 50)

S = requests.Session()

URL = "https://www.wikidata.org/w/api.php"

for entityChunk in chunkedEntities:
    PARAMS = {
        "action": "query",
        "prop": "revisions",
        "rvprop": "ids",
        "formatversion": "2",
        "format": "json",
        "titles": '|'.join(entityChunk)
    }

    R = S.get(url=URL, params=PARAMS)
    DATA = R.json()

    def parseResponse(pages):
        for page in pages:
            if 'missing' in page:
                pass
            else:
                yield {'entity': page['title'], 'revision': page['revisions'][0]['revid']}

    revisionEntityPairs += parseResponse(DATA['query']['pages'])
    sleep(1)


with open('revisions.csv', 'w', newline='') as csvfile:
    fieldnames = ['entity', 'revision']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    writer.writerows(revisionEntityPairs)