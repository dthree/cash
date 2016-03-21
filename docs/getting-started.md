---
id: getting-started
title: Getting Started | Cash - cross-platform Linux without the suck
---

## Getting Started

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