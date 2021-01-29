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
      const searchQuery = start && end ? { createdAt_lte: end, createdAt_gte: start } : {};
      const materialList = await strapi.query('material').find(searchQuery);
      const userList = await strapi.query('employeur').find(searchQuery);
      console.log("exportMaterial -> userList", userList)
      const workbook = new Excel.Workbook();
      //première Liste de matériels
      const worksheet1 = workbook.addWorksheet('Liste de matériels');
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
      materialList.map((item) => {
        worksheet1.addRow({
          "start": `${start !== undefined ? moment(start).format('DD/MM/YYYY') : '-'}`,
          "end": `${end !== undefined ? moment(end).format('DD/MM/YYYY') : '-'}`,
          "name": `${item.nom}`,
          "statut": `${item.etat}`,
        })

      })
      //deuxième liste de users/materiels
      const worksheet2 = workbook.addWorksheet('Liste employé et matériels');
      worksheet2.mergeCells('A1', 'E1');
      worksheet2.getCell('A1').value = 'La liste d\'employé et matériels '
      worksheet2.getCell('A1').font = {
        name: 'Calibri',
        family: 2,
        size: 12,
        bold: true
      };
      worksheet2.getRow(4).values = [
        'Date de début de période',
        'Date de fin de période',
        'Nom d\'employés',
        'Prénom d\'employés',
        'Email d\'employés',
        'Poste d\'employés',
        'La Liste de matériels',
      ];
      worksheet2.getRow(4).alignment = { wrapText: true, vertical: 'middle' };
      worksheet2.getRow(4).height = 100
      worksheet2.columns = [
        { key: 'start', width: 32, style: { numFmt: 'dd-mm-yyyy' } },
        { key: 'end', width: 32, style: { numFmt: 'dd-mm-yyyy' } },
        { key: 'lastName', width: 32 },
        { key: 'firstName', width: 32 },
        { key: 'email', width: 32 },
        { key: 'post', width: 32 },
        { key: 'material', width: 32 }
      ];
      worksheet2.getRow(4).font = {
        name: 'Calibri',
        family: 2,
        size: 12,
        bold: true
      };
      userList.map((item) => {
        worksheet2.addRow({
          "start": `${start !== undefined ? moment(start).format('DD/MM/YYYY') : '-'}`,
          "end": `${end !== undefined ? moment(end).format('DD/MM/YYYY') : '-'}`,
          "lastName": `${item.nom}`,
          "firstName": `${item.prenom}`,
          "email": `${item.email}`,
          "post": `${item.poste}`,
          "material": `${item.materials && item.materials.map((a) => 
          ` Nom d'équipement : ${a.nom}
            Ref d'équipement : ${a.codeREF}
            Etat d'équipement : ${a.etat}
          `
          )}`,
        })

      })
      ctx.response.attachment("Employés&&matériels.xlsx")
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
