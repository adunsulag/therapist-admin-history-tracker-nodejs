import { ActivityLog } from "../entity/ActivityLog";
import { ActivityLogDTO } from "../entity/ActivityLogDTO";

export class ActivityLogToDTO {
    static toDTO(l:ActivityLog) :ActivityLogDTO{
        return {
            date: l.creationDate
            ,tableName: l.tableName
            ,tableID: l.tableId
            ,action: l.action
            ,notes: l.notes
            ,systemUserEmail: l.createdBy ? l.createdBy.email : "<createdBy Missing>"
        };
    }
}