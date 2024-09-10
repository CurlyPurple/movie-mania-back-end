// npm modules
import Nodemailer from 'nodemailer'

// models
import { MovieConcept } from "../models/movieConcept.js"
import { Profile } from "../models/profile.js"
import { User } from "../models/user.js"

async function create(req, res) {
  try {
    req.body.author = req.user.profile
    const concept = await MovieConcept.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: { movieConcepts: concept } },
      { new: true }
    )
    concept.author = profile
    res.status(201).json(concept)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function show(req, res) {
  try {
    const concept = await MovieConcept.findById(req.params.movieConId)
      .populate(['author', 'comments.author'])
    res.status(200).json(concept)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function update(req, res) {
  try {
    const concept = await MovieConcept.findByIdAndUpdate(
      req.params.movieConId,
      req.body,
      { new: true }
    ).populate('author')
    res.status(200).json(concept)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function index(req, res) {
  try {
    const concepts = await MovieConcept.find({})
      .populate('author')
      .sort({ createdAt: 'desc' })
    res.status(200).json(concepts)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function deleteMovieConcept(req,res) {
  try {
    const concept = await MovieConcept.findByIdAndDelete(req.params.movieConId)
    const profile = await Profile.findById(req.user.profile)
    profile.movieConcepts.remove({ _id: req.params.movieConId })
    await profile.save()
    res.status(200).json(concept)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function createComment(req, res) {
  try {
    req.body.author = req.user.profile
    const concept = await MovieConcept.findById(req.params.movieConId)
    .populate('author')
    concept.comments.push(req.body)
    await concept.save()
    const creator = await User.findOne({ profile: concept.author._id })

    const newComment = concept.comments.at(-1)

    const profile = await Profile.findById(req.user.profile)
    newComment.author = profile
    
    sendMail(
      creator.email,
      `New comment received for ${concept.title}`,
      `Hello ${creator.name}! 
      
      You have received following comment from ${profile.name}!

      MovieCon: ${concept.title} (Avg Rating: ${averageRating(concept)})
      Rating: ${newComment.rating}
      Comment: ${newComment.content}
      
      Regards,
      Movie Maniacs
      `
    )
    res.status(201).json(newComment)
  } catch (error) {
    res.status(500).json(error)
  }
}

async function updateComment(req, res) {
  try {
    const concept = await MovieConcept.findById(req.params.movieConId)
    const comment = concept.comments.id(req.body._id)
    comment.content = req.body.content
    comment.rating = req.body.rating
    await concept.save()
    res.status(200).json(concept)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function deleteComment(req, res) {
  try {
    const concept = await MovieConcept.findById(req.params.movieConId)
    concept.comments.remove({ _id: req.params.commentId })
    await concept.save()
    res.status(201).json(concept)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

/* === Helper Functions === */

function sendMail(email, subject, text) {
  let transporter = Nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'movie.mania.notifications@gmail.com',
      pass: process.env.GOOGLE_APP_PASSWORD
    }
  })

  transporter.sendMail({
    from: 'movie.mania.notifications@gmail.com',
    to: email,
    subject: `${subject}`,
    text: `${text}`
  })
}

function averageRating(movieCon) {
  const commentsArray = movieCon.comments
  return commentsArray.reduce((sum, {rating}) => sum + rating , 0) / commentsArray.length
}


export {
  create,
  show,
  update,
  index,
  deleteMovieConcept as delete,
  createComment,
  updateComment,
  deleteComment,
}