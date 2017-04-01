const path = require('path');
const gulp = require('gulp');

// Создаем объект с gulp-плагинами и своми share-функциями
var plugins = require('gulp-load-plugins')();
Object.assign(plugins, {
  combiner: require('./utils/combiner'),
  browserSync: require('browser-sync').create()
});

const getTaskList = require('./utils/getTaskList');
const tasksPathList = getTaskList(path.join(__dirname, 'tasks'));
const defineTask = require('./utils/defineTask')(gulp, plugins);

// Регистрируем базовые задачи
tasksPathList.forEach(taskPath => defineTask({
  taskPath: taskPath
}));


// Регистрируем составные задачи

function watchFunc(done) {
  tasksPathList.forEach(taskPath => {
    let config = require(path.join(taskPath + '/config.js'));
    if (config.watchFiles && config.taskName) {
      gulp.watch(config.watchFiles, gulp.parallel(config.taskName));
    }
  });

  done();
};
watchFunc.description = 'Слежение за изменениями в файловой системе и автоматическая пересборка проекта';
gulp.task('watch', watchFunc);

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'fonts',
      'images',
      'views',
      gulp.series('sprite:images', 'sprite:svg', 'styles')
    )
  )
);

gulp.task(
  'dev',
  gulp.series(
    'build',
    gulp.parallel('server', 'watch')
  )
);

gulp.task('default', gulp.series('dev'));
