#!/usr/bin/env node

const fetch = require('isomorphic-fetch');
const program = require('commander');
const { isFQDN, isURL } = require('validator');
const ora = require('ora');

const { version } = require('../package.json');

const API_KEY = '15a35b3519a04d50aafe031f9d58202e';

const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const extractRootDomain = (urlOrDomain) => {
    const isUrl = isURL(urlOrDomain, { require_protocol: true });
    const domain = (isUrl ? (new URL(urlOrDomain).hostname) : urlOrDomain).split('.').slice(-2).join('.');

    return domain;
};

const similarwebRank = async (urlOrDomain) => {
    const domain = extractRootDomain(urlOrDomain);

    const data = await fetch(`https://api.similarweb.com/v1/similar-rank/${domain}/rank?api_key=${API_KEY}`)
        .then((res) => res.json());

    if (!data.similar_rank) return 0;

    return data.similar_rank.rank;
};

const action = async (arg) => {
    if (typeof arg !== 'string' || (!isFQDN(arg) && !isURL(arg))) {
        program.outputHelp();
        process.exit(1);
    }

    const domain = await extractRootDomain(arg);
    const spinner = ora(`Fetching page rank for ${domain}`).start();
    const rank = await similarwebRank(domain).catch(({ message }) => spinner.fail(message) && process.exit(2));

    spinner.stopAndPersist({ symbol: '✔' });

    if (rank === 0) {
        spinner.fail(`${domain} is not ranked with Similarweb`);
        return;
    }

    spinner.succeed(`${domain} is ranked ${numberWithCommas(rank)}`);
};

if (process.env.NODE_ENV !== 'test') {
    program
        .version(version, '-v, --version')
        .action(action)
        .usage('<domain>')
        .parse(process.argv);

    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }
}

module.exports = { similarwebRank };
