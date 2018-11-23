import {SystemUserController} from "./controller/SystemUserController";
import {ClientController} from "./controller/ClientController";
import { TherapistController } from "./controller/TherapistController";
import { AppointmentController } from "./controller/AppointmentController";
import { ActivityLogController } from "./controller/ActivityLogController";

export const Routes = [
{
    method: "get",
    route: "/user",
    controller: SystemUserController,
    action: "all"
}, {
    method: "get",
    route: "/user/:id",
    controller: SystemUserController,
    action: "one"
}, {
    method: "post",
    route: "/user",
    controller: SystemUserController,
    action: "save"
}, {
    method: "delete",
    route: "/user",
    controller: SystemUserController,
    action: "remove"
}
// clients
,{
    method: "get",
    route: "/client",
    controller: ClientController,
    action: "all"
}, {
    method: "get",
    route: "/client/:id",
    controller: ClientController,
    action: "one"
}, {
    method: "post",
    route: "/client",
    controller: ClientController,
    action: "create"
}
, {
    method: "post",
    route: "/client/:id",
    controller: ClientController,
    action: "save"
}
, {
    method: "delete",
    route: "/client/:id",
    controller: ClientController,
    action: "remove"
}
// therapists
,{
    method: "get",
    route: "/therapist",
    controller: TherapistController,
    action: "all"
}, {
    method: "get",
    route: "/therapist/:id",
    controller: TherapistController,
    action: "one"
}, {
    method: "post",
    route: "/therapist",
    controller: TherapistController,
    action: "create"
}
, {
    method: "post",
    route: "/therapist/:id",
    controller: TherapistController,
    action: "save"
}
, {
    method: "delete",
    route: "/therapist/:id",
    controller: TherapistController,
    action: "remove"
}
// appointments
,{
    method: "get",
    route: "/appointment",
    controller: AppointmentController,
    action: "all"
}, {
    method: "get",
    route: "/appointment/:id",
    controller: AppointmentController,
    action: "one"
}, {
    method: "post",
    route: "/appointment",
    controller: AppointmentController,
    action: "create"
}
, {
    method: "post",
    route: "/appointment/:id",
    controller: AppointmentController,
    action: "save"
}
, {
    method: "delete",
    route: "/appointment/:id",
    controller: AppointmentController,
    action: "remove"
}
// activity logs
,{
    method: "get",
    route: "/logs",
    controller: ActivityLogController,
    action: "all"
}
];