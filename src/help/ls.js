module.exports = `
Usage: ls [OPTION]... [FILE]...
List information about the FILEs (the current directory by default).
Sort entries alphabetically if none of -tSU nor --sort is specified.

  -a, --all                  do not ignore entries starting with .
  -A, --almost-all           do not list implied . and ..
  -d, --directory            list directory entries instead of contents,
                               and do not dereference symbolic links
  -f                         do not sort, enable -aU, disable -ls --color
  -F, --classify             append indicator (one of */=>@|) to entries
  -h, --human-readable       with -l, print sizes in human readable format
  -i, --inode                print the index number of each file
  -l                         use a long listing format
  -q, --hide-control-chars   print ? instead of non graphic characters
  -r, --reverse              reverse order while sorting
  -R, --recursive            list subdirectories recursively
  -S                         sort by file size
  -t                         sort by modification time, newest first
  -U                         do not sort; list entries in directory order
  -w, --width=COLS           assume screen width instead of current value
  -x                         list entries by lines instead of by columns
  -1                         list one file per line
      --help                 display this help and exit

Exit status:
  0   if OK,
  1   if minor problems (e.g., cannot access subdirectory),
  2   if serious trouble (e.g., cannot access command-line argument).

Report ls bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
