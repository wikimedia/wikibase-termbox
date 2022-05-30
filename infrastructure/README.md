This provides a quick and dirty way to configure the system we use to run the SSR service for beta.

## Prerequisites

This uses [ansible](https://docs.ansible.com/ansible/latest/index.html) to manipulate remote servers via SSH - essentially automating what you'd otherwise do "by hand" in a step-by-step approach.
You need to be in possession of an SSH private key for which there is a associated user that is authorized to perform the operations.

## Run (from your local machine)

```sh
# assuming your shell is inside this folder (infrastructure)
ansible-playbook -b -i servers.ini ssr.yml
```

## Development

### Linting

Playbooks can be checked for notorious problems and oversights using the handy [ansible-lint](https://hub.docker.com/r/particlekit/ansible-lint) command - it helps us write concise, consistent configuration.

```sh
ansible-lint ssr.yml
```

### Troubleshooting

To ease troubleshooting, we can examine logs with `journalctl` in the instance where the services are deployed to.

_**Tip:** add the flag `-f` to the commands below to view the logs as a stream_

#### `termbox-updater.service` logs

```
sudo journalctl -n 25 -u termbox-updater.service
```

#### `termbox.service` logs

```
sudo journalctl -n 25 -u termbox.service
```
