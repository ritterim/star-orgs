export default class Directory {
  getUsers(directoryUrl) {
    return fetch(directoryUrl, {
      credentials: 'same-origin'
    })
      .then(res => res.json());
  }
}
