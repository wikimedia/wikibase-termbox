# Install
Create a python venv: `python3 -m venv ./.venv`

Source the python venv: `source .venv/bin/activate`

Possibly install wheel if missing: `pip3 install wheel`

Install dependencies: `pip3 install -r requirements.txt`

# Running
Run with `.venv/bin/locust -f ./<filename>.py --no-web -c <client count> -r <spawn rate> --host 'http://<hostname:port>'`
Where you set the locust script, the number of clients, the rate at which they spawn. and finally the host.
e.g. `.venv/bin/locust -f ./sre_initial.py --no-web -c 10 -r 1 --host 'http://localhost:3030'`
