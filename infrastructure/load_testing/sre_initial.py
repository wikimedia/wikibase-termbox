# From https://phabricator.wikimedia.org/P8511 by akosiaris
from locust import HttpLocust, TaskSet

def info(l):
    l.client.get('/_info')

def wellformed(l):
    l.client.get('/termbox?language=de&entity=Q42&revision=932235876&editLink=sdfsf&preferredLanguages=de|en|el|cy')

def malformed(l):
    with l.client.get('/termbox?language=de&entity=Q42&preferredLanguages=de|en|el|cy', catch_response=True) as response:
        if response.status_code == 400:
            response.success()

def doesnotexist(l):
    with l.client.get('/termbox?language=de&entity=Q100&revision=2314324&editLink=sdfdsf&preferredLanguages=de|en|el|cy', catch_response=True) as response:
        if response.status_code == 404:
            response.success()

class UserBehavior(TaskSet):
    tasks = {
        info: 4,
        wellformed: 94,
        malformed: 1,
        doesnotexist: 1,
    }

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 1000
    max_wait = 2000
 