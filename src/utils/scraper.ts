import puppeteer from 'puppeteer';
import { SCRAPING_URL, UISelectors } from '../enums';
import { QueryParams } from "src/types/params";
import logger from './logger';

const scrape = async (queryParams: QueryParams) => {
  logger('<-------- Scraping is started --------->');

  //Lanuch browser and target page.
  //args is for only Linux. Work fine without args on Windows
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
});
  const page = await browser.newPage();
  await page.goto(SCRAPING_URL, { waitUntil: 'networkidle2' });

  const waitingLoadingTable = async (info: string) => {
    const loadingSelector = UISelectors.LOADING_CONTENT_SELECTOR;

    // Wait for the loading indicator to become visible.
    logger(info);
    logger('Wait for the loading indicator to become visible =====>');
    await page.waitForFunction((selector: string) => {
      const element = document.querySelector(selector);
      return element && window.getComputedStyle(element).display !== 'none';
    }, {}, loadingSelector);

    // Wait for the loading indicator to disappear.
    logger('Wait for the loading indicator to disappear =====>');
    await page.waitForFunction((selector: string) => {
      const element = document.querySelector(selector);
      return !element || window.getComputedStyle(element).display === 'none';
    }, {}, loadingSelector);
  }

  logger('Browser and page are launched =====>');
  // Fill in the form using queryParams.
  if (queryParams.lastName) {
    await page.type(UISelectors.LASTNAME_SELECTOR, queryParams.lastName);
  }
  if (queryParams.firstName) {
    await page.type(UISelectors.FIRSTNAME_SELECTOR, queryParams.firstName);
  }
  if (queryParams.informalName) {
    await page.type(UISelectors.INFORMALNAME_SELECTOR, queryParams.informalName);
  }
  if (queryParams.registrationNumber) {
    await page.type(UISelectors.REGISTRATION_NUMBER_SELECTOR, queryParams.registrationNumber);
  }
  if (queryParams.registrationClass) {
    await page.select(UISelectors.REGISTRATION_CLASS_SELECTOR, queryParams.registrationClass);
  }
  if (queryParams.registrationStatus) {
    await page.select(UISelectors.REGISTRATION_STATUS_SELECTOR, queryParams.registrationStatus);
  }
  if (queryParams.contactLensMentor) {
    await page.select(UISelectors.CONTACT_LENS_MENTOR_SELECTOR, queryParams.contactLensMentor);
  }
  if (queryParams.practiceName) {
    await page.type(UISelectors.PRACTICE_NAME_SELECTOR, queryParams.practiceName);
  }
  if (queryParams.cityOrTown) {
    await page.type(UISelectors.CITY_OR_TOWN_SELECTOR, queryParams.cityOrTown);
  }
  if (queryParams.postalCode) {
    await page.type(UISelectors.POSTAL_CODE_SELECTOR, queryParams.postalCode);
  }
  if (queryParams.languageOfService) {
    await page.select(UISelectors.LANGUAGE_OF_SERVICE_SELECTOR, queryParams.languageOfService);
  }
  if (queryParams.areaOfService) {
    await page.select(UISelectors.AREA_OF_SERVICE_SELECTOR, queryParams.areaOfService);
  }

  // Submit the form.
  await page.click(UISelectors.FIND_BUTTON_SELECTOR);
  await page.waitForSelector(UISelectors.TABLE_CONTENT_SELECTOR);

  // Handle pagination and scraping.
  let pageNumber = 1;
  const results = [];

  const isChangeButtonVisible = await page.waitForSelector(UISelectors.CHANGE_PAGE_SIZE_BUTTON, { timeout: 500, visible: true })
    .then(() => true)
    .catch(() => false);
  
  //Click page size as 50.
  if (isChangeButtonVisible) {
    await page.click(UISelectors.CHANGE_PAGE_SIZE_BUTTON);
    await page.waitForSelector(UISelectors.PAGE_SIZE_50_CONTENT_SELECTOR);
    await page.click(UISelectors.PAGE_SIZE_50_CONTENT_SELECTOR);

    await waitingLoadingTable('Waiting for resize of number of items in table');

    const isChangeButtonVisible = await page.waitForSelector(UISelectors.CHANGE_PAGE_SIZE_BUTTON, { timeout: 500, visible: true })
      .then(() => true)
      .catch(() => false);

    if (isChangeButtonVisible) {
      //Get number of pages and total items
      logger('Get number of pages and total items =====>');
      const itemAndPage = await page.evaluate((selector: string) => {
        const infoDiv = document.querySelector(selector);
        const itemsText = infoDiv.querySelectorAll('strong')[0].innerText;
        const pagesText = infoDiv.querySelectorAll('strong')[1].innerText;
        return {
          items: itemsText,
          pages: pagesText
        };
      }, UISelectors.PAGE_ITEM_CONTENT_SELECTOR)

      logger('Number of pages and total items is ', itemAndPage);
      pageNumber = parseInt(itemAndPage.pages);
    }
    
  }
  
  logger('Handling pagenation and scraping are stared =====>');
  do {
    logger('Page number is ', pageNumber);
    //Scraping data from table.
    const data = await page.evaluate((selector: string) => {
      const rows = document.querySelectorAll(selector);
      const data = Array.from(rows, row => {
        const columns = row.querySelectorAll('td');
        return {
          name: columns[0]?.innerText,
          status: columns[1]?.innerText,
          class: columns[2]?.innerText,
          location: columns[3]?.innerText,
          id: columns[5]?.innerText,
        };
      });

      //Filter valid data. Table contains non-valid data.
      return data.filter((item) => item.name && item.status && item.class && item.location && item.id);
    }, `${UISelectors.TABLE_CONTENT_SELECTOR} tr`);

    results.push(...data);
    logger('Size of data is ', data.length)
    logger('Data of on current page is ', data);

    //Click Next page button.
    const isNextButtonVisible = await page.waitForSelector(UISelectors.NEXT_BUTTON_SELECTOR, { timeout: 500, visible: true })
      .then(() => true)
      .catch(() => false);

    if (isNextButtonVisible && pageNumber > 1) {
      await page.click(UISelectors.NEXT_BUTTON_SELECTOR);
      await waitingLoadingTable(`Waiting for loading ${pageNumber} page`);
    }

    pageNumber --;
  } while (pageNumber > 0);

  await browser.close();
  logger('Browser and page are closed =====>');

  logger('Final result is ', results);
  logger('<-------- Scraping is ended --------->');
  return results;
};

export {
  scrape,
}