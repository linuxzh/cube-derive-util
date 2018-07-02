'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _json2csv = require('json2csv');

var _json2csv2 = _interopRequireDefault(_json2csv);

var _xlsx = require('xlsx');

var _xlsx2 = _interopRequireDefault(_xlsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var downloadFile = function downloadFile(reply, _ref) {
  var dataBody = _ref.dataBody,
      header = _ref.header,
      _ref$type = _ref.type,
      type = _ref$type === undefined ? 'csv' : _ref$type,
      options = _ref.options;

  var defaultWscols = new Array(header.length);
  var defaultWsrows = new Array(dataBody.length);
  defaultWscols.fill({ wpx: 100 }, 0, header.length);
  defaultWsrows.fill({ hpx: 15 }, 0, dataBody.length);
  var _options$wscols = options.wscols,
      wscols = _options$wscols === undefined ? defaultWscols : _options$wscols,
      _options$wsrows = options.wsrows,
      wsrows = _options$wsrows === undefined ? defaultWsrows : _options$wsrows,
      _options$fileName = options.fileName,
      fileName = _options$fileName === undefined ? 'knownsec' : _options$fileName;

  var buffer = '';
  var contentType = '';
  var headerZhEn = {};
  var headerZh = [];
  var headerEn = [];
  var dataBodyRet = [];
  header.forEach(function (item) {
    headerZhEn[item.key] = item.text;
    headerZh.push(item.text);
    headerEn.push(item.key);
  });

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = dataBody[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var v = _step.value;

      var obj = {};
      for (var childV in v) {
        if (headerEn.indexOf(childV) !== -1) {
          obj[headerZhEn[childV]] = v[childV];
        }
      }
      dataBodyRet.push(obj);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  switch (type) {
    case 'xlsx':
      var ws = _xlsx2.default.utils.json_to_sheet(dataBodyRet, headerZh);
      var wb = { SheetNames: ['Sheet1'], Sheets: { Sheet1: ws } };
      ws['!cols'] = wscols;
      ws['!rows'] = wsrows;
      buffer = _xlsx2.default.write(wb, { bookType: 'xlsx', type: 'buffer' });
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    default:
      var bufferData = new Buffer((0, _json2csv2.default)({ data: dataBodyRet, fields: headerZh }), 'UTF-8');
      var bufferBom = new Buffer('\xEF\xBB\xBF', 'UTF-8');
      buffer = Buffer.concat([bufferData, bufferBom]);
      contentType = 'text/csv';
      break;
  }
  return reply(buffer).header('Content-Type', contentType + '; charset=UTF-8').header('Content-Disposition', 'attachment; filename=' + encodeURIComponent(fileName) + '.' + type).header('Pragma', 'no-cache');
};

exports.default = downloadFile;
