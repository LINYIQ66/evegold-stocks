export const homeCopy = {
  zh: {
    title: '一站式贵金属和美股交易平台',
    sub: '现货交易 · 足额结算 · 无杠杆 · 实时报价',
    start: '开始交易',
    prices: '查看行情',
    trust: ['银行级安全', '即时成交', '实时行情'],
    marketsTitle: '交易与服务',
    markets: {
      Trading: ['贵金属交易', '黄金、白银、铂金、钯金即时兑换'],
      USStocks: ['美股', '市价 / 限价下单，含铀产业专区'],
      Physical: ['实物金银', '金条银条兑换与配送'],
      Wallet: ['钱包', '法币、贵金属、加密资产统一管理'],
      Lending: ['借贷', '以贵金属作抵押借款'],
      Staking: ['质押', '持有资产获取收益'],
    },
    eve: '每笔交易的手续费按比例返还 EVE 奖励代币',
    eveCta: '查看我的 EVE',
  },
  en: {
    title: 'One-stop Precious Metals & US Stocks Trading',
    sub: 'Spot trading · Fully funded · No leverage · Live quotes',
    start: 'Start Trading',
    prices: 'View Prices',
    trust: ['Bank-grade security', 'Instant execution', 'Live market data'],
    marketsTitle: 'Markets & Services',
    markets: {
      Trading: ['Metals Trading', 'Instant swaps in gold, silver, platinum, palladium'],
      USStocks: ['US Stocks', 'Market / limit orders, incl. uranium sector'],
      Physical: ['Physical Bullion', 'Bar redemption and delivery'],
      Wallet: ['Wallet', 'Fiat, metals and crypto in one place'],
      Lending: ['Lending', 'Borrow against your metals'],
      Staking: ['Staking', 'Earn yield on holdings'],
    },
    eve: 'Every trade rebates part of its fee as EVE reward tokens',
    eveCta: 'View my EVE',
  },
};

export const getHomeCopy = (language) => homeCopy[language] || homeCopy.en;