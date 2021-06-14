# DigitalOcean App Deploy action

This action updates and deploys an app on DigitalOcean from an app spec file using `doctl`.


## Usage

```yaml
    - uses: jjst/action-digitalocean-deploy-app@v2
      with:
        token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
```

## Inputs

- `token` – (**Required**) A DigitalOcean personal access token ([more info](https://www.digitalocean.com/docs/api/create-personal-access-token/)).
- `app-id` - (Optional) The id of an existing, deployed application to update.
- `spec` - (Optional) The path to the spec file to deploy. Defaults to `./deploy/app.yaml`.

If `app-id` is not supplied, then the action will look for an existing app with the same name as what is defined in the
app spec file. If no such app is found, it will create a new app using the app spec. Otherwise, it will update the
existing app with the app spec.

## Outputs

- `app-id` - The id of the app that was created or updated.
