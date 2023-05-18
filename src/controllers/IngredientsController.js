const IngredientRepository = require('../repositories/IngredientRepository')
const IngredientServices = require('../services/IngredientServices')

const knex = require('../database/knex/index')

class IngredientsCotroller {
  async index(req, res) { }

  async get(request, response) {
    const { id } = request.params

    // const ingredientRepository = new IngredientRepository()
    // const ingredientServices = new IngredientServices(ingredientRepository)

    const maxId = await knex('ingredients').where({ food_id: id }).max('id as maxId')
    const nextId = maxId[0].maxId ? maxId[0].maxId + 1 : 1
    console.log(maxId, nextId);

    return response.json(nextId)
  }
}

module.exports = IngredientsCotroller