import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment'
import Comment from 'App/Models/Comment'

export default class CommentsController {
  public async store({ request, params, response }: HttpContextContract) {
    try {
      const body = request.body()
      const momentId = params.momentId

      await Moment.findOrFail(momentId)

      const newComment = {
        momentId,
        username: body.username,
        text: body.text,
      }

      const comment = await Comment.create(newComment)

      response.status(201)

      return {
        message: 'Comment created succesfully',
        data: comment,
      }
    } catch (error) {
      return {
        error: error.message,
      }
    }
  }

  public async index({ params }: HttpContextContract) {
    const momentId = params.momentId

    const moment = await Moment.findOrFail(momentId)
    if (moment) {
      const comments = await Comment.query().where('moment_id', momentId)

      return {
        data: comments,
      }
    }
  }

  public async show({ params }: HttpContextContract) {
    const momentId = params.momentId
    const commentId = params.id

    const moment = await Moment.findOrFail(momentId)
    if (moment) {
      const comment = await Comment.findOrFail(commentId)
      return {
        data: comment,
      }
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const momentId = params.momentId
    const commentId = params.id

    const { text } = body

    const moment = await Moment.findOrFail(momentId)
    if (moment) {
      const comment = await Comment.findOrFail(commentId)
      comment.text = text

      await comment.save()

      return {
        data: comment,
      }
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const momentId = params.momentId
    const commentId = params.id

    const moment = await Moment.findOrFail(momentId)
    if (moment) {
      const comment = await Comment.findOrFail(commentId)
      await comment.delete()

      return {
        message: 'Comment deleted succesfully',
      }
    }
  }
}
