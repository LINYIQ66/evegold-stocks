import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Star, Zap, Globe, TrendingUp, Coins, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from '@/components/common/LanguageProvider';

const features = [
  {
    name_key: 'earn_eve',
    desc_key: 'earn_eve_desc',
    icon: Star,
    highlight: '100:1 Ratio',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    name_key: 'blockchain_ready',
    desc_key: 'blockchain_desc',
    icon: Zap,
    highlight: 'Coming Soon',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    name_key: 'global_exchange',
    desc_key: 'exchange_desc',
    icon: Globe,
    highlight: 'Roadmap 2025',
    color: 'from-purple-500 to-violet-500'
  },
  {
    name_key: 'ecosystem_utility',
    desc_key: 'utility_desc',
    icon: Coins,
    highlight: 'Multi-Use',
    color: 'from-green-500 to-emerald-500'
  }
];

export default function EveTokenSection() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-slate-900 via-violet-900 to-indigo-900 py-20 sm:py-28 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-6 py-2 text-sm font-bold mb-6 shadow-2xl">
              {t('home.eve_revolution')}
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="block bg-gradient-to-r from-yellow-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
                {t('home.introducing_eve')}
              </span>
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              {t('home.eve_subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
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
              <Card className="h-full border-0 bg-white/5 backdrop-blur-xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-500 hover:bg-white/10">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <Badge className="bg-gradient-to-r from-slate-700 to-slate-600 text-white font-bold px-4 py-2 shadow-lg">
                      {feature.highlight}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                      {t(`home.${feature.name_key}`)}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-lg">
                      {t(`home.${feature.desc_key}`)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 backdrop-blur-xl rounded-3xl p-8 border border-violet-500/30 shadow-2xl mb-8">
            <h3 className="text-3xl font-bold text-white mb-6">{t('home.start_earning')}</h3>
            <p className="text-violet-200 text-lg mb-8 max-w-2xl mx-auto">
              {t('home.earn_eve_desc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to={createPageUrl("Trading")}>
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-10 py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300">
                  {t('home.start_earning')}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link to={createPageUrl("Wallet")}>
                <Button 
                  size="lg" 
                  className="border-2 border-violet-400/50 bg-violet-500/20 hover:bg-violet-500/40 text-white backdrop-blur-sm px-10 py-6 text-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {t('home.learn_about_eve')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-violet-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">{t('home.eve_stats_earned')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-medium">{t('home.eve_stats_traders')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">{t('home.eve_stats_value')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}