import nodemon from 'nodemon';
import { join } from 'path';

nodemon({
  scripts: join(__dirname, 'server.js'),
  ext: 'js json', // watching extension
});

on('start', function () {
  console.log('App has started');
})
  .on('quit', () => {
    console.log('App has quit');
    process.exit();
  })
  .on('restart', (files) => {
    console.log('App restarted due to change in files', files);
  });
