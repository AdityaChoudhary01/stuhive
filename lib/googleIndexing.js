import { JWT } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/indexing"];

async function getAccessToken() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("Missing Google credentials");
  }

  const client = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: SCOPES,
  });

  const { access_token } = await client.authorize();
  return access_token;
}

async function notifyGoogle(url, type) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    "https://indexing.googleapis.com/v3/urlNotifications:publish",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        type,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return true;
}

// 🚀 HELPER: Cleanly maps the 'type' string to the correct website URL
function getTargetUrl(baseUrl, urlID, type) {
  if (type === "note") return `${baseUrl}/notes/${urlID}`;
  if (type === "blog") return `${baseUrl}/blogs/${urlID}`;
  if (type === "profile") return `${baseUrl}/profile/${urlID}`; // ✅ New Profile Route added!
  
  throw new Error(`Invalid SEO indexing type provided: ${type}`);
}

export async function indexNewContent(urlID, type) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "https://www.stuhive.in";
    const targetUrl = getTargetUrl(baseUrl, urlID, type);

    await notifyGoogle(targetUrl, "URL_UPDATED");

    console.log("✅ SEO Success:", targetUrl);
    return true;
  } catch (error) {
    console.error("❌ SEO Error:", error.message);
    return false;
  }
}

export async function removeContentFromIndex(urlID, type) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "https://www.stuhive.in";
    const targetUrl = getTargetUrl(baseUrl, urlID, type);

    await notifyGoogle(targetUrl, "URL_DELETED");

    console.log("✅ SEO Delete Success:", targetUrl);
    return true;
  } catch (error) {
    console.error("❌ SEO Delete Error:", error.message);
    return false;
  }
}