module.exports = `
Usage: touch [OPTION]... FILE...
Update the access and modification times of each FILE to the current time.

A FILE argument that does not exist is created empty, unless -c is
supplied.

  -a                      change only the access time
  -c, --no-create         do not create any files
  -d, --date <STRING>     parse STRING and use it instead of current time
  -m                      change only the modification time
  -r, --reference <FILE>  use this file's times instead of current time
      --time <WORD>       change the specified time:
                            WORD is access, atime, or use: equivalent to -a
                            WORD is modify or mtime: equivalent to -m
      --help              display this help and exit

Report touch bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
