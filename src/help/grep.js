module.exports = `
Usage: grep [OPTION]... PATTERN [FILE]...
Search for PATTERN in each FILE or standard input.
PATTERN is, by default, a basic regular expression (BRE).
Example: grep -i 'hello world' menu.h main.c

iwsvmbnHhqr

Regexp selection and interpretation:
  -i, --ignore-case         ignore case distinctions
  -w, --word-regexp         force PATTERN to match only whole words

Miscellaneous:
  -s, --no-messages         suppress error messages
  -v, --invert-match        select non-matching lines
      --help                display this help and exit

Output control:
  -n, --line-number         print line number with output lines
  -H, --with-filename       print the file name for each match
  -h, --no-filename         suppress the file name prefix on output
  -q, --quiet, --silent     suppress all normal output
  -r, --recursive           like --directories=recurse
      --include <FILE_PATTERN>  search only files that match FILE_PATTERN

When FILE is -, read standard input.  With no FILE, read . if a command-line
-r is given, - otherwise.  If fewer than two FILEs are given, assume -h.
Exit status is 0 if any line is selected, 1 otherwise;
if any error occurs and -q is not given, the exit status is 2.

Report grep bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
