const yargs = require("yargs");

process.on("message", () => {
    const numCpu = require("os").cpus().length;
    const info = {
        args: yargs.argv,
        so: process.platform,
        version: process.version,
        execPath: process.execPath,
        pid: process.pid,
        src: process.cwd(),
        cpus: numCpu
    };
    process.send(info);
});

