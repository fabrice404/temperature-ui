const fs = require('fs');
const NodeSsh = require('node-ssh'); // eslint-disable-line import/no-extraneous-dependencies

const ssh = new NodeSsh();

const listFiles = (path) => {
  let files = [];
  const list = fs.readdirSync(`${path}`);
  list.forEach((filename) => {
    const file = `${path}/${filename}`;
    const stat = fs.statSync(`${file}`);
    if (stat && stat.isDirectory()) {
      files = files.concat(...listFiles(file));
    } else {
      files.push(file);
    }
  });
  return files;
};

const uploadFiles = async (files) => {
  const failed = [];
  for (let i = 0; i < files.length; i += 1) {
    const source = files[i];
    const file = source.replace(`${__dirname}/build/`, '');
    const destination = `${process.env.SSH_FOLDER}/${file}`;
    try {
      await ssh.putFile(source, destination); // eslint-disable-line no-await-in-loop
    } catch (ex) {
      process.stderr.write(
        `error on sending: ${file}\n${ex.stack.split(process.env.SSH_FOLDER).join('/*secret*/')}`,
      );
      failed.push(file);
    }
  }
  return failed;
};

(async () => {
  let failed = [];

  // connect to ssh
  await ssh.connect({
    host: process.env.SSH_HOST,
    username: process.env.SSH_USERNAME,
    password: process.env.SSH_PASSWORD,
    port: 22,
  });

  if (process.env.SSH_FOLDER.trim() !== '') {
    // delete what exists in current folder
    await ssh.execCommand(`rm -rf ${process.env.SSH_FOLDER}/*`);

    // upload files
    const files = listFiles(`${__dirname}/build`);
    failed = await uploadFiles(files);
  }

  process.stdout.write(
    `the directory transfer was ${failed.length === 0 ? 'successful' : 'unsuccessful'}`,
  );
  if (failed.length > 0) {
    process.stderr.write(`failed transfers: \n${failed.join('\n')}`);
  }
  ssh.dispose();
})();
