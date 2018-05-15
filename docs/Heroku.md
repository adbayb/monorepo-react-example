heroku create monorepoayoub

heroku buildpacks:set https://github.com/Pagedraw/heroku-buildpack-select-subdir --app monorepoayoub

heroku config:add BUILDPACK='applications/app1=https://github.com/heroku/heroku-buildpack-nodejs#v83' --app monorepoayoub

// To avoid pruning devDependencies:
heroku config:set NPM_CONFIG_PRODUCTION=false --app monorepoayoub

// You need to set .npmrc in the root of the application and use NPM_TOKEN environment variable:
heroku config:set NPM_TOKEN=XXXXXX-XXX-XXXX --app monorepoayoub

heroku config:set NODE_MODULES_CACHE=false --app monorepoayoub

git push https://git.heroku.com/monorepoayoub.git master

heroku logs

https://github.com/Pagedraw/heroku-buildpack-select-subdir
