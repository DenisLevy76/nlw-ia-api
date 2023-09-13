import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { createReadStream } from 'fs';
import { z } from 'zod'
import { openai } from '../lib/openai';

export const createTranscription = async (app: FastifyInstance) => {
  app.post('/videos/:videoId/transcription', async (request, reply) => {
    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    })

    const bodySchema = z.object({
      prompt: z.string(),
    })

    const { videoId } = paramsSchema.parse(request.params)
    const { prompt } = bodySchema.parse(request.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId
      }
    })

    const audioReadStream = createReadStream(video.path)

    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0.1,
      prompt
    })

    await prisma.video.update({
      where: { id: videoId },
      data: {
        transcription: response.text
      }
    })

    return reply.status(200).send({
      transcription: response.text
    })
  })
}