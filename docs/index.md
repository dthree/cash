---
id: home
title: Cash - cross-platform Linux without the suck
---

### What is Cash?

Cash is a cross-platform implementation of Unix shell commands written in pure ES6.

Huh? Okay - think Cygwin, except:

* No native compiling
* No ugly DLLs
* Works in any terminal
* 1/15th of the size
* Just:

```
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
