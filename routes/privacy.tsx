export default function Privacy() {
  return <>
    <h1>[Draft] Privacy Policy</h1>
    
    <p>
      This service was created for and as part of a <a href="https://deno.com/blog/deno-kv-hackathon">72-hour hackathon</a>. It is not intended for production use. Use at your own risk.
    </p>

    <p>
      In the making of this service, little consideration was made for security or privacy. Use at your own risk.
    </p>

    <p>
      We do track some basic analytics, such as the number of times a short code is used, and feedback from users on wether a link or another user is suspicious. We do not track any personally identifiable information, unless you login. When you login, we track your github username, id, an avatar url and an access token that allows reading basic information you agree to when you first authorize this application with github. We do not store any other information available from github's API.
    </p>

     <p>
      There is an admin panel that allows site admins to view and delete all URLs and short codes, sessions and user info, including information from github. Also, the deno deploy admin page allows viewing all data for logged in users. Sufice it to say, you should not put secure links into this system as they are viewable in plain text by anyone with access to either of these resources.
    </p>

    <p>
      Users can delete their own URLs and short codes, but cannot edit them.
    </p>

    <p>
      Source is available at <a href="https://github.com/innovatedev-john-pope/sus.run">https://github.com/innovatedev-john-pope/sus.run</a>.
    </p>
  </>
}

export const config = {
  authType: "public",
}