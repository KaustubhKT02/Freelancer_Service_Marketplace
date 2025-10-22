import sequalize from 'sequelize';

const db = new sequalize ('postgresql://postgres:OxQDypgq6efX78Lo@db.rtbjqqsddfvqnctzpzxx.supabase.co:5432/postgres', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
})

const connectionDb = async () => {
    try {
    await sequalize.authenticate();
    console.log('Connection has been established successfully.');

} catch (error) {
    console.error('Unable to connect to the database:', error);
}
}


export {db, connectionDb};
