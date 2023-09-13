import fastify from 'fastify';
import { getAllPromptsRoute } from './routes/getAllPrompts';
import { uploadVideo } from './routes/uploadVideo';

import 'dotenv/config'
import { createTranscription } from './routes/createTranscription';
import { generateAiCompletion } from './routes/generateAiCompletion';

const app = fastify()

app.register(getAllPromptsRoute)
app.register(uploadVideo)
app.register(createTranscription)
app.register(generateAiCompletion)

app.listen({ port: 3333 }).then(() => console.log('Running...'))