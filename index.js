import json2csv from 'json2csv';
import XLSX from 'xlsx';

const downloadFile = (reply, { dataBody, header, type = 'csv', options }) => {
  const defaultWscols = new Array(header.length);
  const defaultWsrows = new Array(dataBody.length);
  defaultWscols.fill({ wpx: 100 }, 0, header.length);
  defaultWsrows.fill({ hpx: 15 }, 0, dataBody.length);
  const {
    wscols = defaultWscols,
    wsrows = defaultWsrows,
    fileName = 'knownsec',
  } = options;
  let buffer = '';
  let contentType = '';
  const headerZhEn = {};
  const headerZh = [];
  const headerEn = [];
  const dataBodyRet = [];
  header.forEach(item => {
    headerZhEn[item.key] = item.text;
    headerZh.push(item.text);
    headerEn.push(item.key);
  });

  for (const v of dataBody) {
    const obj = {};
    for (const childV in v) {
      if (headerEn.indexOf(childV) !== -1) {
        obj[headerZhEn[childV]] = v[childV];
      }
    }
    dataBodyRet.push(obj);
  }
  switch (type) {
    case 'xlsx':
      const ws = XLSX.utils.json_to_sheet(dataBodyRet, headerZh);
      const wb = { SheetNames: ['Sheet1'], Sheets: { Sheet1: ws } };
      ws['!cols'] = wscols;
      ws['!rows'] = wsrows;
      buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      contentType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    default:
      const bufferData = new Buffer(json2csv({ data: dataBodyRet, fields: headerZh }), 'UTF-8');
      const bufferBom = new Buffer('\xEF\xBB\xBF', 'UTF-8');
      buffer = Buffer.concat([bufferData, bufferBom]);
      contentType = 'text/csv';
      break;
  }
  return reply(buffer)
    .header('Content-Type', `${contentType}; charset=UTF-8`)
    .header(
      'Content-Disposition',
      `attachment; filename=${encodeURIComponent(fileName)}.${type}`
    )
    .header('Pragma', 'no-cache');
};

export default downloadFile;
