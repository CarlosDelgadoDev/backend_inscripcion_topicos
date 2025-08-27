'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const carreras = await queryInterface.sequelize.query(
      `SELECT id, sigla FROM "Carreras";`
    );

    const carreraMap = {};
    carreras[0].forEach(carr => {
      carreraMap[carr.sigla] = carr.id;
    });

        // Datos de planes de estudio
    const planes = [
      {
        nombre: 'Plan 2023 - Ingeniería en Sistemas',
        tipoPeriodo: 'Semestral',
        modalidad: 'Presencial',
        carreraId: carreraMap['INF'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Plan 2023 - Telecomunicaciones',
        tipoPeriodo: 'Semestral',
        modalidad: 'Presencial',
        carreraId: carreraMap['RDS'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Plan 2022 - Filosofía',
        tipoPeriodo: 'Anual',
        modalidad: 'Presencial',
        carreraId: carreraMap['FIL'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Plan 2022 - Derecho',
        tipoPeriodo: 'Semestral',
        modalidad: 'Presencial',
        carreraId: carreraMap['DER'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Plan 2024 - Administración de Empresas',
        tipoPeriodo: 'Semestral',
        modalidad: 'Virtual',
        carreraId: carreraMap['ADE'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Plan 2024 - Diseño Gráfico',
        tipoPeriodo: 'Semestral',
        modalidad: 'Semipresencial',
        carreraId: carreraMap['DG'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Insertamos los planes
    await queryInterface.bulkInsert('Plan_de_estudios', planes, {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
