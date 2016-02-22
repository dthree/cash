module.exports = `
Usage: alias [OPTION] [name[=value] ...]
Define or display aliases.

Without arguments, \`alias' prints the list of aliases in the reusable
form \`alias NAME=VALUE' on standard output.

Otherwise, an alias is defined for each NAME whose VALUE is given.
A trailing space in VALUE causes the next word to be checked for
alias substitution when the alias is expanded.

  -p           print all defined aliases in a reusable format
      --help   display this help and exit

Report alias bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
