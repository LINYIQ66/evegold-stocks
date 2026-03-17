import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from '@/components/common/LanguageProvider';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200')] bg-cover bg-center opacity-10"></div>
      <div className="relative mx-auto px-6 py-20 max-w-7xl sm:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center">

          {/* Market Alert Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-6 py-3 mb-8"
          >
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-100 font-semibold">{t('home.market_alert')}</span>
            <span className="text-yellow-300">• {t('home.record_breaking')}</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{t('home.golden_age')}</span>
            <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{t('home.is_here')}</span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <p className="text-xl sm:text-2xl text-blue-100 leading-relaxed font-medium mb-6">
              {t('home.surge_2025')}
            </p>
            <p className="text-lg text-blue-200 leading-relaxed">
              {t('home.inflation_fears')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-3xl mx-auto mb-10"
          >
            <p className="text-lg text-white leading-relaxed">
              {t('home.safe_haven')}
              <span className="block mt-3 text-yellow-400 font-bold text-xl">{t('home.golden_age_beginning')}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to={createPageUrl("Account")}>
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-10 py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300">
                {t('home.start_trading')}
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <Link to={createPageUrl("Trading")}>
              <Button 
                size="lg" 
                className="border-2 border-sky-400/50 bg-sky-500/20 hover:bg-sky-500/40 text-white backdrop-blur-sm px-10 py-6 text-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {t('home.view_prices')}
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-blue-200"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">{t('home.bank_grade_security')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">{t('home.instant_trading')}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">{t('home.live_market_data')}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}