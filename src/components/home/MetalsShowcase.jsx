import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from '@/components/common/LanguageProvider';

const metals = [
  {
    name: "Gold",
    symbol: "Au",
    performance: "+50.2%",
    highlight: true
  },
  {
    name: "Silver",
    symbol: "Ag",
    performance: "+28.4%"
  },
  {
    name: "Platinum",
    symbol: "Pt",
    performance: "+15.7%"
  },
  {
    name: "Palladium",
    symbol: "Pd",
    performance: "+12.1%"
  }
];

export default function MetalsShowcase() {
  const { t } = useLanguage();

  const getMetalDescription = (metalName) => {
    const descriptions = {
      "Gold": t('home.gold_desc'),
      "Silver": t('home.silver_desc'),
      "Platinum": t('home.platinum_desc'),
      "Palladium": t('home.palladium_desc')
    };
    return descriptions[metalName] || '';
  };

  const getMetalStatus = (metalName) => {
    const statuses = {
      "Gold": t('home.best_performer'),
      "Silver": t('home.strong_rally'),
      "Platinum": t('home.rising_fast'),
      "Palladium": t('home.steady_growth')
    };
    return statuses[metalName] || '';
  };

  return (
    <div className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-4 py-2 text-sm font-semibold mb-4">
              {t('home.market_leaders')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              {t('home.metals_performance')}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('home.witness_surge')}
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metals.map((metal, index) => (
            <motion.div 
              key={metal.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className={`h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 ${
                metal.highlight ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-white hover:bg-gray-50'
              }`}>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${
                      metal.name === 'Gold' ? 'from-yellow-400 to-orange-500' :
                      metal.name === 'Silver' ? 'from-gray-300 to-gray-500' :
                      metal.name === 'Platinum' ? 'from-purple-300 to-indigo-400' :
                      'from-pink-300 to-rose-400'
                    } rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-white font-bold text-2xl">{metal.symbol}</span>
                    </div>
                    {metal.highlight && (
                      <Award className="w-8 h-8 text-yellow-500" />
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{metal.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`${metal.highlight ? 'bg-yellow-500 text-white' : 'bg-green-100 text-green-800'} font-bold`}>
                          {metal.performance}
                        </Badge>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium mb-3">{getMetalStatus(metal.name)}</p>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed">{getMetalDescription(metal.name)}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-4 rounded-full border border-blue-200">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">{t('home.zero_fees')}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}