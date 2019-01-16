import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { Sortable } from '../Sortable';
import { ICONS, CURRENCIES, BASE_CURRENCY } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { formatPercentage } from '../../utils/currency';

const Tab = ({ pair = {}, tab, ticker = {}, activePairTab, onTabClick, onTabChange, items, ...rest }) => {
    const { formatToCurrency } = CURRENCIES[pair.pair_base || BASE_CURRENCY];
    const priceDifference = (ticker.close || 0) - (ticker.open || 0);
    const priceDifferencePercent = formatPercentage((ticker.close - ticker.open) / ticker.open);
    return (
        <div
            className={classnames(
                'app_bar-pair-content',
                'app_bar-pair-tab',
                'd-flex',
                "justify-content-between",
                { 'active-tab-pair': activePairTab === tab })}>
            <div
                className='d-flex w-100 h-100 pl-2'
                onClick={() => onTabClick(tab)}
                {...rest}>
                <div className="app_bar-pair-font d-flex align-items-center justify-content-between">
                    <div className="app_bar-currency-txt">
                        {STRINGS[`${pair.pair_base.toUpperCase()}_SHORTNAME`]}/{STRINGS[`${pair.pair_2.toUpperCase()}_SHORTNAME`]}:
                    </div>
                    <div className="title-font ml-1">{`${STRINGS[`${pair.pair_2.toUpperCase()}_CURRENCY_SYMBOL`]} ${formatToCurrency(ticker.close)}`}</div>
                    <div className={priceDifference < 0 ? "app-price-diff-down app-bar-price_diff_down" : "app-bar-price_diff_up app-price-diff-up"}>
                        {formatToCurrency(priceDifference)}
                    </div>
                    <div
                        className={priceDifference < 0
                            ? "title-font ml-1 app-price-diff-down" : "title-font ml-1 app-price-diff-up"}>
                            {`(${priceDifferencePercent})`}
                    </div>
                </div>
            </div>
            <div className='d-flex align-items-center mx-2' onClick={() => onTabChange(tab)}>
                <ReactSVG
                    path={ICONS.CLOSE_CROSS}
                    wrapperClassName="app-bar-tab-close mr-0" />
            </div>
        </div>
    );
};

export default Sortable(Tab);