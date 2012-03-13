
/**
 * Module dependencies.
 */

var path = require('path')
  , Base = require('./base')
  , color = Base.color;

/**
 * Expose `Dot`.
 */

exports = module.exports = Dot;

/**
 * Initialize a new `Dot` matrix test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Dot(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , width = Base.window.width * .75 | 0
    , n = 0;

  runner.on('start', function(){
    process.stdout.write('\n  ');
  });

  runner.on('pending', function(test){
    process.stdout.write(color('pending', '.'));
  });

  runner.on('pass', function(test){
    if (++n % width == 0) process.stdout.write('\n  ');
    if ('slow' == test.speed) {
      process.stdout.write(color('bright yellow', '.'));
    } else {
      process.stdout.write(color(test.speed, '.'));
    }
  });

  runner.on('fail', function(test, err){
    if (++n % width == 0) process.stdout.write('\n  ');
    process.stdout.write(color('fail', '.'));
  });

  runner.on('end', function(){
    console.log();
    self.epilogue();

    if (self.passes.length > 0) {
      console.log(color('bright yellow', '10 Slowest Tests:'));
      console.log();

      self.passes.sort(function(a, b) {
        return b.duration - a.duration;
      }).slice(0, 10).forEach(function(test){
        if (test.duration > 0) {
          // TODO cache
          var data = require('fs').readFileSync(test.parent.file, 'utf8');
          data.split("\n").forEach(function(line, i){
            if (line.indexOf(test.title) >= 0) {
              test.line = i + 1;
            }
          });

          console.log(color('light', '• ' + test.title) + ' '
            + color(test.speed, '(' + test.duration + 'ms)') + ' - '
            + color('green', path.relative(process.cwd(), test.parent.file) + ':' + test.line));
        }
      });
    }
  });
}

/**
 * Inherit from `Base.prototype`.
 */

Dot.prototype.__proto__ = Base.prototype;