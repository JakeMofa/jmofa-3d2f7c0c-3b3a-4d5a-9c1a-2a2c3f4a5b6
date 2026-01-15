import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Organization } from './app/entities/organization.entity.js';
import { User, UserRole } from './app/entities/user.entity.js';

async function seed() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: './dev.sqlite',
    entities: [Organization, User],
    synchronize: true,
  });

  await dataSource.initialize();

  const orgRepo = dataSource.getRepository(Organization);
  const userRepo = dataSource.getRepository(User);

  // Create parent organization
  const parentOrg = orgRepo.create({
    name: 'Parent Organization',
  });
  await orgRepo.save(parentOrg);

  // Create child organization
  const childOrg = orgRepo.create({
    name: 'Child Organization',
    parentOrgId: parentOrg.id,
  });
  await orgRepo.save(childOrg);

  // Create users with hashed passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  const owner = userRepo.create({
    email: 'owner@example.com',
    passwordHash,
    role: UserRole.OWNER,
    orgId: parentOrg.id,
  });

  const admin = userRepo.create({
    email: 'admin@example.com',
    passwordHash,
    role: UserRole.ADMIN,
    orgId: childOrg.id,
  });

  const viewer = userRepo.create({
    email: 'viewer@example.com',
    passwordHash,
    role: UserRole.VIEWER,
    orgId: childOrg.id,
  });

  await userRepo.save([owner, admin, viewer]);

  console.log('✅ Database seeded successfully!');
  console.log('\nTest credentials:');
  console.log('Owner:  owner@example.com / password123');
  console.log('Admin:  admin@example.com / password123');
  console.log('Viewer: viewer@example.com / password123');

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
