import _ from 'lodash';

const filenames = [
  'css/less',
  'css/sass',
  'js/babel',
  'js/typescript',
  'js/coffeescript',
  'html/inline-html',
  'html/jade',
  'passthrough'
];

module.exports = _.map(filenames, (x) => require('./' + x).default);
