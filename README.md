# Gan and Zhi

## Working on the project

Server side part is using Symfony 5 but it does not do anything. 1 Controller 1 action and then everything in React.js

Don't forget to run `make watch`, that will re-transcompile on the fly when you change JS files. (so you can reload the page and see your changes).

Also that's a PWA, there is a Service Worker file (sw.js), you could then have weird cache issues as the Service Worker will install stuff. 

> you can disable it in `assets/js/app.tsx`

## Requirements

- PHP 7.2+ (application engine)
- Symfony CLI (web server)
- Yarn
- make (optional but you'll have to run target manually, @see Makefile)

### PHP

#### Mac OSX

Use `brew`

#### Linux

Use `apt-get` or any package manager.

### Symfony CLI

```bash
curl -sS https://get.symfony.com/cli/installer | bash
```

And the follow the instructions for certificates (HTTPS)

### Yarn

Use `apt-get` or any package manager.

## Local install

```bash
make install
```

## Run the project

```bash
make serve
```

You should be able to reach the project: https://127.0.0.1:14080

## Makefile

```bash
make
```

You'll get the list of available target.



