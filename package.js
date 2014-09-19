Package.describe({
  summary: "a way to use this.unblock inside publications",
  version: "1.1.0",
  git: "https://github.com/meteorhacks/unblock.git",
  name: "meteorhacks:unblock"
});

Package.on_use(function (api, where) {
  configurePackages(api);
});

Package.on_test(function(api) {
  configurePackages(api);

  api.use('tinytest');
  api.add_files('test/unblock.js', 'server');
});

function configurePackages (api) {
  // only on Meteor 0.9+
  if(api.versionsFrom) {
    api.versionsFrom('METEOR@0.9.0');
    api.use('meteorhacks:meteorx@1.0.2');
  } else {
    api.use('meteorx');
  }
  api.add_files('lib/unblock.js', 'server');
}
