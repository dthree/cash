---
id: faq
title: FAQ | Cash - cross-platform Linux without the suck
---

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