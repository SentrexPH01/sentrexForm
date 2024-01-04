import { join } from 'path';

/**
 * @type {import("puppeteer").Configuration}
 */
const puppeteerConfig = {
  // Changes the cache location for Puppeteer.
  // eslint-disable-next-line no-undef
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};

export default puppeteerConfig;
