require('./styles.css');
require('font-awesome/css/font-awesome.min.css');

import Directory from './directory';
import ForceDirectedGraphRenderer from './force-directed-graph-renderer';
import GravatarImageRetriever from './gravatar-image-retriever';

const containerElement = document.getElementById('js-org-svg-container');
const directoryUrl = 'directory';
const filterFunction = x => x.department;

const directory = new Directory();
const picturePxSize = 150;
const imageRetriever = new GravatarImageRetriever(picturePxSize);
const renderer = new ForceDirectedGraphRenderer(
  containerElement,
  imageRetriever);

directory
  .getUsers(directoryUrl, filterFunction)
  .then(users => renderer.render(users));

const jsSearchInput = document.getElementById('js-search-input');

jsSearchInput.onfocus = () => jsSearchInput.select();
jsSearchInput.onkeyup = ev => renderer.search(ev.target.value);
