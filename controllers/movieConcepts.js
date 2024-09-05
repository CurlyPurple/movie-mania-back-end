import { MovieConcept } from "../models/movieConcept.js"
import { Profile } from "../models/profile.js"

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
    const concept = await MovieConcept.findById(req.params.movieConceptId)
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
      req.params.movieConceptId,
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
    const concept = await MovieConcept.findByIdAndDelete(req.params.movieConceptId)
    const profile = await Profile.findById(req.user.profile)
    profile.movieConcepts.remove({ _id: req.params.movieConceptId })
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
    const concept = await MovieConcept.findById(req.params.movieConceptId)
    concept.comments.push(req.body)
    await concept.save()

    const newComment = concept.comments.at(-1)

    const profile = await Profile.findById(req.user.profile)
    newComment.author = profile

    res.status(201).json(newComment)
  } catch (error) {
    res.status(500).json(error)
  }
}

async function updateComment(req, res) {
  try {
    const concept = await MovieConcept.findById(req.params.movieConceptId)
    const comment = concept.comments.id(req.body._id)
    comment.content = req.body.content
    await concept.save()
    res.status(200).json(concept)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function deleteComment(req, res) {
  try {
    const concept = await MovieConcept.findById(req.params.movieConceptId)
    concept.comments.remove({ _id: req.params.commentId })
    await concept.save()
    res.status(201).json(concept)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
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