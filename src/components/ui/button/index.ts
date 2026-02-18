import { cva, type VariantProps } from 'class-variance-authority'

export { default as BaseButton } from './BaseButton.vue'

const lightinVariant = 'rounded-full bg-[#2525378f] text-white'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-[0.42px] cursor-pointer ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // custom
        lightinOrange: `${lightinVariant}`,
        lightinBlue: `${lightinVariant}`,
        lightin: `${lightinVariant}`,
        classic: 'bg-background/80 text-lavender hover:bg-background/70',
        dark: 'bg-dark3/[48%] shadow-[inset_0px_-4px_16px_-2px_rgba(222,206,235,0.16)] text-light1 backdrop-blur-[4px] hover:text-lavender hover:bg-dark3/90 hover:shadow-[inset_0px_-4px_16px_-2px_rgba(222,206,235,0.24)]',
        darkBg: 'bg-background/[56%] shadow-[inset_0px_-28px_24px_-16px_rgba(222,206,235,0.08)] text-lavender backdrop-blur-[2px] hover:text-lavender hover:bg-background/40',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        classic: 'h-10 rounded-full px-4 py-2',
        icon: 'size-10 rounded-full p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
