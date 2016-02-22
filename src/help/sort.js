module.exports = `
Usage: sort [OPTION]... [FILE]...
Write sorted concatenation of all FILE(s) to standard output.

Ordering options:
  -M, --month-sort            compare (unknown) < 'JAN' < ... < 'DEC'
  -h, --human-numeric-sort    compare human readable numbers (e.g., 2K 1G)
  -n, --numeric-sort          compare according to string numerical value
  -R, --random-sort           sort by random hash of keys
  -r, --reverse               reverse the result of comparisons

Other options:
  -c, --check,
      --check=diagnose-first  check for sorted input; do not sort
  -o, --output=FILE           write result to FILE instead of standard output
      --help                  display this help and exit

With no FILE, or when FILE is -, read standard input.

Report sort bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
