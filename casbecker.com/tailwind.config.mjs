/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			text: {
  				'50': 'rgb(var(--text-50) / <alpha-value>)',
  				'100': 'rgb(var(--text-100) / <alpha-value>)',
  				'200': 'rgb(var(--text-200) / <alpha-value>)',
  				'300': 'rgb(var(--text-300) / <alpha-value>)',
  				'400': 'rgb(var(--text-400) / <alpha-value>)',
  				'500': 'rgb(var(--text-500) / <alpha-value>)',
  				'600': 'rgb(var(--text-600) / <alpha-value>)',
  				'700': 'rgb(var(--text-700) / <alpha-value>)',
  				'800': 'rgb(var(--text-800) / <alpha-value>)',
  				'900': 'rgb(var(--text-900) / <alpha-value>)',
  				'950': 'rgb(var(--text-950) / <alpha-value>)'
  			},
  			background: {
  				'50': 'rgb(var(--background-50) / <alpha-value>)',
  				'100': 'rgb(var(--background-100) / <alpha-value>)',
  				'200': 'rgb(var(--background-200) / <alpha-value>)',
  				'300': 'rgb(var(--background-300) / <alpha-value>)',
  				'400': 'rgb(var(--background-400) / <alpha-value>)',
  				'500': 'rgb(var(--background-500) / <alpha-value>)',
  				'600': 'rgb(var(--background-600) / <alpha-value>)',
  				'700': 'rgb(var(--background-700) / <alpha-value>)',
  				'800': 'rgb(var(--background-800) / <alpha-value>)',
  				'900': 'rgb(var(--background-900) / <alpha-value>)',
  				'950': 'rgb(var(--background-950) / <alpha-value>)',
  				DEFAULT: 'hsl(var(--background))',
  			},
  			primary: {
  				'50': 'rgb(var(--primary-50) / <alpha-value>)',
  				'100': 'rgb(var(--primary-100) / <alpha-value>)',
  				'200': 'rgb(var(--primary-200) / <alpha-value>)',
  				'300': 'rgb(var(--primary-300) / <alpha-value>)',
  				'400': 'rgb(var(--primary-400) / <alpha-value>)',
  				'500': 'rgb(var(--primary-500) / <alpha-value>)',
  				'600': 'rgb(var(--primary-600) / <alpha-value>)',
  				'700': 'rgb(var(--primary-700) / <alpha-value>)',
  				'800': 'rgb(var(--primary-800) / <alpha-value>)',
  				'900': 'rgb(var(--primary-900) / <alpha-value>)',
  				'950': 'rgb(var(--primary-950) / <alpha-value>)',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': 'rgb(var(--secondary-50) / <alpha-value>)',
  				'100': 'rgb(var(--secondary-100) / <alpha-value>)',
  				'200': 'rgb(var(--secondary-200) / <alpha-value>)',
  				'300': 'rgb(var(--secondary-300) / <alpha-value>)',
  				'400': 'rgb(var(--secondary-400) / <alpha-value>)',
  				'500': 'rgb(var(--secondary-500) / <alpha-value>)',
  				'600': 'rgb(var(--secondary-600) / <alpha-value>)',
  				'700': 'rgb(var(--secondary-700) / <alpha-value>)',
  				'800': 'rgb(var(--secondary-800) / <alpha-value>)',
  				'900': 'rgb(var(--secondary-900) / <alpha-value>)',
  				'950': 'rgb(var(--secondary-950) / <alpha-value>)',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				'50': 'rgb(var(--accent-50) / <alpha-value>)',
  				'100': 'rgb(var(--accent-100) / <alpha-value>)',
  				'200': 'rgb(var(--accent-200) / <alpha-value>)',
  				'300': 'rgb(var(--accent-300) / <alpha-value>)',
  				'400': 'rgb(var(--accent-400) / <alpha-value>)',
  				'500': 'rgb(var(--accent-500) / <alpha-value>)',
  				'600': 'rgb(var(--accent-600) / <alpha-value>)',
  				'700': 'rgb(var(--accent-700) / <alpha-value>)',
  				'800': 'rgb(var(--accent-800) / <alpha-value>)',
  				'900': 'rgb(var(--accent-900) / <alpha-value>)',
  				'950': 'rgb(var(--accent-950) / <alpha-value>)',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		transitionDuration: {
  			'100': '100ms',
  			'200': '200ms',
  			'300': '300ms',
  			'400': '400ms',
  			'500': '500ms',
  			'600': '600ms',
  			'700': '700ms',
  			'800': '800ms',
  			'900': '900ms',
  			'1000': '1000ms'
  		},
  		transitionDelay: {
  			'100': '100ms',
  			'200': '200ms',
  			'300': '300ms',
  			'400': '400ms',
  			'500': '500ms',
  			'600': '600ms',
  			'700': '700ms',
  			'800': '800ms',
  			'900': '900ms',
  			'1000': '1000ms'
  		},
  		backdropBlur: {
  			sm: '4px',
  			md: '8px',
  			lg: '12px'
  		},
  		scale: {
  			'0': '0',
  			'5': '0.05',
  			'10': '0.1',
  			'15': '0.15',
  			'20': '0.2',
  			'25': '0.25',
  			'30': '0.3',
  			'35': '0.35',
  			'40': '0.4',
  			'45': '0.45',
  			'50': '0.5',
  			'55': '0.55',
  			'60': '0.6',
  			'65': '0.65',
  			'70': '0.7',
  			'75': '0.75',
  			'80': '0.8',
  			'85': '0.85',
  			'90': '0.9',
  			'95': '0.95',
  			'100': '1'
  		},
  		backgroundOpacity: {
  			'0': '0',
  			'5': '0.05',
  			'10': '0.1',
  			'15': '0.15',
  			'20': '0.2',
  			'25': '0.25',
  			'30': '0.3',
  			'35': '0.35',
  			'40': '0.4',
  			'45': '0.45',
  			'50': '0.5',
  			'55': '0.55',
  			'60': '0.6',
  			'65': '0.65',
  			'70': '0.7',
  			'75': '0.75',
  			'80': '0.8',
  			'85': '0.85',
  			'90': '0.9',
  			'95': '0.95',
  			'100': '1'
  		},
  		opacity: {
  			'0': '0',
  			'5': '0.05',
  			'10': '0.1',
  			'15': '0.15',
  			'20': '0.2',
  			'25': '0.25',
  			'30': '0.3',
  			'35': '0.35',
  			'40': '0.4',
  			'45': '0.45',
  			'50': '0.5',
  			'55': '0.55',
  			'60': '0.6',
  			'65': '0.65',
  			'70': '0.7',
  			'75': '0.75',
  			'80': '0.8',
  			'85': '0.85',
  			'90': '0.9',
  			'95': '0.95',
  			'100': '1'
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-in-out',
  			'slide-up': 'slideUp 0.5s ease-out',
  			'slide-in': 'slideIn 0.5s ease-out',
  			'scale-up': 'scaleUp 0.3s ease-out',
  			'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					transform: 'translateY(20px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			slideIn: {
  				'0%': {
  					transform: 'translateX(-20px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			scaleUp: {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			'border-beam': {
  				'100%': {
  					'offset-distance': '100%'
  				}
  			},
          blink: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0' }
          }
  		},
  		transitionTimingFunction: {
  			'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  			out: 'cubic-bezier(0, 0, 0.2, 1)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
