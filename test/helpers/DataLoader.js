const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

/**
 * Helper para carregar dados de teste a partir de CSV e JSON.
 */
class DataLoader {
    /**
     * Carrega dados de um arquivo CSV
     * @param {string} filename - nome do arquivo dentro de test/data/
     * @returns {Array<Object>}
     */
    static loadCSV(filename) {
        const filepath = path.join(process.cwd(), 'test', 'data', filename);
        const content = fs.readFileSync(filepath, 'utf-8');
        return parse(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            delimiter: ';',
        });
    }

    /**
     * Carrega dados de um arquivo JSON
     * @param {string} filename - nome do arquivo dentro de test/data/
     * @returns {Object}
     */
    static loadJSON(filename) {
        const filepath = path.join(process.cwd(), 'test', 'data', filename);
        const content = fs.readFileSync(filepath, 'utf-8');
        return JSON.parse(content);
    }
}

module.exports = DataLoader;
