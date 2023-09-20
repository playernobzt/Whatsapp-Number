const moment = require('moment');
const localize = require('moment/locale/id');
moment.updateLocale('id', localize);

function convert(time) {
  const data = {
    hari: moment(time).local('id').format('dddd'),
    tanggal: moment(time).local('id').format('DD'),
    bulan: moment(time).local('id').format('MMMM'),
    tahun: moment(time).local('id').format('YYYY'),
    jam: parseInt(moment(time).local('id').format('HH')),
    menit: moment(time).local('id').format('mm'),
  };

  return data;
}

// const result = convert(1694846837000);
// console.log(result.hari);
// console.log(result.tanggal);
// console.log(result.bulan);
// console.log(result.tahun);

module.exports = convert;
