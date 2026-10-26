export const historicalPrices = [
  { year: '2021', price: 33.91 }, { year: '2022', price: 39.08 },
  { year: '2023', price: 43.80 }, { year: '2024', price: 52.71 }
];
export const sources = {
  prices: 'https://www.eia.gov/uranium/marketing/table3.php',
  production: 'https://world-nuclear.org/information-library/nuclear-fuel-cycle/mining-of-uranium/world-uranium-mining-production',
  cycle: 'https://world-nuclear.org/information-library/nuclear-fuel-cycle/introduction/nuclear-fuel-cycle-overview',
  research: 'https://www.iaea.org/topics/nuclear-power'
};
export const marketContent = {
  en: {
    eyebrow: 'ENERGY & COMMODITIES / MARKET INTELLIGENCE', title: 'Global Uranium Market',
    intro: 'Independent perspectives on uranium, nuclear energy and the global fuel supply chain. Research and public data, clearly separated from executable prices.',
    desk: 'Nuclear Fuels Desk', about: 'About Us', home: 'Home', research: 'Explore the market', cycleLink: 'Understand the fuel cycle',
    quoteLabel: 'U₃O₈ · HISTORICAL RESEARCH', quoteTitle: '2024 annual purchase average', quoteNote: 'U.S. civilian reactor owners and operators. Weighted-average delivered purchase price, U₃O₈ equivalent. Not a spot index or an executable quote.',
    chartTitle: 'Historical uranium purchase prices', chartSub: 'Annual U.S. weighted-average purchase prices · USD/lb U₃O₈ equivalent · 2021–2024',
    source: 'Source', snapshot: 'Fixed research snapshot · checked 26 October 2026',
    coverageLabel: 'GLOBAL COVERAGE', energyLabel: 'EVE METAL · Energy & Commodities', unit: 'USD/lb U₃O₈ equivalent',
    unavailable: 'A licensed live spot-price feed is not connected. No live spot price or intraday price history is shown.',
    regionsTitle: 'A global market, distinct regional roles', regionsSub: 'Production, demand, policy and fuel-cycle capacity shape different parts of the market.',
    regions: [
      ['Kazakhstan', 'Production & Kazatomprom', 'Kazakhstan is a leading uranium-producing country. Kazatomprom is an important participant in its mining industry.'],
      ['Canada', 'High-grade resources', 'Canada is a major producer, with significant uranium mining activity in Saskatchewan.'],
      ['Australia', 'Long-term resource base', 'Australia has substantial identified uranium resources and an established mining sector.'],
      ['United States', 'Reactor demand & security', 'A large civilian reactor fleet and energy-security priorities shape long-term fuel requirements.'],
      ['Europe', 'Utilities & fuel services', 'European utilities and fuel-cycle services are important to the international nuclear energy system.']
    ],
    cycleTitle: 'Understanding the nuclear fuel cycle', cycleIntro: 'Each stage has distinct commercial characteristics and regulatory oversight. This overview is educational, not an operating or procurement guide.',
    cycle: [['01', 'Mining & milling', 'Uranium ore is processed into a concentrate commonly called yellowcake (U₃O₈).'], ['02', 'Conversion', 'Specialist facilities prepare material for subsequent fuel-cycle stages.'], ['03', 'Enrichment', 'Where required by the reactor design, licensed facilities provide enrichment services.'], ['04', 'Fuel fabrication', 'Specialist manufacturers produce reactor fuel under applicable safeguards.']],
    concepts: [['Logistics & safeguards', 'International movements require specialist handling, applicable authorisations and safeguards. This website does not arrange transport.'], ['Book transfer', 'An accounting change in ownership at an approved facility can differ from physical shipment. It remains subject to contractual and regulatory requirements.'], ['Spot vs. futures', 'Spot markets and exchange-traded futures have different settlement, timing and risk characteristics. Published indices are not firm offers.']],
    demandTitle: 'Why nuclear, why now?', demand: ['Reliable low-carbon electricity alongside variable renewables.', 'Electricity demand from industry, digital infrastructure and data centres.', 'Energy security and long-term fuel planning.', 'Reactor lifetime extensions and new-build programmes.'],
    resourcesTitle: 'Public research & industry resources', resourcesSub: 'Open the original publications for their latest updates, methodology and context.',
    resources: ['EIA · Uranium prices & inventories', 'World Nuclear Association · Global production', 'IAEA · Nuclear power research'],
    governance: 'Governance & market integrity', disclaimer: 'Information only. This page does not offer nuclear materials, execute trades, accept purchase or sale instructions, or debit or credit any wallet. Physical nuclear-material activities require appropriately qualified participants and applicable approvals.',
    footer: 'EVE METAL · Global Metals & Financial Markets'
  },
  zh: {
    eyebrow: '能源与大宗商品 / 市场研究', title: '全球铀市场',
    intro: '关注铀、核能及全球核燃料产业链，以公开资料开展市场研究，清晰区分历史参考数据与可成交报价。',
    desk: '核燃料市场研究', about: '关于我们', home: '主页', research: '浏览市场资料', cycleLink: '了解核燃料产业链',
    quoteLabel: 'U₃O₈ · 历史研究数据', quoteTitle: '2024 年年度采购均价', quoteNote: '美国民用核电反应堆业主及运营商的加权平均交付采购价格，以 U₃O₈ 当量计；并非现货指数或可成交报价。',
    chartTitle: '铀历史采购价格', chartSub: '美国年度加权平均采购价 · USD/lb U₃O₈ 当量 · 2021–2024 年',
    source: '数据来源', snapshot: '固定历史研究快照 · 核对日期：2026 年 10 月 26 日',
    coverageLabel: '全球市场覆盖', energyLabel: 'EVE METAL · 能源与大宗商品', unit: '美元/磅 · U₃O₈ 当量',
    unavailable: '尚未接入获授权的实时现货行情；本页不展示实时现货价格或分时价格走势。',
    regionsTitle: '全球市场，不同区域的产业角色', regionsSub: '生产、需求、政策和燃料服务能力共同影响核燃料市场。',
    regions: [
      ['哈萨克斯坦', '铀生产与 Kazatomprom', '哈萨克斯坦是主要铀生产国，Kazatomprom 是当地铀矿业的重要参与者。'],
      ['加拿大', '高品位矿产资源', '加拿大是主要铀生产国，萨斯喀彻温省是重要铀矿产区。'],
      ['澳大利亚', '长期资源基础', '澳大利亚拥有丰富的已探明铀资源和成熟的采矿产业。'],
      ['美国', '核电需求与能源安全', '庞大的民用核电机组及能源安全政策影响长期核燃料需求。'],
      ['欧洲', '电力企业与核燃料服务', '欧洲电力企业和核燃料服务业是国际核能产业链的重要部分。']
    ],
    cycleTitle: '了解核燃料产业链', cycleIntro: '每个环节具有不同的市场特征和监管要求。以下仅为科普介绍，不构成操作或采购指南。',
    cycle: [['01', '开采与选冶', '铀矿石经处理成为通常称作黄饼的铀浓缩物（U₃O₈）。'], ['02', '转化', '专业设施为后续核燃料处理环节准备材料。'], ['03', '浓缩', '根据反应堆设计要求，由具备资质的设施提供浓缩服务。'], ['04', '燃料制造', '专业制造企业在适用的保障监督制度下生产反应堆燃料。']],
    concepts: [['物流与保障监督', '国际运输涉及专业处理、适用许可与保障监督。本网站不安排核材料运输。'], ['账簿交割 Book Transfer', '合格设施内的所有权账务变更不同于实物运输，仍受合同及监管要求约束。'], ['现货与期货', '现货市场与交易所期货在结算、期限和风险方面存在差异，公开指数不代表实盘报价。']],
    demandTitle: '为何关注核能？', demand: ['提供稳定的低碳电力，与波动性可再生能源形成互补。', '工业、数字基础设施及数据中心推动电力需求。', '能源安全及长期燃料规划的重要性提升。', '核电机组延寿及新建项目影响长期需求。'],
    resourcesTitle: '公开研究与行业资料', resourcesSub: '请访问原始出版机构，了解最新资料、统计方法及背景。',
    resources: ['EIA · 铀采购价格及库存', '世界核协会 · 全球铀矿生产', '国际原子能机构 · 核能研究'],
    governance: '治理与市场诚信', disclaimer: '本页仅提供资讯，不出售核材料、不执行交易、不接收采购或出售指令，也不扣减或增加钱包余额。实物核材料相关活动须由具备适当资格的参与方按适用许可与规定开展。',
    footer: 'EVE METAL · 全球金属与金融市场'
  }
};