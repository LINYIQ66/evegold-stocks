export const priceCopy = {
  zh: {
    title: '铀现货与期货价格', schedule: '每周一 10:00（新加坡时间）检查并保存最新公开数据；来源未发布新值时保留原值。',
    spot: '现货参考价', futures: '期货参考价', unit: '美元/磅 U₃O₈', date: '价格日期', checked: '最近成功检查', source: '查看原始来源',
    spotNote: 'Cameco 公布的月末现货行业均价，综合 UxC 与 TradeTech，不是每周现货成交价。',
    futuresNote: 'Yahoo Finance 的 UX=F 公开延迟报价，并非实时可成交价；具体合约及到期信息以来源为准。',
    futuresHistory: '当前公开源未提供 2024、2025 年期货历史；不以现货或长期合同价替代。此后每周保存可取得的报价，逐步累积历史。',
    spotChart: '月度现货历史', futuresChart: '期货报价历史', empty: '该年份暂无已核实数据', missing: '暂未取得价格',
    error: '最近检查失败，保留上次成功数据，请查看来源。', stale: '已超过一周未成功检查，请注意数据时效。',
    loading: '正在加载铀价…', loadError: '铀价加载失败，请重试。', retry: '重试', pending: '等待首次更新，暂不显示未经核实的价格。',
    disclaimer: '原有 2024 年 EIA 采购均价仍保留在上方；采购均价、现货与期货口径不同，分别展示，不能直接拼接。',
    year: '历史年份', noCheck: '尚未成功检查'
  },
  en: {
    title: 'Uranium spot & futures prices', schedule: 'Checked every Monday at 10:00 Singapore time. Previously published values remain when the source has no new release.',
    spot: 'Spot reference', futures: 'Futures reference', unit: 'USD/lb U₃O₈', date: 'Price date', checked: 'Last successful check', source: 'Original source',
    spotNote: 'Cameco month-end spot industry average using UxC and TradeTech. This is not a weekly spot transaction price.',
    futuresNote: 'Public delayed UX=F quotes from Yahoo Finance, not executable live prices. Refer to the provider for contract and expiry details.',
    futuresHistory: 'The current public source supplies no 2024 or 2025 futures history. Spot or long-term contract prices are not substituted. Available quotes are retained each week to build history.',
    spotChart: 'Monthly spot history', futuresChart: 'Futures quote history', empty: 'No verified data for this year', missing: 'Price unavailable',
    error: 'The latest check failed. Previous successful data is retained; consult the source.', stale: 'No successful check in over a week. Check data freshness.',
    loading: 'Loading uranium prices…', loadError: 'Unable to load prices. Please retry.', retry: 'Retry', pending: 'Awaiting the first update. Unverified prices are not displayed.',
    disclaimer: 'The original 2024 EIA purchase average remains above. Purchase averages, spot prices and futures have different methodologies and are shown separately.',
    year: 'Historical year', noCheck: 'Not yet checked'
  }
};