import Model from './Model.js'

export default class Category extends Model {
  buildUrl (request) {
    const { params } = request
    return ['categories', ...params]
  }

  static async update (id, data) {
    return (new this()).request({ method: 'POST', url: `categories/${id}`, data, isStatic: true })
  }
}
