import Directory from './directory';
import ForceDirectedGraphRenderer from './force-directed-graph-renderer';

const directory = new Directory();
const renderer = new ForceDirectedGraphRenderer();

const directoryUrl = 'directory';

directory
  .getUsers(directoryUrl)
  .then(users => {
    const containerElement = document.querySelector('#js-org-svg-container');

    renderer.renderSvg(containerElement, users);
  });
