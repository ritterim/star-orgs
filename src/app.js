import Directory from './directory';
import SvgPanZoomMermaidRenderer from './svg-pan-zoom-mermaid-renderer';

const directory = new Directory();
const renderer = new SvgPanZoomMermaidRenderer();

const directoryUrl = 'directory';

directory
  .getUsers(directoryUrl)
  .then(users => {
    const containerElement = document.querySelector('#js-org-svg-container');

    renderer.renderSvg(containerElement, users);
  });
