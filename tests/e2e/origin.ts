export const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3100";
export const baseOrigin = new URL(baseURL).origin;

const parsedBaseURL = new URL(baseURL);
export const basePort = parsedBaseURL.port || (parsedBaseURL.protocol === "https:" ? "443" : "80");
