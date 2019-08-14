from locust import HttpLocust, TaskSet, task
import csv
from collections import defaultdict
import lang

def getPrimaryLanguageString():
    return lang.getWeightedRandomLanguage()

def getPreferredLanguages():
    langs = [ lang.getWeightedRandomLanguage() for i in range(5) ]
    return '|'.join(langs)

class UserBehaviour(TaskSet):

    def on_start(self):
        csvfile = open('revisions.csv', newline='')
        self.revisionReader = csv.DictReader(csvfile)

    @task(1)
    def renderTermbox(self):
        entityRevision = next(self.revisionReader)
        self.client.get('/termbox?language={lang}&entity={entity}&revision={revision}&editLink=sdfsf&preferredLanguages={preflangs}'.format(
            lang = getPrimaryLanguageString(),
            preflangs = getPreferredLanguages(),
            entity = entityRevision['entity'],
            revision = entityRevision['revision']
            ))

class User(HttpLocust):
    task_set = UserBehaviour
    min_wait = 1000
    max_wait = 2000
