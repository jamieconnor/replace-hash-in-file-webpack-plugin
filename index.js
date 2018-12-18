'use strict';

const path = require('path');
const fs = require('fs');

function getAllFiles(root) {
  var res = [],
    files = fs.readdirSync(root);
  files.forEach(function (file) {
    var pathname = root + '/' + file,
      stat = fs.lstatSync(pathname);

    if (!stat.isDirectory()) {
      res.push(pathname);
    } else {
      res = res.concat(getAllFiles(pathname));
    }
  });
  return res
}

function replace(file, rules, hash) {
  const src = path.resolve(file);
  let template = fs.readFileSync(src, 'utf8');
  template = rules.reduce(
    (template, rule) => template.replace(
      (typeof rule.search === 'string' ? rule.search.replace('[hash]', hash) : rule.search), (typeof rule.replace === 'string' ? rule.replace.replace('[hash]', hash) : rule.replace.bind(global)().replace('[hash]', hash))
    ),
    template
  );

  fs.writeFileSync(src, template);
}

function ReplaceHashInFilePlugin(options = []) {
  this.options = options;
};

ReplaceHashInFilePlugin.prototype.apply = function (compiler) {
  const root = compiler.options.context;
  const done = (statsData) => {
    if (statsData.hasErrors()) {
      return
    }
    this.options.forEach(option => {
      const dir = option.dir || root;
      const files = option.files;

      if(option.files){
        const files = option.files;
        if(Array.isArray(files) && files.length) {
          files.forEach(file => {
            replace(path.resolve(dir, file), option.rules, statsData.hash);
          })
        }
      } else if (option.test) {
        const test = option.test;
        const testArray = Array.isArray(test) ? test : [test];
        const files = getAllFiles(dir);

        files.forEach(file => {
          const match = testArray.some((test, index, array) => {
            return test.test(file);
          })

          if (!match) {
            return;
          }

          replace(file, option.rules, statsData.hash);
        })
      } else {
        const files = getAllFiles(dir);
        files.forEach(file => {
          replace(file, option.rules, statsData.hash);
        })
      }
    })
  }

  if (compiler.hooks) {
    const plugin = {
      name: "ReplaceHashInFilePlugin"
    };
    compiler.hooks.done.tap(plugin, done);
  } else {
    compiler.plugin('done', done);
  }
};

module.exports = ReplaceHashInFilePlugin;