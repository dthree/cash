module.exports = `
Usage: export [OPTION] [name[=value]]
Export variables into the environment

Without arguments, \`export' prints the list of environnmental variables in the
form \`declare -x NAME="VALUE"' on standard output. This is the same as the
behavior if \`-p' is given.

Otherwise, the variable is exported to the environment. If the variable has
already been defined in the environment (ex. \`PATH'), then this will either
redefine its value or do nothing (if no value is passed in). If the variable is
not already in the environment, it will be added with the \`VALUE' given
(defaults to the empty string).

  -p           print all exported variables in a reusable format
      --help   display this help and exit

Report export bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
