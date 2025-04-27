import { input, password, select } from '@inquirer/prompts';

const currYear = new Date().getFullYear();

const yearOptions = [(currYear - 1).toString(), (currYear - 2).toString(), (currYear - 2).toString()];
const filingStatuses = ['SINGLE', 'MARRIED_FILING_JOINT', 'MARRIED_FILING_SEPARATE', 'HEAD_OF_HOUSEHOLD', 'QUALIFYING_SURVIVING_SPOUSE'];

export interface Idata {
	ssn: string;
	taxYear: typeof yearOptions[number];
	filingStatus: typeof filingStatuses[number];
	amount: string;
}

const stripChars = (ssnInput: string) => {
	return ssnInput.replace(/[-\/_\.\\]/g, '');
}
const cleanMoney = (value: string) => {
	let val = value.replace(/[$,]/g, '');
	val = val.split('.')[0];
	return val;
}

export const getUserInformation = async (): Promise<Idata> => {
	const ssn = await password({ message: 'Enter your SSN no dashes, 9 numbers', validate: (entry) => stripChars(entry).length === 9 });
	const taxYear = await select<string>({ message: 'Enter the tax year', choices: yearOptions });
	const filingStatus = await select<string>({ message: 'Enter your filing status', choices: filingStatuses });
	const refundAmount = await input({ message: 'Enter the expected return amount.' });

	return {
		ssn: stripChars(ssn),
		taxYear,
		filingStatus,
		amount: cleanMoney(refundAmount)
	} as Idata;
}