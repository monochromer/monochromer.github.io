/**
 * Создание zip-архива со сборкой
 */
const correctNumber = number => number < 10 ? '0' + number : number;

const getDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = correctNumber(now.getMonth() + 1);
  const day = correctNumber(now.getDate());
  const hours = correctNumber(now.getHours());
  const minutes = correctNumber(now.getMinutes());

  return `${year}-${month}-${day}-${hours}${minutes}`;
};

module.exports = (gulp, plugins, config) => (done) => {
  return plugins.combiner(
    gulp.src(config.src),
    plugins.zip(config.fileName || 'build-(' + getDateTime() + ').zip'),
    gulp.dest(config.dest)
  ).on('error', config.onError);
};
