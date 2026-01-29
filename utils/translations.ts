export type Library = 'pt' | 'en';

export const translations = {
    pt: {
        // Navigation
        'nav.home': 'Início',
        'nav.book': 'Agendar Agora',
        'nav.admin': 'Área Administrativa',
        'nav.logout': 'Sair do Painel',

        // Home
        'home.hero.title': 'Realce sua Beleza Natural',
        'home.hero.subtitle': 'Agende seu momento de cuidado com os melhores profissionais da região.',
        'home.cta.book': 'Agendar Horário',
        'home.cta.services': 'Conhecer Serviços',
        'home.services.title': 'Nossos Serviços',
        'home.services.subtitle': 'Tratamentos exclusivos para você',
        'home.team.title': 'Nossa Equipe',
        'home.team.subtitle': 'Profissionais apaixonados',
        'home.about.title': 'Sobre Nós',
        'home.footer.contact': 'Contato',
        'home.footer.address': 'Endereço',
        'home.footer.hours': 'Horários',

        // Booking
        'booking.steps.service': 'Escolha o Serviço',
        'booking.steps.professional': 'Escolha o Profissional',
        'booking.steps.datetime': 'Data e Hora',
        'booking.steps.confirm': 'Confirmação',
        'booking.total': 'Total Estimado',
        'booking.empty.title': 'Sem serviços disponíveis',
        'booking.empty.message': 'Não encontramos serviços nesta categoria.',
        'booking.input.name': 'Seu Nome Completo',
        'booking.input.phone': 'Seu WhatsApp (apenas números)',
        'booking.button.confirm': 'Confirmar Agendamento',
        'booking.success.title': 'Agendamento Confirmado!',
        'booking.success.message': 'Te esperamos no horário marcado.',
        'booking.success.button': 'Voltar ao Início',

        // Dynamic Content (Fallbacks)
        'dynamic.hero.title': 'Realce sua Beleza Natural',
        'dynamic.hero.subtitle': 'Agende seu momento de cuidado com os melhores profissionais da região.',
        'dynamic.services.title': 'Serviços Exclusivos',
        'dynamic.services.subtitle': 'Oferecemos o que há de melhor em tratamentos de beleza, com produtos premium e técnicas modernas.',
        'dynamic.team.title': 'Nossa Equipe',
        'dynamic.team.subtitle': 'Especialistas apaixonados por elevar sua autoestima e realçar sua beleza única.',
        'dynamic.about.title': 'Conforto e Estilo em cada detalhe',
        'dynamic.about.text': 'Focamos na sua experiência completa, desde o café até o resultado final. Nossa missão é elevar sua autoestima.',

        // Services
        'service.srv1.name': 'Corte e Escova',
        'service.srv1.desc': 'Corte personalizado e finalização perfeita.',
        'service.srv2.name': 'Manicure Completa',
        'service.srv2.desc': 'Cuidado completo para suas mãos.',
        'service.srv3.name': 'Maquiagem Social',
        'service.srv3.desc': 'Para eventos especiais e festas.',
        'service.srv4.name': 'Hidratação Profunda',
        'service.srv4.desc': 'Recupere o brilho e maciez dos fios.',

        // Professionals
        'pro.pro1.bio': 'Especialista em cortes modernos e coloração.',
        'pro.pro2.bio': 'Apaixonada por unhas perfeitas e arte.',
        'pro.pro3.bio': 'Realçando sua beleza natural para qualquer ocasião.',

        // Admin
        'admin.login.title': 'Painel do Gestor',
        'admin.login.subtitle': 'Acesse para gerenciar seu salão',
        'admin.login.user': 'Usuário',
        'admin.login.pass': 'Senha',
        'admin.login.button': 'Acessar Dashboard',
        'common.loading': 'Carregando...',
        'common.loading.studio': 'Carregando Estúdio...',
        'common.back': 'Voltar',
        'common.next': 'Próximo Passo',
        'common.reload': 'Recarregar',
        'common.change': 'Alterar',

        // Home Extra
        'home.scroll': 'Descubra',
        'home.stats.results.title': 'Resultados Impecáveis',
        'home.stats.results.text': 'Combinamos arte e ciência para entregar o visual dos seus sonhos com precisão absoluta.',
        'home.stats.products.title': 'Produtos Premium',
        'home.stats.products.text': 'Utilizamos apenas marcas líderes mundiais, garantindo a saúde e brilho duradouro.',
        'home.stats.vip.title': 'Experiência VIP',
        'home.stats.vip.text': 'Seu momento de luxo começa na recepção com um café gourmet e atendimento personalizado.',
        'home.reviews.clients': '+500 Clientes',
        'home.reviews.quote': 'O melhor salão que já visitei. Atendimento impecável e luxuoso!',
        'footer.rights': 'Todos os direitos reservados.',
        'footer.privacy': 'Privacidade',
        'footer.terms': 'Termos de Uso',

        // Booking Extra
        'booking.step1.sub': 'Escolha um de nossos serviços exclusivos.',
        'booking.step2.sub': 'Nossos especialistas estão prontos para você.',
        'booking.step3.sub': 'Selecione a data e o horário mais convenientes.',
        'booking.step4.sub': 'Preencha seus dados para contato rápido.',
        'booking.change.service': 'Alterar Serviço',
    },
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.book': 'Book Now',
        'nav.admin': 'Admin Area',
        'nav.logout': 'Logout',

        'common.loading': 'Loading...',
        'common.loading.studio': 'Loading Studio...',
        'common.back': 'Back',
        'common.next': 'Next Step',
        'common.reload': 'Reload',
        'common.change': 'Change',

        // Home Extra
        'home.scroll': 'Discover',
        'home.stats.results.title': 'Impeccable Results',
        'home.stats.results.text': 'We combine art and science to deliver the look of your dreams with absolute precision.',
        'home.stats.products.title': 'Premium Products',
        'home.stats.products.text': 'We use only world-leading brands, ensuring health and lasting shine.',
        'home.stats.vip.title': 'VIP Experience',
        'home.stats.vip.text': 'Your moment of luxury begins at the reception with gourmet coffee and personalized service.',
        'home.reviews.clients': '+500 Clients',
        'home.reviews.quote': 'The best salon I have ever visited. Impeccable and luxurious service!',
        'footer.rights': 'All rights reserved.',
        'footer.privacy': 'Privacy',
        'footer.terms': 'Terms of Use',

        // Booking Extra
        'booking.step1.sub': 'Choose one of our exclusive services.',
        'booking.step2.sub': 'Our specialists are ready for you.',
        'booking.step3.sub': 'Select the most convenient date and time.',
        'booking.step4.sub': 'Fill in your details for quick contact.',
        'booking.change.service': 'Change Service',

        // Home
        'home.hero.title': 'Enhance Your Natural Beauty',
        'home.hero.subtitle': 'Schedule your moment of care with the best professionals in the region.',
        'home.cta.book': 'Book Appointment',
        'home.cta.services': 'View Services',
        'home.services.title': 'Our Services',
        'home.services.subtitle': 'Exclusive treatments for you',
        'home.team.title': 'Our Team',
        'home.team.subtitle': 'Passionate professionals',
        'home.about.title': 'About Us',
        'home.footer.contact': 'Contact',
        'home.footer.address': 'Address',
        'home.footer.hours': 'Opening Hours',

        // Booking
        'booking.steps.service': 'Choose Service',
        'booking.steps.professional': 'Choose Professional',
        'booking.steps.datetime': 'Date & Time',
        'booking.steps.confirm': 'Confirmation',
        'booking.total': 'Estimated Total',
        'booking.empty.title': 'No services available',
        'booking.empty.message': 'We could not find services in this category.',
        'booking.input.name': 'Your Full Name',
        'booking.input.phone': 'Your WhatsApp (numbers only)',
        'booking.button.confirm': 'Confirm Appointment',
        'booking.success.title': 'Appointment Confirmed!',
        'booking.success.message': 'We look forward to seeing you.',
        'booking.success.button': 'Back to Home',

        // Dynamic Content
        'dynamic.hero.title': 'Enhance Your Natural Beauty',
        'dynamic.hero.subtitle': 'Schedule your moment of care with the best professionals in the region.',
        'dynamic.services.title': 'Exclusive Services',
        'dynamic.services.subtitle': 'We offer the best in beauty treatments, with premium products and modern techniques.',
        'dynamic.team.title': 'Our Team',
        'dynamic.team.subtitle': 'Specialists passionate about elevating your self-esteem and highlighting your unique beauty.',
        'dynamic.about.title': 'Comfort and Style in every detail',
        'dynamic.about.text': 'We focus on your complete experience, from coffee to the final result. Our mission is to raise your self-esteem.',

        // Services
        'service.srv1.name': 'Haircut & Blowdry',
        'service.srv1.desc': 'Personalized cut and perfect finish.',
        'service.srv2.name': 'Complete Manicure',
        'service.srv2.desc': 'Complete care for your hands.',
        'service.srv3.name': 'Social Makeup',
        'service.srv3.desc': 'For special events and parties.',
        'service.srv4.name': 'Deep Hydration',
        'service.srv4.desc': 'Recover the shine and softness of your strands.',

        // Professionals
        'pro.pro1.bio': 'Specialist in modern cuts and coloring.',
        'pro.pro2.bio': 'Passionate about perfect nails and art.',
        'pro.pro3.bio': 'Enhancing your natural beauty for any occasion.',

        // Admin
        'admin.login.title': 'Manager Panel',
        'admin.login.subtitle': 'Login to manage your salon',
        'admin.login.user': 'Username',
        'admin.login.pass': 'Password',
        'admin.login.button': 'Access Dashboard',
    }
};
