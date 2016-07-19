import rp from 'request-promise';

// This relies on using cookies from an authenticated user,
// typically retrieved from a web browser by navigating to
// https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=test@example.com&size=HR96x96
// and then copying the Cookie request header out.
//
// Note: This method for retrieving photos is not ideal.
export default class Office365GetPersonaPhotoImageRetriever {
  constructor(cookieValue) {
    if (!cookieValue) {
      throw new Error('The process.env.OFFICE_365_GET_PERSONA_PHOTO_COOKIE must be set.');
    }

    this.cookieValue = cookieValue;
  }

  getImage(email) {
    if (!email) {
      return Promise.resolve(null);
    }

    return rp({
      method: 'GET',
      encoding: null,
      simple: false,
      resolveWithFullResponse: true,
      followRedirect: false, // Do not follow to the login page
      headers: {
        // I'm not a fan of setting the Host and User-Agent header,
        // but it seems to be necessary for this strategy to work:
        Host: 'outlook.office365.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
          + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',

        // I'm not a fan of specifying Cookie in this manner for authentication purposes,
        // but here we are.
        Cookie: this.cookieValue
      },

      // Photo sizes reference:
      // https://blogs.msdn.microsoft.com/briangre/2014/03/11/options-for-sharepoint-user-profile-properties-and-photos/
      // (assuming all those sizes work here)
      uri: `https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=${email}&size=HR96x96`
    }).then(res => {
      if (res.statusCode !== 200) { // eslint-disable-line no-magic-numbers
        throw new Error(`HTTP ${res.statusCode} returned while retrieving picture for ${email}.`);
      }

      // This could return a placeholder image.
      // With the nature of this potentially working temporarily due to
      // the authentication method, we'll just cache the placeholder image.

      return res.body;
    });
  }
}
