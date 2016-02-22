module.exports = `
Usage: cp [OPTION]... [-T] SOURCE DEST
  or:  cp [OPTION]... SOURCE... DIRECTORY
Copy SOURCE to DEST, or multiple SOURCE(s) to DIRECTORY.

  -f, --force           if an existing destination file cannot be
                          opened, remove it and try again (this option
                          is ignored when the -n option is also used)
  -n, --no-clobber      do not overwrite an existing file (overrides
                          a previous -i option)
  -R, -r, --recursive   copy directories recursively
      --help            display this help and exit

Report cp bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
