module.exports = `
Usage: unalias [OPTION] name ...
Remove each name from the list of defined aliases.

  -a           remove all alias definitions
      --help   display this help and exit

Exit status:
  0   if OK,
  1   if a name is not an existing alias.

Report unalias bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
