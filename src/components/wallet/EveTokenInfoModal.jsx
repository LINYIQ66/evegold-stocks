import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Zap, Globe, Rocket } from 'lucide-react';
import { useLanguage } from '@/components/common/LanguageProvider';

export default function EveTokenInfoModal({ isOpen, onClose }) {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-gradient-to-br from-slate-900 to-slate-800 text-white border-violet-500">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            {t('eve_token_modal.title')}
          </DialogTitle>
          <DialogDescription className="text-slate-400 pt-2">
            {t('eve_token_modal.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-violet-500/20 rounded-lg">
              <Rocket className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h4 className="font-semibold">{t('eve_token_modal.exchange_listing_title')}</h4>
              <p className="text-sm text-slate-300">
                {t('eve_token_modal.exchange_listing_desc')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-violet-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h4 className="font-semibold">{t('eve_token_modal.blockchain_integration_title')}</h4>
              <p className="text-sm text-slate-300">
                {t('eve_token_modal.blockchain_integration_desc')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-violet-500/20 rounded-lg">
              <Globe className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h4 className="font-semibold">{t('eve_token_modal.global_utility_title')}</h4>
              <p className="text-sm text-slate-300">
                {t('eve_token_modal.global_utility_desc')}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center pt-4">
          <Button onClick={onClose} variant="outline" className="bg-transparent border-slate-600 hover:bg-slate-700">
            {t('eve_token_modal.button_text')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}