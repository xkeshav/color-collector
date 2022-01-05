import nodemon from 'nodemon';
import { join } from 'path/posix';

nodemon({
	scripts: join(__dirname, 'server.ts'),
	ext: 'js ts json', // watching extension
})

	.on('start', function () {
		console.log('App has started');
	})
	.on('quit', () => {
		console.log('App has quit');
		process.exit();
	})
	.on('restart', (files) => {
		console.log('App restarted due to change in files', files);
	});
