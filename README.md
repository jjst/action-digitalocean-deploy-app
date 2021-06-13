# DigitalOcean App Deploy action

This action updates and deploys an app on DigitalOcean from an app spec file.


## Usage

```yaml
    - uses: jjst/action-digitalocean-deploy-app@v1
      with:
        token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
        application-id: <existing-application-id>
```

## Inputs

- `token` – (**Required**) A DigitalOcean personal access token ([more info](https://www.digitalocean.com/docs/api/create-personal-access-token/)).
- `application-id` - (**Required**) The application id of the existing, deployed application to update.
- `spec` - (Optional) The path to the spec file to deploy. Defaults to `./deploy/app.yaml`.

### Finding an App's application id and app spec

To obtain the application id and spec of an existing app, the simplest method is to install and use [doctl](https://github.com/digitalocean/doctl), DigitalOcean's command line app. Find an app's application id with:

```sh
doctl app list
```

Get the current application's app spec with:

```sh
doctl app spec get <application-id>
```
using the application id from the previous step.
