'use strict';

const {
	initializeCurrencies,
	initializePairs,
} = require('./utils');
const { toBool } = require('./utils/conversion');

exports.NETWORK = process.env.NETWORK === 'mainnet' ? 'prod' : 'testnet';
exports.APM_ENABLED = toBool(process.env.APM_ENABLED) || false; // apm is used for sending logs etc

exports.API_HOST = process.env.API_HOST || 'localhost';
exports.DOMAIN = process.env.DOMAIN || (process.env.NODE_ENV === 'production' ? 'https://hollaex.com' : 'http://localhost:3000');

// CHANNEL CONSTANTS -----------------------------

exports.WEBSOCKET_CHAT_CHANNEL = '/chat';
exports.WEBSOCKET_CHAT_PUBLIC_ROOM = 'public';
exports.CHAT_MAX_MESSAGES = 50;
exports.ACTION_PARTIAL = 'partial';
exports.ACTION_UPDATE = 'update';

exports.CHAT_MESSAGE_CHANNEL = 'channel:chat:message';

exports.INIT_CHANNEL = 'channel:init';

exports.WITHDRAWALS_REQUEST_KEY = 'withdrawals:request';

exports.WS_USER_TRADE_TYPE = 'trade';
exports.WS_USER_ORDER_QUEUED_TYPE = 'order_queued';
exports.WS_USER_ORDER_PROCESSED_TYPE = 'order_processed';
exports.WS_USER_ORDER_CANCELED_TYPE = 'order_canceled';
exports.WS_USER_ORDER_ADDED_TYPE = 'order_added';
exports.WS_USER_ORDER_UPDATED_TYPE = 'order_updated';
exports.WS_USER_ORDER_REMOVED_TYPE = 'order_removed';
exports.WS_USER_ORDER_PARTIALLY_FILLED_TYPE = 'order_partialy_filled';
exports.WS_USER_ORDER_FILLED_TYPE = 'order_filled';
// CHANNEL CONSTANTS -----------------------------

const CONFIGURATION_CHANNEL = 'channel:configuration';
exports.CONFIGURATION_CHANNEL = CONFIGURATION_CHANNEL;
const STATUS_FROZENUSERS_DATA = 'status:frozenUsers:data';
exports.STATUS_FROZENUSERS_DATA = STATUS_FROZENUSERS_DATA;

const { subscriber } = require('./db/pubsub');

// Needs to be refined, for flushRedis error
const { promisifyAll } = require('bluebird');
const redis = require('redis');
const redisConfig = require('./config/redis');
promisifyAll(redis.RedisClient.prototype);
const client = redis.createClient(redisConfig.client);

let configuration = {
	coins: {},
	pairs: {},
	info: {},
	constants: {
		captcha: {},
		accounts: {},
		defaults: {},
		emails: {},
		plugins: {
			configuration: {}
		}
	},
	status: false
};

let secrets = {
	broker: {},
	security: {},
	captcha: {},
	smtp: {},
	vault: {},
	plugins: {
		s3: {
			key: {},
			secret: {}
		},
		sns: {},
		freshdesk: {},
		zendesk: {}
	}
};

let frozenUsers = {};

client.getAsync(STATUS_FROZENUSERS_DATA)
	.then((data) => {
		data = JSON.parse(data);
		if (data) {
			configuration = data.configuration;
			secrets = data.secrets;
			frozenUsers = data.frozenUsers;
		}
	});

subscriber.subscribe(CONFIGURATION_CHANNEL);

subscriber.on('message', (channel, data) => {
	if (channel === CONFIGURATION_CHANNEL) {
		data = JSON.parse(data);
		if (data.configuration) configuration = data.configuration;
		if (data.secrets) secrets = data.secrets;
		if (data.frozenUsers) frozenUsers = data.frozenUsers;
	}
});

exports.GET_CONFIGURATION = () => configuration;
exports.GET_SECRETS = () => secrets;
exports.GET_FROZEN_USERS = () => frozenUsers;

exports.MAX_TRADES = process.env.MAX_TRADES
	? parseInt(process.env.MAX_TRADES)
	: 50;

