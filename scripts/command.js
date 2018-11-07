'use strict';

const path = require('path');
const Command = require('common-bin');
const globby = require('globby');
const runscript = require('runscript');
const chalk = require('chalk');

class TestCommand extends Command {
  constructor(rawArgs) {
    super(rawArgs);

    this.options = {
      verbose: {
        type: 'boolean',
        description: 'Show more infomation',
        alias: 'V',
      },
      c: {
        type: 'boolean',
        description: 'in China',
      },
    };
  }

  async run({ argv }) {
    const dirs = await this.getExamples();

    const skip = new Set();
    const success = new Set();
    const fail = new Set();

    for (const dir of dirs) {
      if (!this.testExists(dir)) {
        console.info('%s directory %s',
          chalk.bgYellow('skip'),
          chalk.gray(dir)
        );
        skip.add(dir);
        continue;
      }

      console.info('%s directory %s',
        chalk.bgGreen('test'),
        chalk.gray(dir)
      );
      try {
        const flag = argv.c ? ' -c' : '';
        const npmInstallPath = path.join(__dirname, '../node_modules/.bin/npmupdate');
        await this.runscript(`${npmInstallPath}${flag}`, { cwd: dir });
        await this.runscript('npm test', { cwd: dir });
        console.info('%s success\n', chalk.green('✔'));
        success.add(dir);
      } catch (err) {
        fail.add(dir);
        console.info('%s fail\n', chalk.red('✗'));
      }
    }

    console.info(chalk.green('success %s'), success.size);
    console.info(chalk.red('fail %s'), fail.size);
    console.info(chalk.cyan('skip %s'), skip.size);
    if (fail.size > 0) process.exit(fail.size);
  }

  testExists(dir) {
    try {
      const pkg = require(path.join(dir, 'package.json'));
      if (!pkg.scripts || !pkg.scripts.test) return false;
      return true;
    } catch (_) {
      console.log(_);
      return false;
    }
  }

  async getExamples() {
    const cwd = path.join(__dirname, '../example');
    const files = await globby([ '*' ], { cwd, onlyDirectories: true });
    return files.map(x => path.join(cwd, x));
  }

  async runscript(command, opt = {}) {
    if (!opt.stdio && !this.context.argv.verbose) {
      opt.stdio = 'pipe';
    }

    console.info('%s %s %s',
      chalk.bgBlue('RUN'),
      command,
      chalk.gray(opt.cwd ? `in ${opt.cwd}` : ''));

    try {
      await runscript(command, opt);
    } catch (err) {
      if (err.stdio.stdout) {
        console.log(err.stdio.stdout.toString());
      }
      if (err.stdio.stderr) {
        console.log(err.stdio.stderr.toString());
      }
      console.info('%s %s', chalk.bgRed('Fail'), command);
      throw err;
    }
  }
}

module.exports = TestCommand;
