export enum EventAction {
  Create = "create",
  Update = "update",
  Delete = "delete",
  BulkCreate = "bulkCreate",
  BulkDelete = "bulkDelete",
}

export enum UserEventAction {
  Init = "init",
  Join = "join",
  Leave = "leave",
  Kicked = "kicked",
}

export enum EventNamespace {
  Connection = "connection",
  Disconnect = "disconnect",
  Exception = "exception",

  Issue = "issue",
  Vote = "vote",
  User = "user",
  Reveal = "reveal",
  Room = "room",
  RoomSettings = "roomSettings",
  RoomParticipant = "roomParticipant",

  Broadcast = "broadcast",
}

export enum BroadcastEventType {
  UpdateIssue = "updateIssue",
}
