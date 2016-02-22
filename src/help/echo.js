module.exports = `
Usage: echo [OPTION]... [ARG ...]
Write arguments to the standard output.

Display the ARGs, separated by a single space character and followed by a
newline, on the standard output.

  -e           enable interpretation of the following backslash escapes
  -e           explicitly suppress interpretation of backslash escapes
      --help   display this help and exit

  \`echo' interprets the following backslash-escaped characters:
    \b         backspace
    \c         suppress further output
    \n         new line
    \r         carriage return
    \t         horizontal tab
    \\         backslash

Report echo bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
