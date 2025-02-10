tailwind.config = {
    theme: {
      extend: {
        colors: {
          'custom-dark-blue': '#151952',
          'custom-grey-bg': '#EAEAEA',
          'custom-red': '#FF0800',
          'dark-blue': '#1A1D29',
          'matte-black': '#28282B',
          'dark-theme': '#11001F',
          'custom-grey': '#4a4a4a',
          clifford: '#da373d',
        },
        fontFamily: {
          'clash-display': ['"Clash Display"', 'sans-serif'],
          'switzer': ['"Switzer"', 'sans-serif'],
          'general-sans': ['"General Sans"', 'sans-serif'],
          'arial': ['"Arial"', 'sans-serif']
        },
        gridTemplateColumns: {
          'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
        }, 
        maxHeight: {
          'workHeight': '8rem',
        },
        letterSpacing: {
          'minus-5': '0.05em', // equivalent to -5%
        },
      }
    },

    darkMode: 'selector'
  }