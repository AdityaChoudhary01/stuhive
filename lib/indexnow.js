// lib/indexnow.js

export async function pingIndexNow(urls) {
  const APP_URL = process.env.NEXTAUTH_URL || "https://stuhive.in";
  const INDEXNOW_KEY = "363d05a6f7284bcf8b9060f495d58655";

  // Ensure 'urls' is always an array
  const urlList = Array.isArray(urls) ? urls : [urls];

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: "stuhive.in",
        key: INDEXNOW_KEY,
        keyLocation: `${APP_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urlList,
      }),
    });

    if (response.ok || response.status === 202) {
      console.log(`✅ IndexNow Ping Success: Indexed ${urlList.length} URLs`);
      return true;
    } else {
      console.error(`❌ IndexNow Ping Failed: ${await response.text()}`);
      return false;
    }
  } catch (error) {
    console.error("IndexNow Ping Error:", error);
    return false;
  }
}