module.exports = `
Usage: source FILENAME [ARGUMENTS...]
  or:  . FILENAME [ARGUMENTS...]
Read and execute commands from the filename argument in the current shell.

When a script is run using source, it runs within the existing shell and any
change of directory or modified variables or aliases will persist after the
script completes. Scripts may contain any commands that cash supports.

      --help   display this help and exit

Report source bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
