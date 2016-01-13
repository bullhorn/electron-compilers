## express-compilers

> Modeled off of [electron-compilers](https://github.com/electronjs/electron-compilers), updated for use in [express-compile](https://github.com/bullhorn/express-compile)

For JavaScript:

* JavaScript ES6/ES7 (via Babel)
* TypeScript
* CoffeeScript

For CSS:

* LESS
* SCSS
* SASS

For HTML:

* Jade

For JSON:

* CSON

### Why is this a separate repo?!

Shipping compilers for all of these languages will add a ton of weight to your
download size. Making this a separate top-level module allows you to mark it
as a `devDependency` and not include it in the final app.
