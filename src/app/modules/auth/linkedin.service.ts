export class LinkedInService {
  loginWithLinkedIn() {
    // const clientId = environment.linkedIn_id;
    // const redirectUri = encodeURIComponent(
    //   "http://localhost:8800/auth/linkedin/callback"
    // );
    // const scope = "r_liteprofile r_emailaddress";
    // const state = crypto.randomUUID(); // ou un autre token CSRF

    // const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    // window.location.href = url;
    window.location.href = "http://localhost:8800/auth/linkedin";
  }
}
