import {db} from '../config/db.config.js';
import users from "./users.models.js";
import projects from "./projects.models.js";
import proposals from "./proposal.models.js";
import messages from "./messages.models.js";
import reviews from "./reviews.models.js";
import freelancer_accounts from './freelancer_account.models.js';
import payments from './payment_log.models.js'
import project_delivery from './delivery.models.js';


// Associations (Relationships)

// User ↔ Projects
users.hasMany(projects, { foreignKey: "client_id", as: "projects" });
projects.belongsTo(users, { foreignKey: "client_id", as: "client" });

// User ↔ Proposals
users.hasMany(proposals, { foreignKey: "freelancer_id", as: "proposals" });
proposals.belongsTo(users, { foreignKey: "freelancer_id", as: "freelancer" });

// Project ↔ Proposals
projects.hasMany(proposals, { foreignKey: "project_id", as: "proposals" });
proposals.belongsTo(projects, { foreignKey: "project_id", as: "project" });

// Messaging
users.hasMany(messages, { foreignKey: "sender_id", as: "sentMessages" });
users.hasMany(messages, { foreignKey: "receiver_id", as: "receivedMessages" });
messages.belongsTo(users, { foreignKey: "sender_id", as: "sender" });
messages.belongsTo(users, { foreignKey: "receiver_id", as: "receiver" });

// Reviews
users.hasMany(reviews, { foreignKey: "freelancer_id", as: "reviews" });
projects.hasMany(reviews, { foreignKey: "project_id", as: "reviews" });

reviews.belongsTo(users, { foreignKey: "freelancer_id", as: "freelancer" });
reviews.belongsTo(projects, { foreignKey: "project_id", as: "project" });

// Freelancer Account (one-to-one)
users.hasOne(freelancer_accounts, { foreignKey: "user_id" });
freelancer_accounts.belongsTo(users, { foreignKey: "user_id" });

// Delivery (one-to-one)
projects.hasOne(project_delivery, { foreignKey: "project_id" });
project_delivery.belongsTo(projects, { foreignKey: "project_id" });
project_delivery.belongsTo(users, { foreignKey: "freelancer_id" });

// Payment Logs
projects.hasMany(payments, { foreignKey: "project_id", as: "payments" });
payments.belongsTo(projects, { foreignKey: "project_id" });

users.hasMany(payments, { foreignKey: "client_id", as: "clientPayments" });
users.hasMany(payments, { foreignKey: "freelancer_id", as: "freelancerPayments" });

payments.belongsTo(users, { foreignKey: "client_id", as: "client" });
payments.belongsTo(users, { foreignKey: "freelancer_id", as: "freelancer" });


// Sync all models with the database
db.sync({ alter: true }).then(() => {
    console.log("All models were synchronized successfully.");
}).catch((error) => {
    console.error("Error synchronizing models:", error);
});



export { users, projects, proposals, messages, reviews, freelancer_accounts, payments, project_delivery };