// TODO: need to check and make this dynamic only for trade volume data
exports.MAIN_CURRENCY = 'eur';

exports.SECRET_MASK = '************************';

const PAIRS = initializePairs(process.env.PAIRS);
exports.PAIRS = PAIRS;
exports.PAIR = (process.env.PAIR || '').toLowerCase();

const CURRENCIES = initializeCurrencies(process.env.CURRENCIES);

const BALANCE_TYPES = ['balance', 'available', 'pending'];
const _balanceKeys = [];
CURRENCIES.forEach((currency) => {
	BALANCE_TYPES.forEach((balance) => {
		_balanceKeys.push(`${currency}_${balance}`);
	});
});
exports.CURRENCIES = CURRENCIES;
exports.BALANCE_KEYS = _balanceKeys;
exports.NODE_ENV = process.env.NODE_ENV;

exports.SALT_ROUNDS = 10;
exports.AFFILIATION_CODE_LENGTH = 6;

// ACCOUNTS CONSTANTS -----------------------------

exports.ADMIN_ACCOUNT_ID = 1;
exports.DEFAULT_TIER = 1;

const ACCOUNTS = [
	{
		email: process.env.ADMIN_EMAIL,
		password: process.env.ADMIN_PASSWORD,
		is_admin: true,
		verification_level: exports.DEFAULT_TIER
	}
];

exports.ACCOUNTS = ACCOUNTS;

const ROLES = {
	SUPERVISOR: 'supervisor',
	SUPPORT: 'support',
	ADMIN: 'admin',
	KYC: 'kyc',
	TECH: 'tech',
	USER: 'user',
	HMAC: 'hmac'
};

exports.TOKEN_TYPES = {
	NORMAL: 'normal',
	DEV: 'dev',
	HMAC: 'hmac'
};

exports.SECRET = process.env.SECRET || 'shhhh';
exports.ISSUER = process.env.ISSUER || 'hollaex.com';

exports.HMAC_TOKEN_EXPIRY = 5 * 12 * 30 * 24 * 60 * 60 * 1000; // 5 years

exports.QUICK_TRADE_SECRET =
	process.env.QUICK_TRADE_SECRET || 'secret';

exports.ROLES = ROLES;
exports.BASE_SCOPES = [ROLES.USER, ROLES.HMAC];
// ACCOUNTS CONSTANTS -----------------------------

// ORDER TYPES --------------------------------------
exports.ORDER_TYPE_QUOTE = 'quote';
exports.ORDER_TYPE_LIMIT = 'limit';
exports.ORDER_TYPE_MARKET = 'market';

exports.ORDER_SIDE_BUY = 'buy';
exports.ORDER_SIDE_SELL = 'sell';
// ORDER TYPES --------------------------------------

exports.DEFAULT_ORDER_RISK_PERCENTAGE = 90; // used in settings in percentage to display popups on big relative big orders of user

exports.CAPTCHA_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify';

exports.MIN_VERIFICATION_LEVEL = 1;

exports.SEND_CONTACT_US_EMAIL = true;

exports.ZENDESK_HOST = process.env.ZENDESK_HOST || '';
exports.ZENDESK_KEY = process.env.ZENDESK_KEY || '';

exports.TOKEN_USER_LEVEL = parseInt(process.env.TOKEN_USER_LEVEL || 2, 10);
exports.MASK_CHARS = parseInt(process.env.MASK_CHARS || 5, 10);

exports.MAX_ORDER_QUEUE = parseInt(process.env.MAX_ORDER_QUEUE) || 10;

// WALLI CONSTANTS -----------------------------
exports.VAULT_ENDPOINT = 'https://api.bitholla.com/v1/vault';

exports.CONFIRMATION = {
	btc: 1,
	eth: 15,
	bch: 2,
	xrp: 0
};

exports.CONSTANTS_KEYS = [
	'emails',
	'captcha',
	'plugins',
	'accounts',
	'api_name',
	'description',
	'color',
	'title',
	'links',
	'defaults',
	'logo_path',
	'logo_black_path',
	'valid_languages',
	'user_level_number',
	'new_user_is_activated',
	'broker_enabled',
	'secrets'
];

