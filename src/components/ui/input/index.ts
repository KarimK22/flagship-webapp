import { cva, type VariantProps } from 'class-variance-authority'

export { default as BaseInput } from './BaseInput.vue'

export const inputVariants = cva(
  'h-10 w-full bg-background px-4 py-2 text-base ring-offset-background placeholder:text-purple-gray placeholder:tracking-[0.42px] placeholder:font-semibold disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring focus:ring-purple-gray',
  {
    variants: {
      variant: {
        default: 'rounded-full bg-[rgba(212,197,235,0.02)] shadow-[inset_0px_-28px_24px_-16px_rgba(222,206,235,0.08)] backdrop-blur-[2px]',
        dark: 'bg-dark3/[0.48%] rounded-full shadow-[inset_0px_-4px_16px_-2px_rgba(222,206,235,0.16)] text-light1 backdrop-blur-[4px] hover:text-lavender hover:bg-dark3/[0.56%] hover:shadow-[inset_0px_-4px_16px_-2px_rgba(222,206,235,0.24)] focus:text-lavender focus:bg-dark3/[0.56%] focus:shadow-[inset_0px_-4px_16px_-2px_rgba(222,206,235,0.24)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type InputVariants = VariantProps<typeof inputVariants>