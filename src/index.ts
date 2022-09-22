#!/usr/bin/env node

import arg from 'arg'
import chalk from 'chalk'
import clipboard from 'clipboardy'
import got from 'got'
import { chromium } from 'playwright-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

import type { ProxyLookup } from './models/lookup'
chromium.use(StealthPlugin())
import debugConsole from 'debug'
import { SocksProxyAgent } from 'socks-proxy-agent'
const debug = debugConsole('5socks')

const user = process.env['_5SOCKS_USER']
const pass = process.env['_5SOCKS_PASS']

const args = arg({
  // Types
  '--headful': Boolean,

  // Aliases
  '-h': '--headful'
})

debug('args: %O', args)

/**
 *
 * @param socks {str} - host:port of the proxy
 * @returns {Promise<ProxyLookup>} - proxy lookup from undetect.io
 */
const checkSOCKS = async (socks: string): Promise<ProxyLookup> => {
  const proxyUrl = `socks5://${socks}`
  const agent = new SocksProxyAgent(proxyUrl)

  try {
    const response = await got.get('https://lumtest.com/echo.json', {
      agent: {
        https: agent
      },
      https: { rejectUnauthorized: false },
      responseType: 'json',
      timeout: {
        request: 10000
      }
    })

    debug('/checkSOCKS %d => %O', response.statusCode, response.body)

    return response.body as ProxyLookup
  } catch (error) {
    debug('checkSOCKS-failure', error)
  }
}

/**
 * @param country {str} - 2 letter country code (ISO)
 * @param region {str} - 2 letter US State code (optional)
 */
export const findSOCKS = async (preferNonHeadless: boolean, country: string, region?: string): Promise<void> => {
  debug('findSOCKS preferNonHeadless: %s | country: %s | region: %s', preferNonHeadless, country, region)

  const browser = await chromium.launch({ headless: !preferNonHeadless })
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    permissions: ['clipboard-read', 'clipboard-write']
  })

  const page = await context.newPage()
  debug('5socks init')

  await page.goto('https://admin.5socks.net/', { waitUntil: 'networkidle' })
  await page.waitForSelector('input[name="user"]')

  await page.fill('input[name="user"]', user)
  await page.fill('input[name="pass"]', pass)

  await Promise.all([page.click('center > input[type="SUBMIT"]'), page.waitForNavigation({ waitUntil: 'networkidle' })])

  await page.waitForSelector('input[value="Proxy Search"]')
  debug('Authenticaton successful')

  await Promise.all([
    page.click('input[value="Proxy Search"]'),
    page.waitForResponse(
      (response) => response.url().includes('cgi-bin/online.cgi?action=getcountrys') && response.status() === 200
    )
  ])
  await page.waitForFunction(() => [...document.querySelectorAll('#getit > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr')].length > 30)

  // Perform some sketchy js evaluation to find the country code
  const countryCode = country.toUpperCase()
  const countryLink = await page.evaluate((countryCode) => {
    const countryTd = [
      ...document.querySelectorAll(
        '#getit > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody:nth-child(1) > tr > td:nth-child(2)'
      )
    ].find((el) => el.textContent.includes(countryCode))

    const countryLink = [...countryTd.parentElement.querySelectorAll('a')].map((e) => e.href)[1]
    return countryLink
  }, countryCode)
  debug('Found country link %O', countryLink)

  await Promise.all([
    page.goto(countryLink, { waitUntil: 'networkidle' }),
    page.waitForResponse(
      (response) => response.url().includes('cgi-bin/online.cgi?country=') && response.status() === 200
    )
  ])

  if (region !== undefined) {
    await page.locator('a', { hasText: '[search]' }).first().click()
    await page.waitForSelector('input[name="s_state"]')
    await page.fill('input[name="s_state"]', region)
    await page.locator('a', { hasText: 'SEARCH' }).first().click()
  }

  const headerMessage = await page.$eval(
    'form > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td',
    (el) => el.textContent
  )
  console.log(chalk.blue('5SOCKS Stats: '), chalk.green(headerMessage))

  // Sort by speed
  await Promise.all([
    page.locator('a', { hasText: 'Uptime' }).first().click(),
    page.waitForResponse((response) => response.url().includes('cgi-bin/online.cgi') && response.status() === 200)
  ])
  console.log(chalk.blue('Sorted by Uptime DESC (fastest first) ⚡️🏃🏻'))

  // Choose the top result unless already previously used (indicated by red styling)
  const evalString = await page.evaluate(() => {
    const firstAvail = [...document.querySelectorAll('td > a')].find(e => e.parentElement.parentElement.querySelector('td:first-child')['bgColor'] !== 'red')
    return decodeURI((firstAvail as HTMLLinkElement).href) 
  });
  debug('extracted eval string: %s', evalString)

  // Catch the popup
  const [popup] = await Promise.all([
    // It is important to call waitForEvent before click to set up waiting.
    page.waitForEvent('popup'),
    // Opens popup.
    page.evaluate(evalString)
  ])
  debug('intercepted-popup %s ', popup.url())

  await Promise.all([
    popup.click('a#c2v'),
    popup.waitForSelector('input[value="Please Enable JavaScript..."]', { timeout: 30 * 1000 }),
    popup.waitForFunction(() => document.querySelector('body > form > center > font > input[type=text]')),
  ])
  debug('proxy-buy-success')


  // Copy to clipboard
  await page.waitForTimeout(2500)
  const proxy = await popup.evaluate(() => (document.querySelector('body > form > center > font > input[type=text]') as HTMLInputElement).value)
  debug('extracted-proxy: %s', proxy)
  
  // Check the proxy (read from clipboard)
  const lookupResult = await checkSOCKS(proxy)
  console.log(JSON.stringify(lookupResult, null, 2))
  
  // Put it on the clipboard for convenience
  await clipboard.write(proxy)

  await Promise.all([popup.close(), page.close(), browser.close()])
  debug('5socks deinit complete')
}

findSOCKS(args['--headful'] ?? false, args._[0], args._[1]).catch(console.error)
