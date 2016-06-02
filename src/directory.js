export default class Directory {
  getUsers(directoryUrl) {
    return fetch(directoryUrl)
      .then(res => res.json());
  }
}
