import csv, random
from collections import defaultdict



def getWeightedRandomLanguage():
    langWeights=defaultdict(list)
    with open('langFreq.csv', newline='') as csvfile:
        langReader = csv.DictReader(csvfile)
        for row in langReader:
            for key,value in row.items():
                langWeights[key].append(value)
    return random.choices(langWeights['lang'], weights=map(int, langWeights['count']))[0]
