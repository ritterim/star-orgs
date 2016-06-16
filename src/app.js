import Directory from './directory';
import ForceDirectedGraphRenderer from './force-directed-graph-renderer';

const containerElement = document.getElementById('js-org-svg-container');
const directoryUrl = 'directory';
const filterFunction = x => x.department;

const directory = new Directory();
const renderer = new ForceDirectedGraphRenderer(containerElement);

directory
  .getUsers(directoryUrl, filterFunction)
  .then(users => renderer.renderSvg(users));

const jsSearchInput = document.getElementById('js-search-input');

jsSearchInput.onfocus = () => jsSearchInput.select();
jsSearchInput.onkeyup = ev => renderer.search(ev.target.value);
