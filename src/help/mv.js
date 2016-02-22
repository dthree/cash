module.exports = `
Usage: mv [OPTION]... [-T] SOURCE DEST
  or:  mv [OPTION]... SOURCE... DIRECTORY
  or:  mv [OPTION]... -t DIRECTORY SOURCE...
Rename SOURCE to DEST, or move SOURCE(s) to DIRECTORY.

  -f, --force                  do not prompt before overwriting
  -n, --no-clobber             do not overwrite an existing file
      --striptrailingslashes   remove any trailing slashes from each SOURCE
                                 argument
  -v, --verbose                explain what is being done
      --help                   display this help and exit

If you specify -f and -n, only -f takes effect.

Report mv bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
