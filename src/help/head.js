module.exports = `
Usage: head [OPTION]... [FILE]...
Print the first 10 lines of each FILE to standard output.
With more than one FILE, precede each with a header giving the file name.
With no FILE, or when FILE is -, read standard input.

  -n, --lines <number>        output the last N lines, instead of the last 10
  -q, --silent                suppresses printing of headers when multiple files
                                are being examined
  -v, --verbose               always output headers giving file names
      --help                  display this help and exit

Report head bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
