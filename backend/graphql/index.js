'use strict';

const GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLSchema,
} = GraphQL;


// import the user query file we created
const UserQuery = require('./queries/User');
const ClientQuery = require('./queries/Client');
const OrderItemQuery = require('./queries/OrderItem');
const OrderQuery = require('./queries/Order');
const LessonTypeQuery = require('./queries/LessonType');
const MassageTypeQuery = require('./queries/MassageType');
const LessonQuery = require('./queries/Lesson');
const LessonMemberQuery = require('./queries/LessonMember');

// import the user mutation file we created
const UserMutation = require('./mutations/User');
const ClientMutation = require('./mutations/Client');
const OrderItemMutation = require('./mutations/OrderItem');
const OrderMutation = require('./mutations/Order');
const LessonTypeMutation = require('./mutations/LessonType');
const MassageTypeMutation = require('./mutations/MassageType');
const LessonMutation = require('./mutations/Lesson');
const LessonMemberMutation = require('./mutations/LessonMember');


// lets define our root query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'This is the default root query provided by the backend',
    fields: {
        users: UserQuery.index(),
        user: UserQuery.single(),
        orders: OrderQuery.index(),
        order: OrderQuery.single(),
        orderItems: OrderItemQuery.index(),
        orderItem: OrderItemQuery.single(),
        clients: ClientQuery.index(),
        client: ClientQuery.single(),
        lessonTypes: LessonTypeQuery.index(),
        lessonType: LessonTypeQuery.single(),
        massageTypes: MassageTypeQuery.index(),
        massageType: MassageTypeQuery.single(),
        lessons: LessonQuery.index(),
        lesson: LessonQuery.single(),
        lessonMembers: LessonMemberQuery.index(),
        lessonMember: LessonMemberQuery.single(),
    },
});


// lets define our root mutation
const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Default mutation provided by the backend APIs',
    fields: {
        addUser: UserMutation.create(),
        updateUser: UserMutation.update(),
        deleteUser: UserMutation.delete(),
        addClient: ClientMutation.create(),
        updateClient: ClientMutation.update(),
        deleteClient: ClientMutation.delete(),
        addOrderItem: OrderItemMutation.create(),
        updateOrderItem: OrderItemMutation.update(),
        deleteOrderItem: OrderItemMutation.delete(),
        addOrder: OrderMutation.create(),
        updateOrder: OrderMutation.update(),
        deleteOrder: OrderMutation.delete(),
        addLessonType: LessonTypeMutation.create(),
        updateLessonType: LessonTypeMutation.update(),
        deleteLessonType: LessonTypeMutation.delete(),
        addMassageType: MassageTypeMutation.create(),
        updateMassageType: MassageTypeMutation.update(),
        deleteMassageType: MassageTypeMutation.delete(),
        addLesson: LessonMutation.create(),
        updateLesson: LessonMutation.update(),
        deleteLesson: LessonMutation.delete(),
        addLessonMember: LessonMemberMutation.create(),
        updateLessonMember: LessonMemberMutation.update(),
        deleteLessonMember: LessonMemberMutation.delete(),

    },
});



// export the schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});
