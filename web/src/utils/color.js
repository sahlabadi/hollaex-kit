import Color from 'color';
import light from 'config/colors/light';

export const getColorByKey = (key, content = light) => {
	return content[key];
};

export const calculateThemes = (themes) => {
	const calculatedThemes = {};

	Object.entries(themes).forEach(([themeKey, themeData]) => {
		calculatedThemes[themeKey] = pushCalculatedColors(themeData);
	});

	return calculatedThemes;
};

const pushCalculatedColors = (themeData) => {
	const calculatedColors = {
		'calculated_trading_buying-related-text': Color(
			themeData['trading_buying-related-elements']
		).isLight()
			? 'black'
			: 'white',
		'calculated_trading_selling-related-text': Color(
			themeData['trading_selling-related-elements']
		).isLight()
			? 'black'
			: 'white',
		'calculated_base_modal-overlay': Color(themeData['base_background'])
			.alpha(0.75)
			.string(),
		'calculated_specials_highlight-box': Color(
			themeData['specials_buttons-links-and-highlights']
		)
			.alpha(0.2)
			.string(),
		'calculated_base_top-bar-navigation_text': Color(
			themeData['base_top-bar-navigation']
		).isLight()
			? 'black'
			: 'white',
		'calculated_base_top-bar-navigation_text-inactive': Color(
			themeData['base_top-bar-navigation']
		).isLight()
			? '#000000b3'
			: '#ffffffb3',
		calculated_base_footer_text: Color(themeData['base_footer']).isLight()
			? 'black'
			: 'white',
		'calculated_trad-view_watermark': Color(
			themeData['labels_important-active-labels-text-graphics']
		)
			.alpha(0.1)
			.string(),
		'calculated_trad-view_axis': Color(
			themeData['labels_important-active-labels-text-graphics']
		)
			.alpha(0.5)
			.string(),
		'calculated_trad-view_text': Color(
			themeData['labels_important-active-labels-text-graphics']
		)
			.alpha(0.85)
			.string(),
		'calculated_specials_notifications-alerts-inactive': Color(
			themeData['specials_notifications-alerts-warnings']
		)
			.alpha(0.75)
			.string(),
		'calculated_specials_notifications-alerts-text': Color(
			themeData['specials_notifications-alerts-warnings']
		).isLight()
			? 'black'
			: 'white',
		'calculated_specials_notifications-pending-text': Color(
			themeData['specials_pending-waiting-caution']
		).isLight()
			? 'black'
			: 'white',
		'calculated_specials_notifications-success-text': Color(
			themeData['specials_checks-okay-done']
		).isLight()
			? 'black'
			: 'white',
	};

	return { ...themeData, ...calculatedColors };
};

const allowedColorKeys = Object.keys(light);

export const filterThemes = (themes) => {
	const filteredThemes = {};

	Object.entries(themes).forEach(([themeKey, themeData]) => {
		filteredThemes[themeKey] = filterTheme(themeData);
	});

	return filteredThemes;
};

export const filterTheme = (theme) => {
	const filteredTheme = Object.keys(theme)
		.filter((key) => allowedColorKeys.includes(key))
		.reduce((obj, key) => {
			obj[key] = theme[key];
			return obj;
		}, {});

	return filteredTheme;
};

export const CALCULATED_COLOR_RATIO_OBJECT = {
	'base_top-bar-navigation': 0.7,
	'base_secondary-navigation-bar': 0.5,
	'base_wallet-sidebar-and-popup': 0.3,
	base_footer: 0.6,
};

export const CALCULATED_COLOR_KEYS = Object.keys(CALCULATED_COLOR_RATIO_OBJECT);

export const calculateBaseColors = (
	base_background,
	isDarken = true,
	baseRatios = CALCULATED_COLOR_RATIO_OBJECT
) => {
	const baseColors = {
		base_background,
	};

	const mode = isDarken ? 'darken' : 'lighten';

	Object.entries(baseRatios).forEach(([colorKey, value]) => {
		baseColors[colorKey] = Color(base_background)[mode](value).hex();
	});

	return baseColors;
};

export const isLightColor = (color = '#ffffff') => {
	return Color(color).isLight();
};

export const getColorFromTheme = (
	colorKey,
	themekey = 'white',
	themesObj = {}
) => {
	const themeObj = themesObj[themekey];
	return getColorByKey(colorKey, themeObj);
};

export const BASE_BACKGROUND = 'base_background';
export const TOPBAR_BACKGROUND = 'base_top-bar-navigation';
export const FOOTER_BACKGROUND = 'base_footer';