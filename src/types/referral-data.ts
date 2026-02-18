export type ReferralDataResponse = {
	me: {
		referralCode: string
		referral: {
			users: {
				total: number
				active: number
				inactive: number
			}
			power: number
		}
	}
}

export type ReferralData = ReferralDataResponse['me']

