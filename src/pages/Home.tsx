import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, MapPin, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'OWNER' || user.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/properties');
      }
    }
  }, [user, navigate]);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent -z-10" />
        
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold border border-emerald-500/20"
          >
            <Sparkles size={16} />
            {t('home.badge')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter"
          >
            {t('home.heroTitle')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            {t('home.heroSubtitle')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Link to="/properties" className="btn-primary text-lg py-4 px-10 flex items-center justify-center gap-2">
              {t('home.browseButton')} <ArrowRight size={20} />
            </Link>
            <Link to="/register" className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-10 rounded-xl transition-all flex items-center justify-center">
              {t('home.listButton')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <ShieldCheck className="text-emerald-500" size={32} />, title: t('home.feature1Title'), desc: t('home.feature1Desc') },
          { icon: <MapPin className="text-blue-500" size={32} />, title: t('home.feature2Title'), desc: t('home.feature2Desc') },
          { icon: <Clock className="text-purple-500" size={32} />, title: t('home.feature3Title'), desc: t('home.feature3Desc') }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] space-y-4 hover:border-emerald-500/30 transition-all group"
          >
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1920')] opacity-10 mix-blend-overlay" />
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight relative z-10">{t('home.ctaTitle')}</h2>
        <p className="text-emerald-100 text-xl max-w-2xl mx-auto relative z-10">{t('home.ctaSubtitle')}</p>
        <div className="relative z-10">
          <Link to="/register" className="bg-white text-emerald-600 hover:bg-emerald-50 font-black py-5 px-12 rounded-2xl text-xl transition-all inline-block shadow-2xl">
            {t('home.ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;