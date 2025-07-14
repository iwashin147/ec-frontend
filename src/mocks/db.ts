import { factory, primaryKey, oneOf, manyOf } from '@mswjs/data';
import { fakerJA as faker } from '@faker-js/faker';

export const db = factory({
  user: {
    id: primaryKey(faker.string.uuid),
    name: String,
    email: String,
    role: String,
    initials: String,
    permissions: Array,
  },
  product: {
    id: primaryKey(faker.string.uuid),
    name: String,
    description: String,
    price: Number,
    stock: Number,
    status: String,
    createdAt: String,
    category: oneOf('category', { nullable: true }),
    brand: oneOf('brand', { nullable: true }),
    images: manyOf('image'),
  },
  image: {
    id: primaryKey(faker.string.uuid),
    url: String,
    order: Number,
    product: oneOf('product'),
  },
  category: {
    id: primaryKey(faker.string.uuid),
    name: String,
    description: String,
    parent: oneOf('category', { nullable: true }),
  },
  brand: {
    id: primaryKey(faker.string.uuid),
    name: String,
    website: String,
    description: String,
  },
  order: {
    id: primaryKey(() => faker.string.alphanumeric(10).toUpperCase()),
    customerName: String,
    orderDate: String,
    status: String,
    totalAmount: Number,
    lineItems: Array,
  },
  coupon: {
    id: primaryKey(faker.string.uuid),
    code: String,
    discountType: String,
    discountValue: Number,
    status: String,
    expiresAt: () => faker.date.future().toISOString(),
    usageCount: Number,
    usageLimit: Number,
    targetType: String,
    targetId: String,
    targetName: String,
  },
  activityLog: {
    id: primaryKey(faker.string.uuid),
    timestamp: String,
    action: String,
    targetType: String,
    targetId: String,
    user: oneOf('user'),
  },
});

if (typeof window === 'undefined') {
  const fs = require('node:fs');
  const path = require('node:path');
  const dbFilePath = path.join(process.cwd(), 'src/mocks/db.json');

  const writeDb = () => {
    const data: Record<string, any[]> = {};
    for (const modelKey of Object.keys(db) as (keyof typeof db & string)[]) {
      const model = db[modelKey];
      if (model && typeof (model as any).getAll === 'function') {
        data[modelKey] = (model as any).getAll();
      }
    }
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
  };

  const readDb = (): Record<string, any[]> | null => {
    try {
      if (fs.existsSync(dbFilePath)) {
        const data = fs.readFileSync(dbFilePath, 'utf-8');
        return data ? JSON.parse(data) : null;
      }
    } catch (e) {
      console.error('Error reading or parsing db.json:', e);
    }
    return null;
  };

  const seedDatabase = () => {
    const adminUser = db.user.create({
      name: '管理者ユーザー',
      email: 'admin@example.com',
      role: '管理者',
      initials: 'AU',
      permissions: [
        'product:read',
        'product:create',
        'product:update',
        'product:delete',
        'order:read',
        'user:read',
        'user:invite',
        'coupon:read',
        'coupon:create',
      ],
    });
    const furniture = db.category.create({ name: 'オフィス家具' });
    const officeChair = db.category.create({
      name: 'オフィスチェア',
      parent: furniture,
    });
    const acme = db.brand.create({
      name: 'Acme Corporation',
      website: 'https://acme.com',
    });
    const product1 = db.product.create({
      name: '高機能オフィスチェア',
      price: 79800,
      stock: 15,
      status: '販売中',
      category: officeChair,
      brand: acme,
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      description: JSON.stringify([
        { type: 'paragraph', content: '最高の座り心地。' },
      ]),
    });
    db.image.create({
      url: faker.image.urlLoremFlickr({ category: 'chair' }),
      product: product1,
      order: 1,
    });
    const order1 = db.order.create({
      customerName: '田中 太郎',
      orderDate: faker.date.recent().toISOString(),
      status: '処理中',
      totalAmount: 79800,
      lineItems: [
        {
          productId: product1.id,
          productName: product1.name,
          quantity: 1,
          price: 79800,
        },
      ],
    });
    db.activityLog.create({
      user: adminUser,
      action: '注文が作成されました。',
      targetType: 'order',
      targetId: order1.id,
      timestamp: order1.orderDate,
    });
    console.log('🌱 Database seeded with initial data.');
    writeDb();
  };

  const initialData = readDb();
  if (!initialData || Object.keys(initialData).length === 0) {
    seedDatabase();
  } else {
    console.log('💾 Loading data from db.json...');

    // STEP 1: 全てのデータを、リレーションを除外して一旦作成する
    Object.keys(initialData).forEach((modelName) => {
      if ((db as any)[modelName]) {
        const records = initialData[modelName];
        if (Array.isArray(records)) {
          records.forEach((record) => {
            const recordWithoutRelations: Record<string, any> = {};
            for (const key in record) {
              const value = record[key];
              if (
                !(
                  value &&
                  typeof value === 'object' &&
                  'id' in value &&
                  !Array.isArray(value)
                )
              ) {
                recordWithoutRelations[key] = value;
              }
            }
            (db as any)[modelName].create(recordWithoutRelations);
          });
        }
      }
    });

    // STEP 2: 全てのデータがDBに存在している状態で、リレーションを更新する
    Object.keys(initialData).forEach((modelName) => {
      if ((db as any)[modelName]) {
        const records = initialData[modelName];
        if (Array.isArray(records)) {
          records.forEach((record) => {
            const relationsToUpdate: Record<string, any> = {};

            // [最終修正] リレーションのプロパティ名とモデル名を正しくマッピングする
            const relationshipToModelMap: Record<string, keyof typeof db> = {
              parent: 'category', // 'parent'プロパティは'category'モデルを指す
              category: 'category',
              brand: 'brand',
              user: 'user',
              product: 'product',
            };

            for (const key in record) {
              const value = record[key];
              if (
                value &&
                typeof value === 'object' &&
                'id' in value &&
                !Array.isArray(value)
              ) {
                const relatedModelName = relationshipToModelMap[key];
                if (relatedModelName) {
                  const entityId = value.id;
                  const relatedEntity = (db as any)[relatedModelName].findFirst(
                    {
                      where: { id: { equals: entityId } },
                    },
                  );
                  if (relatedEntity) {
                    relationsToUpdate[key] = relatedEntity;
                  }
                }
              }
            }

            if (Object.keys(relationsToUpdate).length > 0) {
              (db as any)[modelName].update({
                where: { id: { equals: record.id } },
                data: relationsToUpdate,
              });
            }
          });
        }
      }
    });
    console.log('✅ All data loaded and relations resolved.');
  }
}
