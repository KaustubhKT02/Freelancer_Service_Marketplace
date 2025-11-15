import {db} from '../config/db.config.js';
import users from "./users.models.js";
import projects from "./projects.models.js";
import proposals from "./proposal.models.js";
import messages from "./messages.models.js";
import reviews from "./reviews.models.js";
import freelancer_accounts from './freelancer_account.models.js';
import project_delivery from './delivery.models.js';


// Associations (Relationships)

// User - Project (One-to-Many) (Client can have multiple projects)
users.hasMany(projects, { foreignKey: 'client_id', as: 'projects' });
projects.belongsTo(users, { foreignKey: 'client_id', as: 'client' });

// User - Proposal (One-to-Many) (Freelancer can have multiple proposals)
users.hasMany(proposals, { foreignKey: 'freelancer_id', as: 'proposals' });
proposals.belongsTo(users, { foreignKey: 'freelancer_id', as: 'freelancer' });

// Project - Proposal (One-to-Many) (A project can have multiple proposals)
projects.hasMany(proposals, { foreignKey: 'project_id', as: 'proposals' });
proposals.belongsTo(projects, { foreignKey: 'project_id', as: 'project' });

// User - Message (Many-to-Many) (serveral associations for sender and receiver)
users.hasMany(messages, { foreignKey: 'sender_id', as: 'sentMessages' });
messages.belongsTo(users, { foreignKey: 'sender_id', as: 'sender' });
users.hasMany(messages, { foreignKey: 'receiver_id', as: 'receivedMessages' });
messages.belongsTo(users, { foreignKey: 'receiver_id', as: 'receiver' });

// User - Review (One-to-Many) (Freelancer can have multiple reviews)
users.hasMany(reviews, { foreignKey: 'freelancer_id', as: 'reviews' });
reviews.belongsTo(users, { foreignKey: 'freelancer_id', as: 'freelancer' });

// Project - Review (One-to-Many) (A project can have multiple reviews)
projects.hasMany(reviews, { foreignKey: 'project_id', as: 'reviews' });
reviews.belongsTo(projects, { foreignKey: 'project_id', as: 'project' });

// users - freelancer_account (one-to-one) (A user can have a single acoount details)
users.hasOne(freelancer_accounts, {foreignKey: 'user_id'})
freelancer_accounts.belongsTo(users, {foreignKey: 'user_id'});

// project - project_delivery (one-to-one ) (A Project can have a sing project delivery)
projects.hasOne(project_delivery, {foreignKey: 'project_id'})
project_delivery.belongsTo(projects, {foreignKey: 'project_id'})
project_delivery.belongsTo(users, {foreignKey: 'freelancer_id'})



// Sync all models with the database
db.sync({ alter: true }).then(() => {
    console.log("All models were synchronized successfully.");
}).catch((error) => {
    console.error("Error synchronizing models:", error);
});



export { users, projects, proposals, messages, reviews, freelancer_accounts, project_delivery };

