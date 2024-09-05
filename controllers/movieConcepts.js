import { MovieConcept } from "../models/movieConcept.js"
import { Profile } from "../models/profile.js"

async function create(req,res) {
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

export {
  create,
}