exports.SECRETS_KEYS = [
	'allowed_domains',
	'admin_whitelist',
	'broker',
	'security',
	'captcha',
	'smtp',
	'vault',
	'plugins'
];

//CSV Report keys
exports.AUDIT_KEYS = [
	'id',
	'admin_id',
	'event',
	'description.new',
	'description.old',
	'description.note',
	'description.user_id',
	'ip',
	'domain',
	'timestamp'
];

exports.TECH_AUTHORIZED_CONSTANTS = [
	'emails',
	'captcha',
	'plugins',
	'secrets'
];

exports.TECH_AUTHORIZED_SECRETS = [
	'allowed_domains',
	'admin_whitelist',
	'captcha',
	'smtp',
	'plugins'
];

const MAINNET_EXPLORERS = {
	btc: [
		{
			name: 'Blockchain.info',
			baseUrl: 'https://www.blockchain.com',
			txPath: '/btc/tx'
		},
		{
			name: 'BlockCypher',
			baseUrl: 'https://live.blockcypher.com',
			txPath: '/btc/tx'
		},
		{
			name: 'Blockstream',
			baseUrl: 'https://blockstream.info',
			txPath: '/tx'
		},
		{
			name: 'Bitcoin.com',
			baseUrl: 'https://explorer.bitcoin.com',
			txPath: '/btc/tx'
		}
	],
	eth: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		},
		{
			name: 'Blockchain.info',
			baseUrl: 'https://www.blockchain.com',
			txPath: '/eth/tx'
		}
	],
	xht: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	usdt: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	dai: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	sai: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	mkr: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	bnb: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	bat: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	leo: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	zrx: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	bch: [
		{
			name: 'Blockchain.info',
			baseUrl: 'https://www.blockchain.com',
			txPath: '/bch/tx'
		},
		{
			name: 'Bitcoin.com',
			baseUrl: 'https://explorer.bitcoin.com',
			txPath: '/bch/tx'
		}
	],
	xrp: [
		{
			name: 'xrpscan',
			baseUrl: 'https://xrpscan.com',
			txPath: '/tx'
		},
		{
			name: 'Bithomp',
			baseUrl: 'https://bithomp.com',
			txPath: '/explorer'
		}
	],
	xmr: [
		{
			name: 'MoneroBlocks',
			baseUrl: 'https://moneroblocks.info',
			txPath: '/tx'
		}
	],
	xaut: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	xlm: [
		{
			name: 'stellarhain.io',
			baseUrl: 'https://stellarchain.io',
			txPath: '/tx'
		}
	],
};

const TESTNET_EXPLORERS = {
	btc: [
		{
			name: 'Blockchain.info',
			baseUrl: 'https://testnet.blockchain.info',
			txPath: '/tx'
		},
		{
			name: 'BlockCypher',
			baseUrl: 'https://live.blockcypher.com',
			txPath: '/bcy/tx'
		},
		{
			name: 'Blockstream',
			baseUrl: 'https://blockstream.info/testnet',
			txPath: '/tx'
		}
	],
	eth: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	xht: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	usdt: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	dai: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	sai: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	mkr: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	bnb: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	bat: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	leo: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	zrx: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	bch: [
		{
			name: 'Blockchain.info',
			baseUrl: 'https://www.blockchain.com',
			txPath: '/bchtest/tx'
		}
	],
	xrp: [
		{
			name: 'Bithomp',
			baseUrl: 'https://test.bithomp.com',
			txPath: '/explorer'
		}
	],
	xmr: [
		{
			name: 'xmrchain',
			baseUrl: 'https://testnet.xmrchain.com',
			txPath: '/tx'
		}
	],
	xaut: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	xlm: [
		{
			name: 'steexp',
			baseUrl: 'https://testnet.steexp.com',
			txPath: '/tx'
		}
	],
};

exports.EXPLORERS =
	process.env.NETWORK === 'mainnet' ? MAINNET_EXPLORERS : TESTNET_EXPLORERS;