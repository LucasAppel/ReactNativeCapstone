import * as SQLite from 'expo-sqlite';


export async function createTable() {
    const db = await SQLite.openDatabaseAsync('little_lemon');
    await db.execAsync('create table if not exists menuitems (name text primary key not null, uuid text, description text, price text, category text, image text);');
}

export async function getMenuItems() {
    const db = await SQLite.openDatabaseAsync('little_lemon');
    return await db.getAllAsync('select * from menuitems');
}

export async function saveMenuItems(menuItems) {
    const db = await SQLite.openDatabaseAsync('little_lemon');
    
    // SQL Statement vorbereiten
    let sqlStatement = "INSERT INTO menuitems ('name', 'uuid', 'description', 'price', 'category', 'image') VALUES ";
    
    // Erstellen von Platzhaltern für die Werte
    let placeholders = menuItems.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
    sqlStatement += placeholders;

    let values = [];
    menuItems.forEach((item) => {
        // Hier müssen die korrekten Felder verwendet werden
        values.push(item.name, item.name, item.description, item.price, item.category, item.image);
    });

    // SQL-Statement ausführen
    try {
        await db.execAsync("delete from menuitems");
        await db.runAsync(sqlStatement, values);
        return true; // Erfolgreich gespeichert
    } catch (error) {
        console.error("Error saving menu items: ", error);
        return false; // Fehler beim Speichern
    }
}


export async function filterByQueryAndCategories(query, activeCategories) {
    try {

        const db = await SQLite.openDatabaseAsync('little_lemon');

        let sqlQuery = 'SELECT * FROM menuitems WHERE name LIKE ?';
        let params = [`%${query}%`];

        if (activeCategories.length > 0) {
            const categoryPlaceholders = activeCategories.map(() => '?').join(' OR category=');
            sqlQuery += ` AND (category=${categoryPlaceholders})`;
            params = params.concat(activeCategories.map((cat)=>cat.toLowerCase()));
        }
        
        const result = await db.getAllAsync(sqlQuery, params);
/*         console.log("Query: " + sqlQuery)
        console.log("Params: " + params)
        console.log("res: " + result.length) */
        return result;

    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}


