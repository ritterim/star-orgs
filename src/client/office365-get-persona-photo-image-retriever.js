// This relies on the user's browser being logged in to an Office365 account
// that has the appropriate permissions.
//
// This is not an ideal way to do this.
export default class Office365GetPersonaPhotoImageRetriever {
  getImageUrl(email) {
    // Photo sizes reference:
    // https://blogs.msdn.microsoft.com/briangre/2014/03/11/options-for-sharepoint-user-profile-properties-and-photos/
    // (assuming all those sizes work here)
    return 'https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto'
      + `?email=${email}`
      + '&size=HR240x240';
  }
}
