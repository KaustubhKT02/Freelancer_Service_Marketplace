import { db } from "../config/db.config";
import users from "./users.models.js";
import projects from "./projects.models.js";
import proposals from "./proposals.models.js";
import messages from "./messages.models.js";
import reviews from "./reviews.models.js";

// Associations (Relationships)

// User - Project (One-to-Many) (Client can have multiple projects)
Users.hasMany(projects, { foreignKey: 'client_id', as: 'projects' });
projects.belongsTo(Users, { foreignKey: 'client_id', as: 'client' });

// User - Proposal (One-to-Many) (Freelancer can have multiple proposals)
Users.hasMany(proposals, { foreignKey: 'freelancer_id', as: 'proposals' });
proposals.belongsTo(Users, { foreignKey: 'freelancer_id', as: 'freelancer' });

// Project - Proposal (One-to-Many) (A project can have multiple proposals)
projects.hasMany(proposals, { foreignKey: 'project_id', as: 'proposals' });
proposals.belongsTo(projects, { foreignKey: 'project_id', as: 'project' });

// User - Message (Many-to-Many) (serveral associations for sender and receiver)
Users.hasMany(messages, { foreignKey: 'sender_id', as: 'sentMessages' });
messages.belongsTo(Users, { foreignKey: 'sender_id', as: 'sender' });
Users.hasMany(messages, { foreignKey: 'receiver_id', as: 'receivedMessages' });
messages.belongsTo(Users, { foreignKey: 'receiver_id', as: 'receiver' });

// User - Review (One-to-Many) (Freelancer can have multiple reviews)
Users.hasMany(reviews, { foreignKey: 'freelancer_id', as: 'reviews' });
reviews.belongsTo(Users, { foreignKey: 'freelancer_id', as: 'freelancer' });

// Project - Review (One-to-Many) (A project can have multiple reviews)
projects.hasMany(reviews, { foreignKey: 'project_id', as: 'reviews' });
reviews.belongsTo(projects, { foreignKey: 'project_id', as: 'project' });


// Sync all models with the database
db.sync({ alter: true }).then(() => {
    console.log("All models were synchronized successfully.");
}).catch((error) => {
    console.error("Error synchronizing models:", error);
});


export  {users, projects, proposals, messages, reviews };

