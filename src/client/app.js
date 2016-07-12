import Directory from './directory';
import GravatarImageRetriever from './gravatar-image-retriever';
import ForceDirectedGraphRenderer from './force-directed-graph-renderer';
import Office365GetPersonaPhotoImageRetriever from './office365-get-persona-photo-image-retriever';

const containerElement = document.getElementById('js-content-container');
const directoryUrl = 'directory';

const directory = new Directory();
const imageRetriever = process.env.IMAGE_RETRIEVER === 'Office365GetPersonaPhotoImageRetriever'
  ? new Office365GetPersonaPhotoImageRetriever()
  : new GravatarImageRetriever(75); // eslint-disable-line no-magic-numbers

const renderer = new ForceDirectedGraphRenderer(
  containerElement,
  imageRetriever);

const jsRecordCount = document.getElementById('js-record-count');
const jsSearchInput = document.getElementById('js-search-input');

directory
  .getUsers(directoryUrl)
  .then(users => {
    jsRecordCount.innerHTML = users.length;
    renderer.render(users);
  });

jsSearchInput.onfocus = () => jsSearchInput.select();
jsSearchInput.onkeyup = ev => renderer.search(ev.target.value);
