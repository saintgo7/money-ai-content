import { PrismaClient, UserRole, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aicontentplatform.com' },
    update: {},
    create: {
      email: 'admin@aicontentplatform.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create demo organization
  const org = await prisma.organization.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: {
      name: 'Demo Company',
      slug: 'demo-company',
      description: 'Demo organization for testing',
      members: {
        create: {
          userId: admin.id,
          role: 'OWNER',
        },
      },
    },
  });

  console.log('✅ Created demo organization:', org.name);

  // Create subscription
  await prisma.subscription.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      organizationId: org.id,
      plan: SubscriptionPlan.PRO,
      status: SubscriptionStatus.ACTIVE,
      contentLimit: 500,
      teamMemberLimit: 10,
      storageLimit: 100,
      apiCallLimit: 10000,
    },
  });

  console.log('✅ Created subscription for organization');

  // Create brand profile
  const brandProfile = await prisma.brandProfile.create({
    data: {
      name: 'Demo Brand',
      userId: admin.id,
      organizationId: org.id,
      writingStyle: {
        sentenceLength: 'medium',
        complexity: 6,
        vocabularyLevel: 'moderate',
      },
      toneAttributes: {
        formal: 5,
        serious: 4,
        playful: 6,
        empathetic: 7,
        authoritative: 5,
      },
      vocabularyPatterns: {
        preferredTerms: ['innovative', 'cutting-edge', 'seamless'],
        avoidedTerms: ['cheap', 'basic', 'simple'],
        brandTerms: ['AI-powered', 'next-generation'],
      },
      ctaStyle: 'Action-oriented with urgency',
      hashtagStyle: 'Relevant industry hashtags with branded hashtags',
      emojiUsage: {
        frequency: 'moderate',
        types: ['✨', '🚀', '💡', '🎯'],
      },
      colors: ['#3B82F6', '#8B5CF6', '#EC4899'],
      fonts: ['Inter', 'Poppins'],
      guidelines: 'Professional yet approachable. Focus on innovation and user empowerment.',
      sampleContents: [
        'Discover the future of content creation with our AI-powered platform. 🚀',
        'Transform your ideas into engaging content in seconds. No more creative blocks!',
        'Join thousands of creators who trust our platform for their content needs.',
      ],
    },
  });

  console.log('✅ Created brand profile:', brandProfile.name);

  // Create demo project
  const project = await prisma.project.create({
    data: {
      name: 'Q4 Marketing Campaign',
      description: 'Marketing content for Q4 2024',
      userId: admin.id,
      organizationId: org.id,
    },
  });

  console.log('✅ Created demo project:', project.name);

  // Create sample content
  await prisma.content.create({
    data: {
      type: 'SOCIAL_POST',
      platform: 'INSTAGRAM',
      title: 'Product Launch Post',
      body: '🚀 Exciting news! Our new AI content generator is here to revolutionize your workflow. Create stunning content in minutes, not hours. #AI #ContentCreation #Innovation',
      summary: 'Product launch announcement for Instagram',
      tags: ['product-launch', 'ai', 'announcement'],
      keywords: ['AI', 'content', 'generator', 'automation'],
      metadata: {
        hashtags: ['#AI', '#ContentCreation', '#Innovation'],
        estimatedReach: 10000,
      },
      userId: admin.id,
      projectId: project.id,
      brandProfileId: brandProfile.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  console.log('✅ Created sample content');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
