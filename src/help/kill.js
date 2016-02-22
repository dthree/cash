module.exports = `
Usage: kill [OPTION] pid | jobspec ... or kill -l [sigspec]
Send a signal to a job.

Send the processes identified by PID or JOBSPEC the signal named by
SIGSPEC or SIGNUM.  If neither SIGSPEC nor SIGNUM is present, then
SIGTERM is assumed.

  -s sig         SIG is a signal name
  -n sig         SIG is a signal number
  -l [sigspec]   list the signal names; if arguments follow \`-l' they
                 are assumed to be signal numbers for which names
                 should be listed
      --help     display this help and exit

Exit status:
  0   if OK,
  1   if an invalid option is given or an error occurs.

Report kill bugs to <https://github.com/dthree/cash>
Cash home page: <http://cash.js.org/>
`;
