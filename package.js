Package.describe({
  summary: "use this.unblock inside publications",
  version: "1.0.1",
  git: "https://github.com/meteorhacks/unblock.git",
  name: "meteorhacks:unblock"
});

Package.onUse(function (api, where) {
  configurePackages(api);
});

Package.onTest(function(api) {
  configurePackages(api);
  api.versionsFrom('METEOR@0.9.0');
  api.use('tinytest');
  api.addFiles('test/unblock.js', 'server');
});

function configurePackages (api) {
  api.use('meteorhacks:meteorx@1.0.2');
  api.addFiles('lib/unblock.js', 'server');
}
