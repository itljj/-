var gulp=require("gulp"),
    less=require("gulp-less"),
    cssmin=require("gulp-cssmin"),
    autoprefixer=require("gulp-autoprefixer"),
    rev=require("gulp-rev"),
    imagemin=require("gulp-imagemin"),
    rename=require("gulp-rename"),
    useref=require("gulp-useref"),
    gulpif=require("gulp-if"),
    uglify=require("gulp-uglify"),
    revCollector=require("gulp-rev-collector");

//处理css
gulp.task("css",function(){
   return  gulp.src("./public/less/main.less")
    .pipe(less())
        .pipe(cssmin())
        .pipe(autoprefixer())
        .pipe(rev())
        .pipe(gulp.dest("./release/public/"))
        .pipe(rev.manifest())
        .pipe(rename("css-manifest.json"))
        .pipe(gulp.dest("./release/rev"));
})

//处理图片
gulp.task("img",function(){
    return gulp.src(["./public/images/**/*","./uploads/*"],{base:"./"})
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest("./release"))
        .pipe(rev.manifest())
        .pipe(rename("image-manifest.json"))
        .pipe(gulp.dest("./release/rev"));
});
//处理js
gulp.task("js",function(){
    return gulp.src("./index.html")
        .pipe(useref())

        .pipe(gulpif("*.js",rev()))
        .pipe(gulp.dest("./release"))
        .pipe(rev.manifest())
        .pipe(rename("js-manifest.json"))
        .pipe(gulp.dest("./release/rev"));
});
//其他不要构建的内容要移动到release下
gulp.task("other", function () {
    gulp.src(["./api/*","./public/fonts/*","./public/libs/*","./favicon.ico"],{base:"./"})
        .pipe(gulp.dest("./release"))
});

//替换
gulp.task("rev",["css","img","js"], function () {
    gulp.src(["./release/rev/*.json","./release/index.html"])
        .pipe(revCollector())
        .pipe(gulp.dest("./release"))
});

gulp.task("default",["rev","other"]);

