# galdr

experiments in magick with svg

## install

```
npm install
```

## building/running

This is intended to be run as static web content.

To build for prod:
```
npm run build
```
(that will run webpack and just get the dist dir prepared)

To run a local development server:

```
npm run dev
```

## keys

when running, use [these keys](https://github.com/breedx2/galdr/blob/master/src/keys.js):

* `a` - draw again with the same chain
* `d` - show markov chain diagram
* `i` - invert (toggle dark mode)
* `n` - make new chain and draw
* `s` - save current to svg file
* `t` - toggle auto timer on/off
