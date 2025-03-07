import * as fs from "node:fs";
import * as path from "node:path";
import { env } from "@/env";
import * as os from "node:os";
import { AppModule } from "@/app.module";
import { INestApplication } from "@nestjs/common";
import { ImageFileService } from "@/domains/image-files/image-file.service";
import { PrismaService } from "@/utils/prisma/prisma.service";
import { Test } from "@nestjs/testing";

describe("ImageFileService E2E Test", () => {
  let app: INestApplication;
  let imageFileService: ImageFileService;
  let prismaService: PrismaService;
  let testFolderPath: string;

  const mockUserId = "test-user-123";
  const testImagePath = path.resolve(
    __dirname,
    "../../../assets/test/test-image.jpeg",
  );
  const mockFile = {
    fieldname: "file",
    originalname: "test_image.png",
    encoding: "7bit",
    mimetype: "image/png",
    buffer: fs.readFileSync(testImagePath),
    size: fs.statSync(testImagePath).size,
    destination: "",
    filename: "",
    path: "",
  };

  const retentionTimeInSeconds = 1;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    imageFileService = app.get<ImageFileService>(ImageFileService);
    prismaService = app.get<PrismaService>(PrismaService);

    testFolderPath = path.join(os.homedir(), env.DISK_FILE_NAME, mockUserId);

    if (fs.existsSync(testFolderPath)) {
      fs.rmSync(testFolderPath, { recursive: true, force: true });
    }
  });

  beforeEach(async () => {
    await prismaService.imageFile.deleteMany({
      where: { userId: mockUserId },
    });

    if (!fs.existsSync(testFolderPath)) {
      fs.mkdirSync(testFolderPath, { recursive: true });
    }
  });

  afterEach(async () => {
    const files = fs.readdirSync(testFolderPath);
    for (const file of files) {
      fs.unlinkSync(path.join(testFolderPath, file));
    }
  });

  afterAll(async () => {
    if (fs.existsSync(testFolderPath)) {
      fs.rmSync(testFolderPath, { recursive: true, force: true });
    }

    await app.close();
  });

  describe("#createImageFile", () => {
    it("creates a file, and keeps it in the retention time", async () => {
      const createdFile = await imageFileService.createImageFile(
        mockUserId,
        mockFile as Express.Multer.File,
        retentionTimeInSeconds,
      );

      expect(createdFile).toBeDefined();
      expect(createdFile.id).toBeDefined();
      expect(createdFile.filePath).toBeDefined();

      expect(fs.existsSync(createdFile.filePath)).toBe(true);

      await new Promise((resolve) =>
        setTimeout(resolve, (retentionTimeInSeconds + 1) * 1000),
      );

      expect(fs.existsSync(createdFile.filePath)).toBe(false);

      const archivedFile = await prismaService.imageFile.findFirstOrThrow({
        where: { id: createdFile.id },
      });

      expect(archivedFile).toBeDefined();
      expect(archivedFile.isArchived).toBe(true);
    }, 15000);
  });
});
