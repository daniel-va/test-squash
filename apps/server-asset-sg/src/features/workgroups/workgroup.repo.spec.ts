import { Role, WorkgroupData } from '@asset-sg/shared/v2';
import { faker } from '@faker-js/faker';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { clearPrismaAssets, setupDB, setupDefaultWorkgroup } from '../../../../../test/setup-db';
import { PrismaService } from '@/core/prisma.service';
import { UserRepo } from '@/features/users/user.repo';
import { WorkgroupRepo } from '@/features/workgroups/workgroup.repo';

describe('WorkgroupRepo', () => {
  const prisma = new PrismaService();
  const repo = new WorkgroupRepo(prisma);
  const userRepo = new UserRepo(prisma);

  beforeAll(async () => {
    await setupDB(prisma);
  });

  beforeEach(async () => {
    await clearPrismaAssets(prisma);

    // Delete the default workgroup.
    await prisma.workgroup.deleteMany();
  });

  describe('find', () => {
    it('returns `null` when searching for a non-existent record', async () => {
      // When
      const workgroup = await repo.find(2);

      // Then
      expect(workgroup).toBeNull();
    });
    it('returns the record associated with a specific id', async () => {
      // Given
      const data: WorkgroupData = { name: 'test', disabledAt: null, users: new Map() };
      const expected = await repo.create(data);

      // When
      const actual = await repo.find(expected.id);

      // Then
      expect(actual).not.toBeNull();
      expect(actual).toEqual(expected);
    });
  });

  describe('list', () => {
    it('returns an empty list when no records exist', async () => {
      // When
      const workgroups = await repo.list({ limit: 100 });

      // Then
      expect(workgroups).toEqual([]);
    });
    it('returns the specified amount of records', async () => {
      // Given
      const record1 = await repo.create({ name: 'Test 1', disabledAt: null, users: new Map() });
      const record2 = await repo.create({ name: 'Test 2', disabledAt: null, users: new Map() });
      const record3 = await repo.create({ name: 'Test 3', disabledAt: null, users: new Map() });
      await repo.create({ name: 'Test 4', disabledAt: null, users: new Map() });
      await repo.create({ name: 'Test 5', disabledAt: null, users: new Map() });

      // When
      const workgroups = await repo.list({ limit: 3 });

      // Then
      expect(workgroups).toHaveLength(3);
      expect(workgroups).toEqual([record1, record2, record3]);
    });
    it('returns the records appearing after the specified offset', async () => {
      //Given
      await repo.create({ name: 'Test 1', disabledAt: null, users: new Map() });
      await repo.create({ name: 'Test 2', disabledAt: null, users: new Map() });
      const record1 = await repo.create({ name: 'Test 3', disabledAt: null, users: new Map() });
      const record2 = await repo.create({ name: 'Test 4', disabledAt: null, users: new Map() });
      const record3 = await repo.create({ name: 'Test 5', disabledAt: null, users: new Map() });

      // When
      const workgroups = await repo.list({ limit: 3, offset: 2 });

      // Then
      expect(workgroups).toHaveLength(3);
      expect(workgroups).toEqual([record1, record2, record3]);
    });
    it('returns an empty list when offset is greater than the number of records', async () => {
      //Given
      await repo.create({ name: 'Test 1', disabledAt: null, users: new Map() });
      await repo.create({ name: 'Test 2', disabledAt: null, users: new Map() });
      await repo.create({ name: 'Test 3', disabledAt: null, users: new Map() });
      await repo.create({ name: 'Test 4', disabledAt: null, users: new Map() });
      await repo.create({ name: 'Test 5', disabledAt: null, users: new Map() });

      // When
      const workgroups = await repo.list({ limit: 3, offset: 5 });

      // Then
      expect(workgroups).toEqual([]);
    });
  });

  describe('create', () => {
    it('creates a new record', async () => {
      // Given
      await setupDefaultWorkgroup(prisma);
      const user = await userRepo.create({
        email: faker.internet.email(),
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        lang: 'de',
        oidcId: faker.string.uuid(),
        isAdmin: false,
        roles: new Map(),
      });
      const data: WorkgroupData = {
        name: 'test',
        disabledAt: null,
        users: new Map([
          [
            user.id,
            {
              role: Role.MasterEditor,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          ],
        ]),
      };

      // When
      const workgroup = await repo.create(data);

      // Then
      expect(workgroup.name).toEqual(data.name);
      expect(workgroup.disabledAt).toEqual(data.disabledAt);
      expect(workgroup.users).toEqual(data.users);
    });
  });

  describe('update', () => {
    it('returns `null` when updating a non-existent record', async () => {
      //Given
      const data: WorkgroupData = { name: 'test', disabledAt: null, users: new Map() };

      // When
      const workgroup = await repo.update(1, data);

      // Then
      expect(workgroup).toBeNull();
    });
    it('updates an existing record', async () => {
      //Given
      await setupDefaultWorkgroup(prisma);
      const user = await userRepo.create({
        email: faker.internet.email(),
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        lang: 'de',
        oidcId: faker.string.uuid(),
        isAdmin: false,
        roles: new Map(),
      });
      const initialWorkgroup: WorkgroupData = { name: 'test', disabledAt: null, users: new Map() };
      const workgroup = await repo.create(initialWorkgroup);
      const data: WorkgroupData = {
        name: 'new name',
        disabledAt: new Date(),
        users: new Map([
          [
            user.id,
            {
              role: Role.MasterEditor,
              email: user.email,
              lastName: user.lastName,
              firstName: user.firstName,
            },
          ],
        ]),
      };

      //When
      const updatedWorkgroup = await repo.update(workgroup.id, data);

      //Then
      expect(updatedWorkgroup.name).toEqual(data.name);
      expect(updatedWorkgroup.disabledAt).toEqual(data.disabledAt);
      expect(updatedWorkgroup.users).toEqual(data.users);
    });
  });
  describe('delete', () => {
    it('returns `false` when deleting a non-existent record', async () => {
      // When
      const deleted = await repo.delete(2);

      // Then
      expect(deleted).toBe(false);
    });
    it('removes a record and its relations from the database', async () => {
      //Given
      await setupDefaultWorkgroup(prisma);
      const user = await userRepo.create({
        email: faker.internet.email(),
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        lang: 'de',
        oidcId: faker.string.uuid(),
        isAdmin: false,
        roles: new Map(),
      });
      const data: WorkgroupData = {
        name: 'test',
        disabledAt: null,
        users: new Map([
          [
            user.id,
            {
              role: Role.MasterEditor,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          ],
        ]),
      };
      const workgroup = await repo.create(data);

      //When
      const deleted = await repo.delete(workgroup.id);
      expect(deleted).toBe(true);

      const assetCount = await prisma.asset.count({ where: { assetId: workgroup.id } });
      expect(assetCount).toBe(0);

      const userCount = await prisma.workgroupsOnUsers.count({ where: { workgroupId: workgroup.id } });
      expect(userCount).toBe(0);
    });
  });
});
