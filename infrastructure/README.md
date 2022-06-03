This guide provides a quick and dirty way to configure the system we use to run the SSR service for beta.

## Prerequisites

This procedure uses [ansible](https://docs.ansible.com/ansible/latest/index.html) to manipulate remote servers via SSH - essentially automating what you'd otherwise do "by hand" in a step-by-step approach.

To perform this manual deployment setup, you need to be in possession of a machine or instance to deploy to, and an SSH private key for which there is an associated user that is authorized to perform the operations. To create such an instance, you may utilize one of WMDE's [Wikimedia CloudVPS](https://wikitech.wikimedia.org/wiki/Portal:Cloud_VPS) projects, please consult your Engineering Manager or Tech Lead for more information.

## Preparation

1. Copy `servers.ini.example` to `servers.ini`

    ```sh
    $ cp servers.ini.example servers.ini
    ```

2. In `servers.ini` change `<ssr-server-url>` to the ssh address of the instance you intend to deploy the SSR service for beta into.

## Run (from your local machine)

```sh
$ ansible-playbook -b -i servers.ini ssr.yml
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
