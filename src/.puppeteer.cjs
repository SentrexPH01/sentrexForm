import { join } from 'path';

/**
 * @type {import("puppeteer").Configuration}
 */
const puppeteerConfig = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};

export default puppeteerConfig;
