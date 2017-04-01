/**
 * Создание тасков, которые загружаются по требованию
 */
const path = require('path');

const defineTask = (gulp, plugins) => (config) => {
    var localConfig = {};
    try {
      localConfig = require(path.resolve(config.taskPath, 'config.js'));
    } catch(e) {}

    let taskConfig = Object.assign({}, localConfig, config);

    if (config.onError && typeof config.onError === 'function') {
      taskConfig.onError = config.onError;
    } else {
      // gulp-notify сам завершает поток - this.end() или this.emit('end') не нужны
      // taskConfig.onError = plugins.notify.onError({
      //   title: 'Gulp: <%= options.taskName %>',
      //   message: '<%= error.message %>',
      //   templateOptions: {
      //     taskName: taskConfig.taskName
      //   }
      // });
      taskConfig.onError = function(error) {
        !!plugins.browserSync && !!plugins.browserSync.active && plugins.browserSync.notify(`
          <div style="max-width: 480px; text-align: left; padding: 10px; background: red; color: #fff">
            <div>${taskConfig.taskName}</div>
            <div>${error.message}</div>
          </div>
        `, 5000);
        plugins.notify.onError({
          title: 'Gulp: <%= options.taskName %>',
          message: '<%= error.message %>',
          templateOptions: {
            taskName: taskConfig.taskName
          }
        })(error);
        // this.emit('end');
      }
    };

    let gulpFunc = callback => {
      let taskFn = require(path.resolve(config.taskPath))(gulp, plugins, taskConfig);
      var taskResult = taskFn();
      if (typeof taskResult.then === 'function') {
        taskResult.then(callback);
      } else {
        callback();
      }
    };

    if (taskConfig.description) gulpFunc.description = taskConfig.description;

    gulp.task(taskConfig.taskName, gulpFunc);
};

module.exports = defineTask;
