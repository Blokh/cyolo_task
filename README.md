# Cyolo Task
In order to run the app you need:
1. pnpm install
2. pnpm prepare
3. pnpm dev

you will have swagger at 
http://localhost:3000/docs
the queue system ( bull mq ):
http://localhost:3000/api/queues

react app at
http://localhost:8080

you can run from the nest application the test which is at
apps/api/src/domains/image-files/image-file.service.e2e.test.ts

unfortunately the file is being fetched by the rendering had some issues,  ( the image preview )
firstly i used stream in order to stream, it wasn't successful.


Techonologies:
1. TurboRepo (first time)
2. redis 
3. postgres
4. nestjs
5. react + tanstack router (first time) + reduxjs toolkit - (wanted to use xstate/store. glad I didn't)
6. biome (first time)

Overall Notes over the proejct:
Simplified version of the project
I couldn've gone with the simple version but where's the fun with this?
just use redis for the scheduling, use local memory/file/file+database(AlaSQL) like for records and extract, but decided to use postgres as it should be production and scale-wise properly set.

Unknowns/things i need to research -
I installed all the packages in the root package.json like you would do in NX. and the turbo repo should inject them by the app's requirements.
not sure if it works this way or whether i should split it unto each package json and it's requirements.

Additional logic -
I don't understand why find by path, but I've added both functionalities, one with ID and one with path.
I'll use path for this case but the id is ofc the proper way to do CRUD.


to run the test run pnpm jest - the test file is only /Users/blokh/tasks/cyolo_task/apps/api/src/domains/image-files/image-file.service.e2e.test.ts
as the project gone too big already, and i wanted to finish i tested only this functionality. everything else went through manual testing.


P.S I partially took the BaseQueueWorkerService from a different project of mine.

I wasted around 1.5 over this change:
I went pretty much insane, why with body: the content length was 0.
from: {
url: "file",
method: "PUT",
body: formData,
...

to: {
url: "file",
method: "PUT",
data: formData,
...

Wasted 1.5 more on loading chuncks in the response instead of just buffering the file.

overall too tired to finish it.