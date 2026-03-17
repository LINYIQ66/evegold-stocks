import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Banknote, ArrowLeftRight, Zap, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from '@/components/common/LanguageProvider';

const features = [
  {
    name_key: 'instant_gold_trading',
    desc_key: 'execute_trades',
    icon: ArrowLeftRight,
    highlight: 'Live Pricing',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    name_key: 'asset_backed_lending',
    desc_key: 'unlock_liquidity',
    icon: Banknote,
    highlight: '80% LTV',
    color: 'from-green-500 to-emerald-500'
  },
  {
    name_key: 'fort_knox_security',
    desc_key: 'military_grade',
    icon: Shield,
    highlight: '100% Insured',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    name_key: 'yield_generation',
    desc_key: 'stake_metals',
    icon: TrendingUp,
    highlight: '4.5% APR',
    color: 'from-purple-500 to-violet-500'
  },
  {
    name_key: 'lightning_fast',
    desc_key: 'fast_trading',
    icon: Zap,
    highlight: '0.1s Execution',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    name_key: 'always_available',
    desc_key: 'trade_anytime',
    icon: Clock,
    highlight: '24/7 Trading',
    color: 'from-orange-500 to-red-500'
  }
];

export default function FeatureHighlights() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 text-sm font-semibold mb-4">
              {t('home.revolutionary_platform')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              {t('home.built_future')}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('home.advanced_platform')}
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name_key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Card className="h-full border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <Badge className="bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 font-semibold px-3 py-1">
                      {feature.highlight}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {t(`home.${feature.name_key}`)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t(`home.${feature.desc_key}`)}
                    </p>
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
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">{t('home.join_gold_rush')}</h3>
            <p className="text-blue-100 text-lg mb-6">
              {t('home.dont_miss')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium">{t('home.active_traders')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm font-medium">{t('home.volume_traded')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm font-medium">{t('home.uptime')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}