'use strict';

const GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLSchema,
} = GraphQL;


const UserQuery = require('./queries/User');
const ClientQuery = require('./queries/Client');
const OrderItemQuery = require('./queries/OrderItem');
const OrderQuery = require('./queries/Order');
const LessonTypeQuery = require('./queries/LessonType');
const MassageTypeQuery = require('./queries/MassageType');
const MassageRoomQuery = require('./queries/MassageRoom');
const MassageOrderQuery = require('./queries/MassageOrder');
const LessonQuery = require('./queries/Lesson');
const LessonMemberQuery = require('./queries/LessonMember');
const LocationQuery = require('./queries/Location');
const OpeningTimeQuery = require('./queries/OpeningTime');
const TestQuery = require('./queries/Test');

const UserMutation = require('./mutations/User');
const ClientMutation = require('./mutations/Client');
const OrderItemMutation = require('./mutations/OrderItem');
const OrderMutation = require('./mutations/Order');
const LessonTypeMutation = require('./mutations/LessonType');
const MassageTypeMutation = require('./mutations/MassageType');
const MassageRoomMutation = require('./mutations/MassageRoom');
const MassageOrderMutation = require('./mutations/MassageOrder');
const LessonMutation = require('./mutations/Lesson');
const LessonMemberMutation = require('./mutations/LessonMember');
const LocationMutation = require('./mutations/Location');
const OpeningTimeMutation = require('./mutations/OpeningTime');
const TestMutation = require('./mutations/Test');


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'This is the default root query provided by the backend',
    fields: {
        users: UserQuery.index(),
        user: UserQuery.single(),
        orders: OrderQuery.index(),
        orders_pages: OrderQuery.index_pages(),
        order: OrderQuery.single(),
        orderReport: OrderQuery.report(),
        orderItems: OrderItemQuery.index(),
        orderItem: OrderItemQuery.single(),
        clients: ClientQuery.index(),
        clients_pages: ClientQuery.index_pages(),
        client: ClientQuery.single(),
        clientOld: ClientQuery.single_by_old(),
        clientsLookup: ClientQuery.lookup(),
        lessonTypes: LessonTypeQuery.index(),
        lessonType: LessonTypeQuery.single(),
        lessonTypeDayInfos: LessonTypeQuery.dayInfos(),
        massageTypes: MassageTypeQuery.index(),
        massageType: MassageTypeQuery.single(),
        massageRooms: MassageRoomQuery.index(),
        massageRoom: MassageRoomQuery.single(),
        massageRoomOpeningTime: MassageRoomQuery.openingTimes(),
        massageRoomDayInfos: MassageRoomQuery.dayInfos(),
        massageRoomDayPlan: MassageRoomQuery.dayPlan(),
        massageOrders: MassageOrderQuery.index(),
        massageOrder: MassageOrderQuery.single(),
        massageOrderReport: MassageOrderQuery.report(),
        lessons: LessonQuery.index(),
        lesson: LessonQuery.single(),
        lessonReport: LessonQuery.report(),
        lessonsInfo: LessonQuery.infos(),
        lessonInfo: LessonQuery.info(),
        lessonMembers: LessonMemberQuery.index(),
        lessonMember: LessonMemberQuery.single(),
        locations: LocationQuery.index(),
        location: LocationQuery.single(),
        openingTimes: OpeningTimeQuery.index(),
        openingTime: OpeningTimeQuery.single(),
        locationInfo: LocationQuery.info(),
        locationsInfo: LocationQuery.infos(),
        testHi: TestQuery.hi(),
        testIndex: TestQuery.index(),
        testGet: TestQuery.single(),
    },
});


const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Default mutation provided by the backend APIs',
    fields: {
        addUser: UserMutation.create(),
        updateUser: UserMutation.update(),
        hideUser: UserMutation.hide(),
        addClient: ClientMutation.create(),
        updateClient: ClientMutation.update(),
        hideClient: ClientMutation.hide(),
        addOrderItem: OrderItemMutation.create(),
        updateOrderItem: OrderItemMutation.update(),
        hideOrderItem: OrderItemMutation.hide(),
        addOrder: OrderMutation.create(),
        updateOrder: OrderMutation.update(),
        deleteOrder: OrderMutation.delete(),
        addLessonType: LessonTypeMutation.create(),
        updateLessonType: LessonTypeMutation.update(),
        hideLessonType: LessonTypeMutation.hide(),
        addMassageType: MassageTypeMutation.create(),
        updateMassageType: MassageTypeMutation.update(),
        hideMassageType: MassageTypeMutation.hide(),
        massageTypesOrdering: MassageTypeMutation.save_ordering(),
        addMassageRoom: MassageRoomMutation.create(),
        updateMassageRoom: MassageRoomMutation.update(),
        hideMassageRoom: MassageRoomMutation.hide(),
        addMassageOrder: MassageOrderMutation.create(),
        updateMassageOrder: MassageOrderMutation.update(),
        deleteMassageOrder: MassageOrderMutation.delete(),
        addLesson: LessonMutation.create(),
        addLessons: LessonMutation.multi_create(),
        updateLesson: LessonMutation.update(),
        deleteLesson: LessonMutation.delete(),
        addLessonMember: LessonMemberMutation.create(),
        updateLessonMember: LessonMemberMutation.update(),
        deleteLessonMember: LessonMemberMutation.delete(),
        addLocation: LocationMutation.create(),
        updateLocation: LocationMutation.update(),
        hideLocation: LocationMutation.hide(),
        addOpeningTime: OpeningTimeMutation.create(),
        addOpeningTimes: OpeningTimeMutation.create_multi(),
        updateOpeningTime: OpeningTimeMutation.update(),
        deleteOpeningTime: OpeningTimeMutation.delete(),
        cleanOpeningTimes: OpeningTimeMutation.clean_days(),
        testCreateMethod: TestMutation.create(),
        testDeleteMethod: TestMutation.delete(),
        testUpdateMethod: TestMutation.update(),
    },
});



// export the schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});
