'use strict';

const $ = require('shelljs');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const eslint = require('gulp-eslint');
const fs = require('fs');
const gulp = require('gulp');

gulp.task('lint', function () {
  return gulp.src(['src/*.js', './*.js', './bin/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});
gulp.task('babel', function () {
  const bab = babel();
  gulp.src('src/**/*.js')
    .pipe(changed('dist'))
    .pipe(bab)
    .pipe(gulp.dest('dist'));
  return;
});

gulp.task('build', function () {
  const commands = require('./commands.json');
  for (let i = 0; i < commands.commands.length; ++i) {
    const command = commands.commands[i];
    const content = `#!/usr/bin/env node\nrequire('./parser')(process.argv, '${command}');\n`;
    fs.writeFileSync(`./bin/${command}.js`, content);
  }
});

function getJSON(name) {
  const dir = `./packages/${name}`;
  let json;
  try {
    json = fs.readFileSync(`${dir}/package.json`, {encoding: 'utf8', force: true});
    json = JSON.parse(json);
  } catch (e) {
    $.cp('-f', `./packages/template.package.json`, `${dir}/package.json`);
    return getJSON(name);
  }
  return json;
}

function writeJSON(name, json) {
  const dir = `./packages/${name}`;
  fs.writeFileSync(`${dir}/package.json`, `${JSON.stringify(json, null, '  ')}\n`);
}

gulp.task('packages', function () {
  const commands = require('./commands.json');

  let related = '';
  related += `- [cash](https://github.com/dthree/cash) - Main project\n`;
  related += `- [cash-global](https://npmjs.com/package/cash-global) - Globally install all commands\n`;
  related += `- [vorpal](https://github.com/dthree/vorpal) - Cash is built on Vorpal\n\n`;
  related += `#### Individual commands\n\n`;
  for (const name in commands.packages) {
    if (commands.packages.hasOwnProperty(name)) {
      related += `- [cash-${name}](https://npmjs.com/package/cash-${name})\n`;
    }
  }

  related = related.replace(/\n$/g, '');

  for (const name in commands.packages) {
    if (commands.packages.hasOwnProperty(name)) {
      const pkg = commands.packages[name];
      const deps = pkg.dependencies;
      const files = pkg.files;
      const dir = `./packages/${name}`;
      $.rm('-rf', `${dir}/dist`);
      $.mkdir('-p', `${dir}/dist/help`);
      $.mkdir('-p', `${dir}/dist/lib`);
      $.mkdir('-p', `${dir}/dist/commands`);
      $.mkdir('-p', `${dir}/dist/util`);
      $.mkdir('-p', `${dir}/bin`);
      const json = getJSON(name);
      const jsonMain = require('./package.json');
      json.dependencies = {};
      json.devDependencies = {};
      const preparser = `./dist/preparser.js`;
      const main = `./dist/commands/${name}.js`;
      const help = `./dist/help/${name}.js`;
      const bin = `./bin/${name}.js`;
      $.cp('-f', main, `${dir}/${main}`);
      $.cp('-f', bin, `${dir}/${bin}`);
      $.cp('-f', help, `${dir}/${help}`);
      $.cp('-f', preparser, `${dir}/${preparser}`);
      $.cp('-f', './bin/parser.js', `${dir}/bin/parser.js`);
      $.cp('-f', `./packages/template.README.md`, `${dir}/README.md`);
      let readme = String($.cat(`${dir}/README.md`));
      readme = readme.replace(/\{package\-name\}/g, `cash-${name}`);
      readme = readme.replace(/\{command\-name\}/g, `${name}`);
      readme = readme.replace(/\{related\}/g, related);
      readme.to(`${dir}/README.md`);
      for (let i = 0; i < files.length; ++i) {
        $.cp('-f', files[i], `${dir}/${files[i]}`);
      }
      for (let i = 0; i < deps.length; ++i) {
        json.dependencies[deps[i]] = jsonMain.dependencies[deps[i]];
        if (json.dependencies[deps[i]] === undefined) {
          throw new Error(`Sub-module dependency for "${name}" does not exist in the main package.json file.`);
        }
      }
      json.files = ['dist', 'bin'];
      json.dependencies.vorpal = jsonMain.dependencies.vorpal;
      json.name = `cash-${name}`;
      json.description = `Cross-platform implementation of the Unix '${name}' command.`;
      json.main = main;
      json.bin = json.bin || {};
      json.bin[name] = bin;
      writeJSON(name, json);
    }
  }
  if ($.test('-e', './../cash-global/commands.json')) {
    $.cp('./commands.json', './../cash-global/commands.json');
  }
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['babel', 'build', 'packages']);
  gulp.watch('commands.json', ['babel', 'build', 'packages']);
  gulp.watch('test/**/*.js', ['babel', 'build', 'packages']);
});

gulp.task('default', ['babel', 'watch', 'build', 'packages']);

gulp.task('builder', ['babel', 'build', 'packages']);
