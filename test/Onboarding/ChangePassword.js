const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const defNewUser = require('./newUser');
const scrap = require('./scraper');
const { expect } = require('chai');

let userName =  defNewUser.getNewUser();
let passWord = process.env.PASSWORD;
let newPass = process.env.NEWPASS;
let logInPage = process.env.LOGIN_PAGE;
let emailAdmin =process.env.Email_ADMIN_USERNAME;
let apiUrl = process.env.API_URL;
let emailPassword = process.env.EMAIL_PASSWORD;
describe('Change password', function() {
	this.timeout(300000);
	let driver;
	let vars;
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
	beforeEach(async function() {
		driver = await new Builder().forBrowser('chrome').build();
		vars = {};

	});
	afterEach(async function() {
		await driver.quit();
	});
	it('Change password', async function() {
		// Test name: OTP
		// Step # | name | target | value
		// 1 | open | login |
		await driver.get(logInPage);
		await sleep(4000);
		// 2 | setWindowSize | 1295x687 |
		await driver.manage().window().maximize();
		// 3 | click | name=email |
		await driver.findElement(By.name('email')).click();
		await sleep(4000);

		await driver.findElement(By.name('email')).sendKeys(userName);
		await sleep(4000);

		// 4 | type | name=password | Holla2021!
		await driver.findElement(By.name('password')).sendKeys(passWord);
		await sleep(4000);
		// 5 | type | name=email | alicebitholla@gmail.com

		// 6 | click | name=password |
		// 7 | click | css=.holla-button |
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);

		// 8 | click | css=.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container |
		await driver.findElement(By.css('.d-flex:nth-child(4) > .side-bar-txt > .edit-wrapper__container')).click();
		await sleep(4000);

		// 9 | click | css=.tab_item:nth-child(2) > div |
		await driver.findElement(By.css('.tab_item:nth-child(2) > div')).click();
		await sleep(4000);
		// 10 | click | name=old_password |
		await driver.findElement(By.name('old_password')).click();
		// 11 | type | name=old_password | !
		await driver.findElement(By.name('old_password')).sendKeys(passWord);
		// 12 | type | name=new_password | !changed
		await driver.findElement(By.name('new_password')).sendKeys(newPass);
		// 13 | click | name=new_password_confirm |
		await driver.findElement(By.name('new_password_confirm')).click();
		// 14 | type | name=new_password_confirm | Holla2021!changed
		await driver.findElement(By.name('new_password_confirm')).sendKeys(newPass);
		// 15 | click | css=.holla-button |
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);

		assert(await driver.findElement(By.css('.success_display-content-text > .edit-wrapper__container')).getText() == 'You have successfully changed your password');
		// 37 | click | css=.holla-button |

	});
	it('Email Confirmation', async function() {
		console.log('Test name: Confirmation');
		console.log('Step # | name | target | value');
		await defNewUser.emailLogIn(driver,emailAdmin,emailPassword);
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'))), 50000);
		await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)')).click();
		console.log('2 | doubleClick | css=.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1) | ');
		{
			const element = await driver.findElement(By.css('.x-grid3-row:nth-child(1) .subject:nth-child(1) > .grid_compact:nth-child(1)'));
			await driver.actions({ bridge: true}).doubleClick(element).perform();
		}
		console.log('3 | selectFrame | index=1 | ');
		await driver.switchTo().frame(1);
		await sleep(10000);
		console.log('4 | storeText | xpath=/html/body/pre/a[4] | content');
		vars['content'] = await driver.findElement(By.xpath('/html/body/pre/a[4]')).getText();
		const emailCont = await driver.findElement(By.css('pre')).getText();
		console.log('5 | echo | ${content} | ');
		console.log('6 | assertText | xpath=/html/body/pre/a[4] | ${content}');
		expect(vars['content']).to.equal(userName.toLowerCase());

		console.log('7 | storeAttribute | yourwebsite/v2/confirm-change-password | mytextlink');
		{
			const attribute = apiUrl+'confirm-change-password'
			vars['mytextlink'] = attribute;
		}
		console.log('8 | echo | ${mytextlink} | ');
		console.log(vars['mytextlink']);
		console.log('9 |link starts with'+ apiUrl+'confirm-change-password');
		console.log(apiUrl+'confirm-change-password');
		console.log('10 | open | ${mytextlink} | ');
		const completedLink = await scrap.addRest(emailCont,vars['mytextlink']);
		await console.log(completedLink);
		await driver.get(completedLink);
		console.log('11 | selectFrame | relative=parent | ');
		await sleep(10000);
		await driver.findElement(By.css('.icon_title-wrapper')).click()
		console.log('12 | assertText | css=.icon_title-text | Success');
		assert(await driver.findElement(By.css('.icon_title-text')).getText() == 'Success')
	});
});
