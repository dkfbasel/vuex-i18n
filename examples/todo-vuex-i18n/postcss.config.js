/* eslint-disable */
module.exports = {
	plugins: [
		require('autoprefixer')({
			browsers: ['Chrome >= 60',
				'Firefox >= 55',
				'Edge >= 12',
				'Explorer >= 10',
				'Safari >= 10'],
			cascade: true,
			add: true,
			remove: true
		})
	]
};
