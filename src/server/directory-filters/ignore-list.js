import winston from 'winston';

export default class IgnoreList {
  filter(data) {
    const ignoreList = process.env.IGNORE_LIST;

    if (!ignoreList) {
      winston.warn('IgnoreList filter is used but process.env.IGNORE_LIST does not contain any items.');

      return data;
    }

    const ignoreItems = ignoreList
      .split(',')
      .filter(x => x)
      .map(x => x.trim());

    return data.filter(d => !ignoreItems.some(x => x === d.email || x === d.id));
  }
}
