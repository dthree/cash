<h1 align="center">
	<img width="284" src="http://i.imgur.com/tKrIdAI.jpg" alt="Cash">
	<!--<img width="256" src="http://i.imgur.com/oIN1WsM.jpg" alt="Cash">-->
</h1>


> Cross-platform Linux commands in pure ES6

[![Build Status](https://travis-ci.org/dthree/cash.svg)](https://travis-ci.org/dthree/cash/)
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/286om4y0wbxs69fy?svg=true)](https://ci.appveyor.com/project/dthree/cash)
[![Coverage Status](https://coveralls.io/repos/dthree/cash/badge.svg?branch=master&service=github)](https://coveralls.io/github/dthree/cash?branch=master)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-brightgreen.svg)](https://gitter.im/dthree/cash?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Cash is a cross-platform implementation of Unix shell commands written in straight ES6. No native compiling and no external dependencies.

While young, Cash aims to offer an alternative Linux feel on Windows and to open the door to cross-platform bash scripting in a Javascript environment.

```bash
> npm install cash -g
> cash
$
```

<p align="center">
  <img src="http://i.giphy.com/xT0BKNwUPFhFj2glry.gif" alt="Cash" />
</p>


### Woah.

Yeah. But it gets better. 

Let's mix some Windows & Unix commands together:

```bash
$ ipconfig | grep IPv4 | sort
IPv4 Address. . . . . . . . . . . : 10.10.40.50
IPv4 Address. . . . . . . . . . . : 192.168.100.11
$
```

[Learn more](https://github.com/dthree/cash/wiki/Usage-|-Interactive)


### But I don't want to type "cash"

No problem. Let's make all commands global on your system:

```bash
> npm install cash-global -g
> ls -lah
```

[Learn more](https://github.com/dthree/cash/wiki/Usage-|-Global)


### Nice, but I only want certain commands

You're covered!

```bash
> npm install cash-ls -g
> npm install cash-grep -g
```

[Learn more](https://github.com/dthree/cash/wiki/Usage-|-Global#installing-individual-commands)


### Wow. But I want this programmatically!

Again, you're in business:

```js
const $ = require('cash');
const out = $.ls('.', {l: true});
```

Not terse enough? How about this:

```js
const out = $('ls -lah');
```

Not :sunglasses: enough? Try this:

```js
require('cash') `
  cp -R ./src ./dest
  ls | grep *-spec.js | cat
  rm ./specResults.html 
`;
```

*For even better programmatic Unix commands, check out [ShellJS](https://github.com/shelljs/shelljs).*

[Learn more](https://github.com/dthree/cash/wiki/Usage-|-Programmatic)


### Isn't this impossible to do in Node?

It was, before [Vorpal](https://github.com/dthree/vorpal).

Made with ❤ by [dthree](https://github.com/dthree).

Love it? Give it a :star: or a tweet to help spread the word!


## Notice

This is now an [OPEN Open Source](http://openopensource.org/) project. I am not able to invest a significant amount of time into maintaining Cash and so am looking for volunteers who would like to be active maintainers of the project. If you are interested, shoot me a note.

## Contents

- [Introduction](#introduction)
- [Supported commands](#supported-commands)
- [Configuration (.cashrc)](#configuration)
- [Contributing](#contributing)
- [FAQ](#faq)
- [Team](#team)
- [License](#license)
- [Wiki](https://github.com/dthree/cash/wiki)

## Introduction

Cash is a project working on a cross-platform implementation of the most used Unix-based commands in pure JavaScript and with no external dependencies.

The goal of Cash is to open up these commands to the massive JavaScript community for the first time, and to provide a cleaner, simpler and flexible alternative to applications like Cygwin for those wanting the Linux feel on Windows.

Cash was built with strict attention to nearly exact implementations and excellent test coverage of over 200 unit tests.


## Supported commands

The following commands are currently implemented:

- alias
- cat
- clear
- cd
- cp
- echo
- export
- false
- grep
- head
- kill
- less
- ls
- mkdir
- mv
- pwd
- rm
- sort
- source
- tail
- touch
- true
- unalias

Want more commands?

- [Vote on the next commands](https://github.com/dthree/cash/wiki/Roadmap)
- [Help spread the word:](http://bit.ly/1LBEJ5s) More knowledge of Cash equals more contributors
- [Contribute](#contributing)


## Configuration

Want to configure things to your heart's content? Just add your configurations in a `.cashrc` file (`_cashrc` also works, for Windows folk) and put that in your home directory. This supports anything you can do inside a cash command prompt (`export`ing environmental variables, aliases, etc.).

## Contributing

- [Editing commands](https://github.com/dthree/cash/wiki/Contributing#editing-existing-commands)
- [Adding new commands](https://github.com/dthree/cash/wiki/Contributing)

We are currently looking for Core Team members who can push forward Cash at a rapid rate. Are you an awesome developer up to the challenge? Send me a ping.

### Awesome contributors

- [@nfischer](https://github.com/nfischer): Added `source`, `export`, `true` and `false` commands, among several other contributions.
- [@safinn](https://github.com/safinn): Added `clear` and `tail` commands.
- [@legien](https://github.com/legien): Added `head` command.
- [@cspotcode](https://github.com/cspotcode): Implemented template literal execution.

## FAQ


#### Why Cash?

In its very essence, Cash replaces the Windows CLI prompt (`>`) with the Unix one (`$`), the dollar symbol. 

Cash was most fitting in this sense: 

> Ask and ye shall receive

```
> cash
$
````

Cash is also a play on the word `bash`, and is actually[\[1\]](https://xkcd.com/906) a recursive acronym for Cash Shell.

Shout out to [@aseemk](https://github.com/aseemk) for donating the name.


#### Doesn't ShellJS do this?

No.
 
For those who don't know, [ShellJS](https://github.com/shelljs/shelljs) is an awesome Node package that implements UNIX shell commands programatically in JavaScript. Check it out - really. While ShellJS was tremendously helpful in figuring out how to accomplish Cash, the two do not really conflict.

ShellJS gives the feel of UNIX commands in a code environment, but aims to implement the commands in a way that makes sense for a JavaScript library. This means that many commands return JavaScript objects, and some of the rougher and more dangerous edges of bash have been softened a bit.

For example, with cash:
```javascript
$('ls'); // 'node_modules\n'

$('echo foo > foo.txt');
```

With ShellJS:
```javascript
ls(); // ['node_modules'];

echo('foo').to('foo.txt');
```


## Team

| [![David Caccavella](https://avatars.githubusercontent.com/u/10319897?s=130)](https://github.com/dthree) | [![Nate Fischer](https://avatars.githubusercontent.com/u/5801521?s=130)](https://github.com/nfischer) |
|:---:|:---:|
| [David Caccavella](https://github.com/dthree) | [Nate Fischer](https://github.com/nfischer) |

Want to join the team? [Let us know](mailto:threedeecee@gmail.com).

## License

MIT © [David Caccavella](https://github.com/dthree)
