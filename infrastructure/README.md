This provides a quick and dirty way to configure the system we use to run the SSR service for beta.

```
# assuming your shell is inside this folder (infrastructure)
ansible-playbook -b -i servers.ini ssr.yml
