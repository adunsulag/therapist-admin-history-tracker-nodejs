import {MigrationInterface, QueryRunner} from "typeorm";

export class PopulateApplicationUser1543082749617 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`INSERT INTO system_user("identityId", email, active, 
            "creationDate", "lastUpdatedDate", "lastUpdatedById", "createdById")
            VALUES ('', 'stephen@nielson.org', true, NOW(), NOW(), 1, 1) ON CONFLICT(id) DO NOTHING`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // we don't want to delete the record..
        await queryRunner.query(`DELETE FROM system_user WHERE email = 'stephen@nielson.org'`);
    }

}
