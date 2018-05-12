//TODO Swap out source compiles with handlebars setup

const child = require('child_process');
const browserSync = require('browser-sync').create();

const gulp = require('gulp');
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const sass = require('gulp-sass');

const siteRoot = '_site';
// const cssFiles = '_css/**/*.?(s)css';



  basepaths = {
          src: 'source',
          dest: 'assets'
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
        },
        templates: {
          includes: './_includes',
          layouts: './_layouts',
          posts: './_posts'
        },
    };



gulp.task('styles', () => {
  gulp.src(paths.css.src + '/**/*.scss')
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(paths.css.dest));
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('bundle', ['exec', 'jekyll', 'build',
    // '--watch',
    // '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(paths.css.src + '/**/*.scss', ['styles']);
  gulp.watch(paths.templates.includes + '/**/*.html', ['jekyll']);
  gulp.watch(paths.templates.layouts + '/**/*.html', ['jekyll']);
  gulp.watch(paths.templates.posts + '/**/*.html', ['jekyll']);
});

gulp.task('default', ['styles', 'jekyll', 'serve']);
