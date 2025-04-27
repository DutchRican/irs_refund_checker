import { existsSync, readFileSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';
import { getUserInformation, type Idata } from "./userInformation";

export const firstTimeRun = async () => {
	console.log('First run setup info needed: \n');
	const info = await getUserInformation();
	if (info.amount && info.filingStatus && info.ssn && info.taxYear) {
		createEnvFile(info);
		return info;
	} else {
		console.error('Something went wrong.');
		process.exit(1);
	}
}

const makePath = () => {
	const homedir = os.homedir();
	return path.join(homedir, '.irs_refund');
}

const createEnvFile = (data: Idata) => {
	const homedir = os.homedir();
	writeFileSync(makePath(), JSON.stringify(data), { encoding: 'utf-8' });
}

export const readEnvFile = () => {
	const homedir = os.homedir();
	if (existsSync(makePath())) {
		const data = readFileSync(makePath(), { encoding: 'utf-8' });
		return JSON.parse(data) as Idata;
	}
}