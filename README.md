# Cyolo Task

## Getting Started

To run the application:

1. `pnpm install`
2. `pnpm prepare`
3. `pnpm dev`

## Access Points

- Swagger documentation: http://localhost:3000/docs
- Queue system (Bull MQ): http://localhost:3000/api/queues
- React application: http://localhost:8080

## Testing

You can run the end-to-end test from the Nest application:
```
apps/api/src/domains/image-files/image-file.service.e2e.test.ts
```

Run the test with: `pnpm test:e2e`

## Known Issues

**I misunderstood the get file requirements, thought it requires transferring the local file URI**
as described (file-url), I understood it's abnormal, but took it as part of the task.

## Technologies Used

1. TurboRepo (first time)
2. Redis
3. PostgreSQL
4. NestJS
5. React + Tanstack Router (first time) + Redux Toolkit (second time)(considered xstate/store but glad I didn't)
6. Biome (first time)
7. Shadcn and Tailwind

## Project Notes

### Design Decisions

This is a simplified version of the project. I could have gone with an even simpler approach, **but where's the fun in that?**

Alternative approach would have been:
- Use Redis for scheduling/cron
- Use local memory/file/file+database(AlaSQL) for records
- Extract using format like `{[timeUtc]: record}`
- Check every second using cron
- Spawn a process

For large files, we might miss timing by a second. To handle this, we could calculate delay from request time rather than persist time.

### Unknowns/Research Needed

I installed all packages in the root package.json (like in NX), expecting TurboRepo to inject them by each app's requirements. Not sure if this is the correct approach or if I should split requirements into individual package.json files.

### Additional Logic

I implemented both path and ID functionality for finding resources, although ID is the proper way for CRUD operations. Using path for this case.

### Testing

As the project grew quite large, I only tested the core functionality through the e2e test. Everything else was manually tested.

### Notes

- Disclaimer - I partially borrowed the BaseQueueWorkerService from another project of mine
- Question: Why use PUT instead of POST for file uploads?
- Unusual task requirements overall ( as S3 signed URL would work here perfectly instead )

### Time Sinks

1. Wasted ~1.5 hours on this change:
   From:
   {
     url: "file",
     method: "PUT",
     body: formData,
     ...
   }
   
   To:
   {
     url: "file",
     method: "PUT",
     data: formData,
     ...
   }

2. Wasted another 1.5 hours on loading chunks in the response instead of just buffering the file.
3. and another few hours over receiving the file via axois which requires the key of responseType: 'blob' because it serializes the response.
