import {SystemUserController} from "./controller/SystemUserController";
import {ClientController} from "./controller/ClientController";

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
];