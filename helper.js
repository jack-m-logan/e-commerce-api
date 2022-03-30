const patchUpdate = (id, columns) => {
    const query = [`UPDATE ${table}`];
    query.push('SET');
    let set = [];
    Object.keys(columns).forEach((key, i) => {
        set.push(key + ' = ($' + (i + 1) + ')');
    });
    query.push(set.join(', '));
    query.push(`WHERE ${col} = ` + id);
    return query.join(' ');
};

module.exports = patchUpdate;