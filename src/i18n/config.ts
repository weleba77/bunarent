import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        properties: 'Properties',
        dashboard: 'Dashboard',
        messages: 'Messages',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        addProperty: 'Add Property'
      },
      home: {
        heroTitle: 'Rent with Confidence.',
        heroSubtitle: 'BunaRent connects property owners with verified tenants across Addis Ababa. Secure payments, digital contracts, and hassle-free management.',
        browseButton: 'Browse Listings',
        listButton: 'List Your Property',
        badge: "Ethiopia's #1 Property Management Platform",
        feature1Title: 'Verified Listings',
        feature1Desc: 'Every property is manually checked by our team for authenticity.',
        feature2Title: 'Prime Locations',
        feature2Desc: 'Find homes in Bole, Old Airport, CMC, and all major sub-cities.',
        feature3Title: 'Fast Approval',
        feature3Desc: 'Get your rental application approved in as little as 24 hours.',
        ctaTitle: 'Ready to find your next home?',
        ctaSubtitle: 'Join thousands of Ethiopians who trust BunaRent for their housing needs.',
        ctaButton: 'Get Started Now'
      },
      common: {
        search: 'Search',
        filters: 'Filters',
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        address: 'Address',
        city: 'City',
        price: 'Price',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        sqft: 'Sq. Footage',
        status: 'Status',
        type: 'Type',
        amenities: 'Amenities',
        description: 'Description',
        availableFrom: 'Available From',
        etb: 'ETB',
        perMonth: '/mo'
      },
      propertyList: {
        title: 'Explore Properties',
        subtitle: 'Find the perfect home in Addis Ababa',
        searchPlaceholder: 'Search by location...',
        noResults: 'No properties found matching your search.',
        advancedFilters: 'Advanced Filters',
        resetAll: 'Reset All',
        priceRange: 'Price Range (ETB)',
        specifications: 'Specifications',
        anyBeds: 'Any Beds',
        anyBaths: 'Any Baths',
        allTypes: 'All Types'
      },
      propertyDetails: {
        back: 'Back to Listings',
        contactOwner: 'Contact Owner',
        messageOwner: 'Message Owner',
        loginToMessage: 'Login to message owner',
        details: 'Details',
        location: 'Location',
        save: 'Save',
        share: 'Share',
        listedBy: 'Listed by'
      },
      addProperty: {
        title: 'Property Details',
        subtitle: 'Provide accurate information to attract the best tenants.',
        badge: 'List Your Property Today',
        publish: 'Publish Listing',
        listing: 'Listing Property...',
        images: 'Property Images',
        dropImages: 'Drop images here or click to browse',
        orPasteUrl: 'Or paste URL',
        pastePlaceholder: 'Paste image URL here...',
        add: 'Add'
      },
      dashboard: {
        title: 'Owner Dashboard',
        subtitle: 'Manage your property listings and performance.',
        addProperty: 'Add New Property',
        property: 'Property',
        views: 'Views',
        actions: 'Actions',
        noProperties: 'You haven\'t listed any properties yet.',
        deleteConfirm: 'Are you sure you want to delete this property?',
        deleteSuccess: 'Property removed successfully'
      },
      auth: {
        loginTitle: 'Welcome Back',
        loginSubtitle: 'Log in to manage your rentals',
        email: 'Email Address',
        password: 'Password',
        loginButton: 'Sign In',
        noAccount: "Don't have an account?",
        registerLink: 'Register here',
        registerTitle: 'Create Account',
        registerSubtitle: "Join Ethiopia's premium rental network",
        fullName: 'Full Name',
        phone: 'Phone Number',
        tenantRole: "I'm a Tenant",
        ownerRole: "I'm an Owner",
        registerButton: 'Create Account',
        alreadyAccount: 'Already have an account?',
        loginLink: 'Login here'
      },
      messages: {
        title: 'Messages',
        searchPlaceholder: 'Search chats...',
        noConversations: 'No conversations yet.',
        selectConversation: 'Select a conversation',
        selectSubtitle: 'Choose a chat from the sidebar to start messaging',
        activeNow: 'Active Now',
        writeMessage: 'Write a message...',
        loadingMessages: 'Loading messages...'
      }
    }
  },
  am: {
    translation: {
      nav: {
        home: 'መነሻ',
        properties: 'ቤቶች',
        dashboard: 'ዳሽቦርድ',
        messages: 'መልእክቶች',
        login: 'ግባ',
        register: 'ተመዝገብ',
        logout: 'ውጣ',
        addProperty: 'ቤት አክል'
      },
      home: {
        heroTitle: 'በልበ ሙሉነት ይከራዩ።',
        heroSubtitle: 'ቡና ሬንት የቤት ባለቤቶችን በአዲስ አበባ ካሉ የተረጋገጡ ተከራዮች ጋር ያገናኛል። ደህንነቱ የተጠበቀ ክፍያ፣ ዲጂታል ውል እና ከችግር ነጻ የሆነ አስተዳደር።',
        browseButton: 'ቤቶችን ይፈልጉ',
        listButton: 'ቤትዎን ያከራዩ',
        badge: "የኢትዮጵያ ቁጥር 1 የንብረት አስተዳደር መድረክ",
        feature1Title: 'የተረጋገጡ ቤቶች',
        feature1Desc: 'እያንዳንዱ ቤት ትክክለኛነቱ በቡድናችን በእጅ ይረጋገጣል።',
        feature2Title: 'ምርጥ ቦታዎች',
        feature2Desc: 'በቦሌ፣ በድሮው አውሮፕላን ማረፊያ፣ በሲኤምሲ እና በሁሉም ዋና ዋና ክፍለ ከተሞች ቤቶችን ያግኙ።',
        feature3Title: 'ፈጣን ማረጋገጫ',
        feature3Desc: 'የኪራይ ማመልከቻዎን በ24 ሰዓታት ውስጥ ያግኙ።',
        ctaTitle: 'የሚቀጥለውን ቤትዎን ለማግኘት ዝግጁ ነዎት?',
        ctaSubtitle: 'ለቤቶች ፍላጎታቸው ቡና ሬንትን የሚያምኑ በሺዎች የሚቆጠሩ ኢትዮጵያውያንን ይቀላቀሉ።',
        ctaButton: 'አሁኑኑ ይጀምሩ'
      },
      common: {
        search: 'ፈልግ',
        filters: 'ማጣሪያዎች',
        loading: 'በመጫን ላይ...',
        save: 'አስቀምጥ',
        cancel: 'ሰርዝ',
        delete: 'አጥፋ',
        edit: 'አስተካክል',
        address: 'አድራሻ',
        city: 'ከተማ',
        price: 'ዋጋ',
        bedrooms: 'መኝታ ቤቶች',
        bathrooms: 'መታጠቢያ ቤቶች',
        sqft: 'ስፋት',
        status: 'ሁኔታ',
        type: 'ዓይነት',
        amenities: 'መገልገያዎች',
        description: 'መግለጫ',
        availableFrom: 'ከ... ጀምሮ ይገኛል',
        etb: 'ብር',
        perMonth: '/በወር'
      },
      propertyList: {
        title: 'ቤቶችን ይፈልጉ',
        subtitle: 'በአዲስ አበባ ፍጹም የሆነ ቤትዎን ያግኙ',
        searchPlaceholder: 'በቦታ ይፈልጉ...',
        noResults: 'ከፍለጋዎ ጋር የሚዛመድ ቤት አልተገኘም።',
        advancedFilters: 'ተጨማሪ ማጣሪያዎች',
        resetAll: 'ሁሉንም ሰርዝ',
        priceRange: 'የዋጋ ክልል (ብር)',
        specifications: 'ዝርዝሮች',
        anyBeds: 'ማንኛውም መኝታ ቤት',
        anyBaths: 'ማንኛውም መታጠቢያ ቤት',
        allTypes: 'ሁሉም ዓይነቶች'
      },
      propertyDetails: {
        back: 'ወደ ዝርዝሩ ተመለስ',
        contactOwner: 'ባለቤቱን አግኝ',
        messageOwner: 'ለባለቤቱ መልእክት ላክ',
        loginToMessage: 'ለባለቤቱ መልእክት ለመላክ ይግቡ',
        details: 'ዝርዝሮች',
        location: 'ቦታ',
        save: 'አስቀምጥ',
        share: 'አጋራ',
        listedBy: 'የተመዘገበው በ'
      },
      addProperty: {
        title: 'የቤት ዝርዝሮች',
        subtitle: 'ምርጥ ተከራዮችን ለመሳብ ትክክለኛ መረጃ ይስጡ።',
        badge: 'ቤትዎን ዛሬ ያከራዩ',
        publish: 'አውጣ',
        listing: 'በማውጣት ላይ...',
        images: 'የቤት ምስሎች',
        dropImages: 'ምስሎችን እዚህ ይጣሉ ወይም ለመምረጥ ይጫኑ',
        orPasteUrl: 'ወይም ሊንኩን ይለጥፉ',
        pastePlaceholder: 'የምስል ሊንክ እዚህ ይለጥፉ...',
        add: 'አክል'
      },
      dashboard: {
        title: 'የባለቤት ዳሽቦርድ',
        subtitle: 'የቤት ዝርዝሮችዎን እና አፈጻጸምዎን ያስተዳድሩ።',
        addProperty: 'አዲስ ቤት አክል',
        property: 'ቤት',
        views: 'እይታዎች',
        actions: 'ተግባራት',
        noProperties: 'እስካሁን ምንም ቤት አላከራዩም።',
        deleteConfirm: 'ይህንን ቤት ማጥፋት እንደሚፈልጉ እርግጠኛ ነዎት?',
        deleteSuccess: 'ቤቱ በተሳካ ሁኔታ ጠፍቷል'
      },
      auth: {
        loginTitle: 'እንኳን ደህና መጡ',
        loginSubtitle: 'ኪራዮችዎን ለማስተዳደር ይግቡ',
        email: 'የኢሜል አድራሻ',
        password: 'የይለፍ ቃል',
        loginButton: 'ግባ',
        noAccount: 'አካውንት የለዎትም?',
        registerLink: 'እዚህ ይመዝገቡ',
        registerTitle: 'አካውንት ይፍጠሩ',
        registerSubtitle: 'የኢትዮጵያ ምርጥ የቤት ኪራይ መረብን ይቀላቀሉ',
        fullName: 'ሙሉ ስም',
        phone: 'ስልክ ቁጥር',
        tenantRole: 'እኔ ተከራይ ነኝ',
        ownerRole: 'እኔ ባለቤት ነኝ',
        registerButton: 'አካውንት ፍጠር',
        alreadyAccount: 'አካውንት አለዎት?',
        loginLink: 'እዚህ ይግቡ'
      },
      messages: {
        title: 'መልዕክቶች',
        searchPlaceholder: 'ውይይቶችን ይፈልጉ...',
        noConversations: 'እስካሁን ምንም ውይይት የለም።',
        selectConversation: 'ውይይት ይምረጡ',
        selectSubtitle: 'መልዕክት ለመጀመር ከጎን ካለው ዝርዝር ይምረጡ',
        activeNow: 'አሁን ንቁ',
        writeMessage: 'መልዕክት ይጻፉ...',
        loadingMessages: 'መልዕክቶችን በመጫን ላይ...'
      }
    }
  },
  om: {
    translation: {
      nav: {
        home: 'Fuula Dura',
        properties: 'Manneen',
        dashboard: 'Daashboordii',
        messages: 'Ergaawwan',
        login: 'Seeni',
        register: 'Galmaa’i',
        logout: 'Ba’i',
        addProperty: 'Mana Dabali'
      },
      home: {
        heroTitle: 'Amanummaan Kireeffadhaa.',
        heroSubtitle: 'BunaRent abbootii qabeenyaa kireeffattoota mirkanaa’an Finfinnee keessa jiran waliin wal qunnamsiisa. Kafaltii amansiisaa, waliigaltee dijiitaalaa fi bulchiinsa rakkoo hin qabne.',
        browseButton: 'Manneen Ilaali',
        listButton: 'Mana Keessan Galmeessaa',
        badge: "Itoophiyaa keessatti madda bulchiinsa qabeenyaa lakkoofsa 1ffaa",
        feature1Title: 'Manneen Mirkanaa’an',
        feature1Desc: 'Manneen hundi dhugummaa isaanii garee keenyaan ni mirkanaa’u.',
        feature2Title: 'Bakkeewwan Filatamo',
        feature2Desc: 'Boolee, Old Airport, CMC fi kutaalee magaalaa gurguddoo hunda keessatti manneen argadhaa.',
        feature3Title: 'Mirkaneessa Ariifachiisaa',
        feature3Desc: 'Iyyata kiraa keessanii sa’aatii 24 keessatti mirkaneeffadhaa.',
        ctaTitle: 'Mana keessan itti aanu argachuuf qophiidhaa?',
        ctaSubtitle: 'Itoophiyaanota kumaatamaan lakkaawwaman kanneen BunaRent amanatanitti makamaa.',
        ctaButton: 'Amma Jalqabaa'
      },
      common: {
        search: 'Barbaadi',
        filters: 'Filtaroota',
        loading: 'Fe’amaa jira...',
        save: 'Olkaayi',
        cancel: 'Haquu',
        delete: 'Haquu',
        edit: 'Gulaali',
        address: 'Teessoo',
        city: 'Magaalaa',
        price: 'Gatii',
        bedrooms: 'Kutaalee ciisichaa',
        bathrooms: 'Kutaalee dhiqannaa',
        sqft: 'Bal’ina',
        status: 'Haala',
        type: 'Gosa',
        amenities: 'Tajaajiloota',
        description: 'Ibsa',
        availableFrom: 'Irraa jalqabee jira',
        etb: 'ETB',
        perMonth: '/ji’atti'
      },
      propertyList: {
        title: 'Manneen Ilaali',
        subtitle: 'Finfinnee keessatti mana bareedaa argadhaa',
        searchPlaceholder: 'Bakkaan barbaadi...',
        noResults: 'Manneen barbaacha keessan waliin wal siman hin argamne.',
        advancedFilters: 'Filtaroota dabalataa',
        resetAll: 'Hunda haqi',
        priceRange: 'Gatii (ETB)',
        specifications: 'Bal’ina',
        anyBeds: 'Cufa',
        anyBaths: 'Cufa',
        allTypes: 'Gosa hunda'
      },
      propertyDetails: {
        back: 'Gara tarree deebi’i',
        contactOwner: 'Abbaa qabeenyaa qunnami',
        messageOwner: 'Abbaa qabeenyaaf ergaa barreessi',
        loginToMessage: 'Ergaa barreessuuf seeni',
        details: 'Bal’ina',
        location: 'Bakka',
        save: 'Olkaayi',
        share: 'Qoodi',
        listedBy: 'Kan galmeesse'
      },
      addProperty: {
        title: 'Bal’ina Manaa',
        subtitle: 'Kireeffattoota gaarii hawwachuuf odeeffannoo sirrii kennaa.',
        badge: 'Mana keessan har’a galmeessaa',
        publish: 'Maxxansi',
        listing: 'Maxxansaa jira...',
        images: 'Fakkiiwwan Manaa',
        dropImages: 'Fakkiiwwan asitti gataa ykn filachuuf cuqaasaa',
        orPasteUrl: 'Ykn linkii asitti gataa',
        pastePlaceholder: 'Linkii fakkii asitti gataa...',
        add: 'Dabali'
      },
      dashboard: {
        title: 'Daashboordii Abbaa Qabeenyaa',
        subtitle: 'Manneen keessan bulchaa.',
        addProperty: 'Mana Haaraa Dabali',
        property: 'Mana',
        views: 'Ilaalcha',
        actions: 'Gochaawwan',
        noProperties: 'Hamma yoonaatti mana tokko illee hin galmeessine.',
        deleteConfirm: 'Mana kana haquu akka barbaaddu mirkaneeffadhu?',
        deleteSuccess: 'Manni milkaa’inaan haqameera'
      },
      auth: {
        loginTitle: 'Baga Nagaan Deebitan',
        loginSubtitle: 'Kireeffannaa keessan bulchuuf seenaa',
        email: 'Teessoo Imeelii',
        password: 'Jecha Icchitii',
        loginButton: 'Seenuu',
        noAccount: 'Akkaawuntii hin qabdanii?',
        registerLink: 'Asitti galmaa\'aa',
        registerTitle: 'Akkaawuntii Uumaa',
        registerSubtitle: 'Hawaasa kireeffannaa Itoophiyaa isa gaarii tti dabalamaa',
        fullName: 'Maqaa Guutuu',
        phone: 'Lakk. Bilbilaa',
        tenantRole: 'Ani kireeffataadha',
        ownerRole: 'Ani abbaa manaadha',
        registerButton: 'Akkaawuntii Uumi',
        alreadyAccount: 'Akkaawuntii qabdanii?',
        loginLink: 'Asitti seenaa'
      },
      messages: {
        title: 'Ergaawwan',
        searchPlaceholder: 'Waliin dubbiwwan barbaadi...',
        noConversations: 'Hamma ammaatti waliin dubbiin hin jiru.',
        selectConversation: 'Waliin dubbii filadhu',
        selectSubtitle: 'Ergaa jalqabuuf tarree cinaa jiru irraa filadhu',
        activeNow: 'Amma hojiirra jira',
        writeMessage: 'Ergaa barreessi...',
        loadingMessages: 'Ergaawwan fe\'atamaa jiru...'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
