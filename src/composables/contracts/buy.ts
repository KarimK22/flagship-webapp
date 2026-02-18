import api from '@/services/api.ts'

export const useBuying = () => {

  async function getBuyQuote(
    amount: number,
    currency: string,
    convertedCurrency: string,
    blockchain: string,
    quoteCurrency: string,
  ) {
    try {
      const response = await api.getQuote(amount, currency, convertedCurrency, blockchain, quoteCurrency)
      if (response.data) {
        const creditCardResponse = response.data.find((item: { payment_method: string, converted_amount: string }) => item.payment_method === 'card')
        if (!creditCardResponse) {
          throw new Error('No credit card quote found')
        }
        return creditCardResponse.converted_amount
      }
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get quote')
    }
  }

  return {
    getBuyQuote,
  }
}