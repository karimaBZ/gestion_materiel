/* eslint-disable max-len */
const Excel = require('exceljs');
const moment = require('moment');


/**
 * StrapiExport.js controller
 *
 * @description: A set of functions called "actions" of the `strapi-export` plugin.
 */


module.exports = {
  async exportMaterial(ctx) {
    try {
      const { start, end } = ctx.query;
      const searchQuery = start && end ? { createdAt_lte: end, createdAt_gte:start } : {};
      const materialList = await strapi.query('material').find(searchQuery);
      const workbook = new Excel.Workbook();
      const worksheet1 = workbook.addWorksheet('Stat1');
      worksheet1.mergeCells('A1', 'E1');
      worksheet1.getCell('A1').value = 'La liste de matériels '
      worksheet1.getCell('A1').font = {
        name: 'Calibri',
        family: 2,
        size: 12,
        bold: true
      };
      worksheet1.getRow(4).values = [
        'Date de début de période',
        'Date de fin de période',
        'Nom d\'équipement',
        'Etat d\'équipement',
      ];
      worksheet1.getRow(4).alignment = { wrapText: true, vertical: 'middle' };
      worksheet1.getRow(4).height = 100
      worksheet1.columns = [
        { key: 'start', width: 32, style: { numFmt: 'dd-mm-yyyy' } },
        { key: 'end', width: 32, style: { numFmt: 'dd-mm-yyyy' } },
        { key: 'name', width: 32 },
        { key: 'statut', width: 32 }
      ];
      worksheet1.getRow(4).font = {
        name: 'Calibri',
        family: 2,
        size: 12,
        bold: true
      };
      materialList.map((item)=> {
        worksheet1.addRow({
          "start": `${start !== undefined ? moment(start).format('DD/MM/YYYY') : '-'}`,
          "end": `${end !== undefined ? moment(end).format('DD/MM/YYYY') : '-'}`,
          "name": `${item.nom}`,
          "statut": `${item.etat}`,
        })

      })
      ctx.response.attachment("ListMateriel.xlsx")
      ctx.status = 200
      await workbook.xlsx.write(ctx.res)
      ctx.res.end()
    }
    catch (error) {
      console.error('something went wrong while exporting statistics', error);
      ctx.badRequest(null, [{ messages: [{ id: 'something went wrong while exporting statistics' }] }]);
    }
  },
}
