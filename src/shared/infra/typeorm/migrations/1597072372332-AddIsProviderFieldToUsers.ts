import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddIsProviderFieldToUsers1597072372332
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'is_provider',
        type: 'boolean',
        isNullable: true,
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'is_provider');
  }
}
