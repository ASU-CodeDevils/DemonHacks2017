
var mysql     =    require('mysql');
var execSQL   =    require('exec-sql');

var pool = null;

function connect(db, user, password) {
    pool  = mysql.createPool({
        connectionLimit : 10,
        host     : 'localhost',
        database : db,
        user     : user,
        password : password,
        multipleStatements: true
    });
}
//github brewsimDB 2017
function initializeDatabase(dir) {
    execSQL.connect('', process.env.DB_USER, process.env.DB_PASSWORD); // first field, database name, intentionally left as empty string. The script creates the database.
    execSQL.executeDirectory(dir, function(err) {
        if(err) throw err;
        execSQL.disconnect();
        console.log('Done executing directory ' + dir);
    });
}
function disconnect() {
    pool.disconnect;
    pool = null;
}

function getAllHops(callback) {
    var sql = 'SELECT * FROM hops;'

    pool.query(sql, function (err, result) {
        if (err) throw err;
        else callback(result);
        console.log(result);
    });
}



function getAllGrain(callback) {
    var sql = 'SELECT * FROM grain;'

    pool.query(sql, function (err, result) {
        if (err) throw err;
        else callback(result);
        console.log(result);
    });
}
function getAllYeast(callback) {
    var sql = 'SELECT * FROM yeast;'

    pool.query(sql, function (err, result) {
        if (err) throw err;
        else callback(result);
        console.log(result);
    });
}

function getHopsByAA(minAA, maxAA, callback) {
    var sql = 'SELECT * FROM hops WHERE alpha_acid >= ? AND alpha_acid <= ?;'

    pool.query(sql,[minAA, maxAA], function (err, result) {
        if (err) throw err;
        else callback(result);
        console.log(result);
    });
}
function getHopsByPurpose(purpose, callback) {
    var sql = 'SELECT * FROM hops WHERE purpose = ? OR purpose = "dual";'

    pool.query(sql,[purpose], function (err, result) {
        if (err) throw err;
        else callback(result);
        console.log(result);
    });
}
function getYeastByName(name, callback) {
    var sql = 'SELECT * FROM yeast WHERE name LIKE ?;'
    name = '\%' + name + '\%';

    pool.query(sql,[name], function (err, result) {
        if (err) throw err;
        else callback(result);
        console.log(result);
    });
}
function getYeastByRegion(region, callback) {
    var sql = 'SELECT * FROM yeast WHERE region = ?;'

    pool.query(sql,[region], function (err, result) {
        if (err) throw err;
        else callback(result);
        console.log(result);
    });
}
function getYeastByType(type, callback) {
    var sql = 'SELECT * FROM yeast WHERE yeast_type = ?;'

    pool.query(sql,[type], function (err, result) {
        if (err) throw err;
        else callback(result);
        console.log(result);
    });
}
function getYeastByAA(minAA, maxAA, callback) {
    var sql = 'SELECT * FROM yeast WHERE apparent_attenuation >= ? AND apparent_attenuation <= ?;'

    pool.query(sql,[minAA, maxAA], function (err, result) {
        if (err) throw err;
        else callback(result);
        console.log(result);
    });
}

function getRecipeByGrainName(grain, callback) {
    var sql = 'SELECT DISTINCT beer_recipe.name, beer_recipe.id AS \'recipe_id\' '+
        'FROM grain, beer_recipe, grain_in_recipe '+
        'WHERE grain.name  LIKE ? '+
        'AND beer_recipe.id = grain_in_recipe.recipe_id AND grain.id = grain_in_recipe.grain_id;';
    grain = '\%' + grain + '\%';
    console.log(sql);

    pool.query(sql,[grain], function (err, result) {
        if (err) throw err;
        else callback(result);
        console.log(result);
    });

}
function addHops(name, AA, purpose, description) {
    // optional: description
    var sql = 'INSERT INTO hops(name, description, alpha_acid, purpose) '+
        'VALUES(?, ?, ?, ?);'

    pool.query(sql,[name, description, AA, purpose], function (err, result) {
        if (err) throw err;
        console.log(result);
    });
}
function addGrain(name, PE, lovibonds, region, description) {
    // optional: region, description
    var sql = 'INSERT INTO grain(name, description, region, potential_extract, lovibonds) '+
        'VALUES(?, ?, ?, ?, ?);'

    pool.query(sql,[name, description, region, PE, lovibonds], function (err, result) {
        if (err) throw err;
        console.log(result);
    });
}
function addYeast(name, region, AA, type, description) {
    // optional: description
    var sql = 'INSERT INTO yeast(name, region, apparent_attenuation, yeast_type, description) '+
        'VALUES(?, ?, ?, ?, ?);'

    pool.query(sql,[name, region, AA, type, description], function (err, result) {
        if (err) throw err;
        console.log(result);
    });
}
function addAdditive(name, useCase, description) {
    // optional: description
    var sql = 'INSERT INTO additive(name, description, use_case) '+
        'VALUES(?, ?, ?);'

    pool.query(sql,[name, useCase, description], function (err, result) {
        if (err) throw err;
        console.log(result);
    });
}