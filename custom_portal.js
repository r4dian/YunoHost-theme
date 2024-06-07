/* Config section
 *
 *  baseUrl should be one of:
 * 'https://www.gravatar.com';
 * 'https://seccdn.libravatar.org'
 * or some self hosted libravatar equivalent. https://wiki.libravatar.org/running_your_own/
 *
 *  defaultAvatar is an urlencoded address of a default image to use, 
 * e.g. https%3A%2F%2Fforum.yunohost.org%2Fuploads%2Fdefault%2Foriginal%2F2X%2Ff%2Ff59fe8e3ee6b100b4f574d30d6e30479c68b89f0.png
 * ...or one of the following:
 * 404  		: return an HTTP 404 (File Not Found) response
 * mp   		: (mystery-person) a simple, cartoon-style silhouette (does not vary by email)
 * identicon    : a geometric pattern based on an email hash
 * monsterid    : a generated "monster" with different colors, faces, etc
 * wavatar  	: a generated face with differing features and backgrounds
 * retro    	: an "awesome" generated, 8-bit arcade-style pixelated face
 * robohash 	: a generated robot with different colors, faces, etc
 * blank    	: (Gravatar only(?)) a transparent PNG image
 * pagan    	: (Libravatar only) a weird little RPG guy
 */
const baseUrl       = 'https://www.gravatar.com';
const defaultAvatar = 'retro';

/* Also, should we get a random Archillect image for the background ?
 */
const getArchillectBackground = true;

/* Stick your social link i nthe header, e.g. for https://streetpass.social/
 * set to false to disable.
 */ 
const socialurl = false // e.g. 'https://fediverse-server/@username';

const userMail      = document.querySelector('.user-mail')
const email         = userMail !== null ? userMail.innerText : ''

async function getSha256(string) {
    const msgUint8    = new TextEncoder().encode(string);                               // encode as (utf-8) Uint8Array
    const hashBuffer  = await window.crypto.subtle.digest("SHA-256", msgUint8);         // hash it
    const hashArray   = Array.from(new Uint8Array(hashBuffer));                         // convert buffer to byte array
    const hashHex     = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
    return hashHex;
}

if (email !== null) {
    getSha256(email).then((digestHex) => 
        document.styleSheets[0].insertRule(".user-container::before { \
            background: rgba(0,0,0,.5) url('"+baseUrl+"/avatar/"+digestHex+".jpg?d="+defaultAvatar+"') center !important; \
            content: '\\00a0\\00a0' !important; \
        }", 0)
    );
}

if (getArchillectBackground) {
	const latestID = 410187;	// TODO fetch from .archillect_latest.json (which should be set up to refresh by cron job)
								// from https://archillect.mhsattarian.workers.dev/api/last
	const poolSize = 50;		// number of latest images to randomise through (to not get "THIS WAS REMOVED FROM TUMBLR" image.)
								// set poolSize = latestID to try all.
	document.styleSheets[0].insertRule(`.ynh-user-portal{
		background: linear-gradient( 
	    rgba(12,0,12,.9), 
	    rgba(12,0,12,.5) ), 
	    url('https://archillect.mhsattarian.workers.dev/${Math.floor(Math.random() * poolSize + (latestID-poolSize) +1)}/img') !important;
    }`);
}

if (socialurl) {
        let mastodon = document.createElement('link');
        mastodon.href= socialurl;
        mastodon.rel ='me';
        document.head.appendChild(mastodon);
}
