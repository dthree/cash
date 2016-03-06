module.exports = `
Usage: tail [OPTION]... [FILE]...
Display the last part of a file.

Print the last 10 lines of each FILE to standard output. With more
than one FILE, precede each with a header giving the file name.

  -n, --lines <number>        output the last N lines, instead of the last 10
  -q, --silent                suppresses printing of headers when multiple files
                                are being examined
  -v, --verbose               always output headers giving file names
      --help                  display this help and exit

Report tail bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
