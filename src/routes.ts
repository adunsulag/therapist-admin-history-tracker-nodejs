import {SystemUserController} from "./controller/SystemUserController";
import {ClientController} from "./controller/ClientController";
import { TherapistController } from "./controller/TherapistController";

export const Routes = [
{
    method: "get",
    route: "/users",
    controller: SystemUserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: SystemUserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: SystemUserController,
    action: "save"
}, {
    method: "delete",
    route: "/users",
    controller: SystemUserController,
    action: "remove"
}
// clients
,{
    method: "get",
    route: "/clients",
    controller: ClientController,
    action: "all"
}, {
    method: "get",
    route: "/clients/:id",
    controller: ClientController,
    action: "one"
}, {
    method: "post",
    route: "/clients",
    controller: ClientController,
    action: "create"
}
, {
    method: "post",
    route: "/clients/:id",
    controller: ClientController,
    action: "save"
}
, {
    method: "delete",
    route: "/clients/:id",
    controller: ClientController,
    action: "remove"
}
// therapists
,{
    method: "get",
    route: "/therapists",
    controller: TherapistController,
    action: "all"
}, {
    method: "get",
    route: "/therapists/:id",
    controller: TherapistController,
    action: "one"
}, {
    method: "post",
    route: "/therapists",
    controller: TherapistController,
    action: "create"
}
, {
    method: "post",
    route: "/therapists/:id",
    controller: TherapistController,
    action: "save"
}
, {
    method: "delete",
    route: "/therapists/:id",
    controller: TherapistController,
    action: "remove"
}
];