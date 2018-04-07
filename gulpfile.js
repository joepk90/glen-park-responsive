// TODO Fix browser sync, gulp setup
// Example Gulp Setups for Jekyll:
// https://aaronlasseigne.com/2016/02/03/using-gulp-with-jekyll/
// https://gist.github.com/dope/071dc7741f6ab2c77116

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat');
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    del = require('del'),
    child = require('child_process'),
    gulpUtil = require('gulp-util'),
    browserSync = require('browser-sync').create();


//less plugins
var less = require('gulp-less'),
    LessAutoprefix = require('less-plugin-autoprefix');

var lessAutoprefix = new LessAutoprefix({
  browsers: ['last 2 versions']
});


var imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    imageminJpegcompress = require('imagemin-jpeg-recompress');

// File paths
var DIST_PATH = 'public/dist';
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';

var siteRoot = '_site';

basepaths = {
        src: 'source',
        dest: 'dist'
    },

    paths = {
        js: {
            src: basepaths.src + '/js',
            dest: basepaths.dest + '/js',
            node: 'node_modules'
            // bower: 'bower_components'
        },
        css: {
            src: basepaths.src + '/sass',
            dest: basepaths.dest
        },
        images: {
            src: basepaths.src + '/img',
            dest: basepaths.dest + '/img'
        },
        svgs: {
            src: basepaths.src + '/svg',
            dest: basepaths.dest + '/svg'
        }
    };


// SCSS Styles
gulp.task('styles', function () {
  console.log('starting styles task');
  return gulp.src(paths.css.src + '/**/*.scss')
  .pipe(plumber(function (err) {
    console.log('Styles Task Error');
    console.log(err);
    this.emit('end');
  }))
  .pipe(sourcemaps.init())
  .pipe(autoprefixer())
  .pipe(sass({
    outputStyle: 'compressed'
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.css.dest))
  .pipe(livereload());
});

// Scripts
gulp.task('scripts', function () {
  console.log('starting scripts task');

  return gulp.src(basepaths.src + '/js/**/*.js')
  .pipe(plumber(function (err) {
    console.log('Scripts Task Error');
    console.log(err);
    this.emit('end');
  }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(livereload());
});

// Images
gulp.task('images', function () {
  console.log('starting images task');

  return gulp.src(basepaths.src + '/**/*.{png,jpeg,jpg,svg,gif}')
  .pipe(plumber(function (err) {
    console.log('Scripts Task Error');
    console.log(err);
    this.emit('end');
  }))
  .pipe(imagemin(
    [
      imagemin.gifsicle(),
      imagemin.jpegtran(),
      imagemin.optipng(),
      imagemin.svgo(),
      imageminPngquant(),
      imageminJpegcompress()
    ]
  ))
  .pipe(gulp.dest(basepaths.dest + '/images'))
});

gulp.task('clean', function () {
  console.log('starting clean task');

  return del.sync([
    basepaths.dest
  ]);
})

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**', basepaths.src]
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
});

gulp.task('jekyll', function () {
  var jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  var jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gulpUtil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

// Default
// Second argument (the array []) runs declared scripts first
gulp.task('default', ['jekyll', 'styles', 'scripts', 'serve'], function () {
  console.log('starting default task');
});

// Watch
gulp.task('watch', function () {
  console.log('starting watch task');
  // require('./server.js');
  livereload.listen();
  gulp.watch(basepaths.src + '/js/**/*.js', ['scripts']);
  gulp.watch(basepaths.src + '/scss/**/*.scss', ['styles']);
});
