/* eslint-disable max-len */
const Excel = require('exceljs');
// const { reduce, groupBy, values, map, keys } = require('lodash')



/**
 * StrapiExport.js controller
 *
 * @description: A set of functions called "actions" of the `strapi-export` plugin.
 */


module.exports = {
  async exportMaterial(ctx) {
    try {
      const { start, end } = ctx.query;
      const   searchQuery = start && end ? { createdAt_lte: new Date(end), createdAt_gte: new Date(start) } : {};
      console.log("exportMaterial -> searchQuery", searchQuery)
      let materialList= await strapi.query('material').find(searchQuery);
      console.log("exportMaterial -> materialList", materialList)
      const workbook = new Excel.Workbook();
      const worksheet1 = workbook.addWorksheet('Stat1');
      worksheet1.mergeCells('A1', 'E1');
      worksheet1.getCell('A1').value = 'La liste de matériel '
      worksheet1.getCell('A1').font = {
        name: 'Calibri',
        family: 2,
        size: 12,
        bold: true
      };
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
