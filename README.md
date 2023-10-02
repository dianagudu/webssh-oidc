# Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Run express app

```bash
npm run start
```

## Build and run docker image

After building the app, you can build the docker image:

```bash
docker build -t webssh-oidc .
```

To run the docker image, you first need to configure the environment variables.

```bash
cp .env.example .env
```

Then create OIDC clients with the providers you want to use and add them to the `config/default.yml` file (see [config/default.yml.example](config/default.yml.example) for an example configuration).
The redirect URI should be `http://localhost:8444/auth/callback/{provider_id}`, where `{provider_id}` is the id of the OIDC provider.

List of supported providers and their corresponding ids:

- `google` for `https://accounts.google.com`
- `egi` for `https://aai.egi.eu/auth/realms/egi`
- `egi-dev` for `https://aai-dev.egi.eu/auth/realms/egi`
- `wlcg` for `https://wlcg.cloud.cnaf.infn.it`
- `helmholtz` for `https://login.helmholtz.de/oauth2`
- `helmholtz-dev` for `https://login-dev.helmholtz.de/oauth2`
- `deep-hdc` for `https://iam.deep-hybrid-datacloud.eu`

You can then spin up a container with:

```bash
docker-compose up
```

Check out the [motley_cue_docker](https://github.com/dianagudu/motley_cue_docker) repository for a complete example with motley-cue and ssh server.

## Configuration

OIDC clients (id + secret) can be configured in `config/default.yml`. An example can be found in `config/default.yml.example`.

A privacy policy is necessary to be able to run the app. The compose file assumes one is present in `config/docs/privacy.md`. An example can be found in `config/docs/privacy.md.example`.

## Contributing

To increase version number, please do not tag the commit. Instead, use:

```bash
npm version [ patch | minor | major ] --no-git-tag-version
```
