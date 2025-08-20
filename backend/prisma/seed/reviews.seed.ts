import { faker } from '@faker-js/faker';
import { SeederContext } from './types';
import { pick } from './constants';

interface SeedReviewsOptions {
  doctors: any[];
  users: any[];
}

export async function seedReviews(
  { prisma, debug = false }: SeederContext,
  { doctors, users }: SeedReviewsOptions,
) {
  if (debug) console.log('🌱 Seeding reviews...');

  const reviews: any[] = [];
  const numReviews = faker.number.int({ min: 50, max: 150 });

  for (let i = 0; i < numReviews; i++) {
    const doctor = pick(doctors);
    const user = pick(users);
    
    const serviceType = pick(['doctor', 'hospital', 'lab', 'medicine']);
    const rating = faker.number.int({ min: 1, max: 5 });
    const experience = pick(['positive', 'negative', 'neutral']);

    const review = await prisma.review.create({
      data: {
        serviceId: doctor.id,
        serviceType: serviceType as any,
        doctorId: doctor.id,
        rating,
        reviewText: faker.lorem.sentence(),
        isPinned: faker.datatype.boolean({ probability: 0.1 }), // 10% chance of being pinned
        publishedBy: user.id,
        publishedAt: faker.date.recent({ days: 30 }),
        overallExperience: experience as any,
        isPublished: faker.datatype.boolean({ probability: 0.9 }), // 90% published
        // Note: meta field not available in Review model
      },
    });

    reviews.push(review);
  }

  if (debug) console.log(`✅ Seeded ${reviews.length} reviews`);
  return reviews;
}
