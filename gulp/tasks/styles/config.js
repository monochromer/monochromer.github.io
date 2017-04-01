function sortMediaQueries(a, b) {
  let A = a.replace(/\D/g, '');
  let B = b.replace(/\D/g, '');

  if (isMax(a) && isMax(b)) {
    return B - A;
  } else if (isMin(a) && isMin(b)) {
    return A - B;
  } else if (isMax(a) && isMin(b)) {
    return 1;
  } else if (isMin(a) && isMax(b)) {
    return -1;
  }

  return 1;
};

function isMax(mq) {
  return /max-width/.test(mq);
}

function isMin(mq) {
  return /min-width/.test(mq);
}

module.exports = {
  taskName: 'styles',
  description: 'Обработка стилей',
  isProduction: process.env.NODE_ENV === 'production',
  src: 'src/styles/*.*',
  watchFiles: 'src/styles/**/*.*',
  dest: 'build/assets/css/',
  plugins: {
    'autoprefixer': {
       browsers: ['>1%', 'last 4 version', 'ie 8', 'ie 9', 'ie 10', 'ie 11']
    },
    'css-mqpacker': {
      // sort: sortMediaQueries
      sort: true
    }
  }
};
